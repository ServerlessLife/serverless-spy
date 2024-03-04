import { device } from 'aws-iot-device-sdk';
import { FunctionRequestSpyEvent } from '../common/spyEvents/FunctionRequestSpyEvent';
import { SpyEvent } from '../common/spyEvents/SpyEvent';
import { SpyMessage } from '../common/spyEvents/SpyMessage';
import { fragment, getConnection, SSPY_TOPIC } from './iot-connection';
import { ServerlessSpyListener } from './ServerlessSpyListener';
import { ServerlessSpyListenerParams } from './ServerlessSpyListenerParams';
import { WaitForParams } from './WaitForParams';

export class WsListener<TSpyEvents> {
  private messages: SpyMessageStorage[] = [];
  private trackers: Tracker[] = [];

  private connectionOpenResolve?: () => void;
  private connectionOpenReject?: (reason?: any) => void;
  private closed = true;
  private functionPrefix = 'waitFor';
  private debugMode = false;
  private connection: device | undefined;

  private fragments = new Map<string, Map<number, fragment>>();

  public async start(params: ServerlessSpyListenerParams) {
    this.debugMode = !!params.debugMode;
    try {
      this.connection = await getConnection(this.debugMode);
      const topic = `${SSPY_TOPIC}/${params.scope}`;
      this.log(`Subscribing to topic ${topic}`);
      this.closed = false;
      const connectionOpenResolve = this.connectionOpenResolve;
      const localConnection = this.connection;
      this.connection.on('connect', () => {
        this.closed = false;
        this.log('Connection opened');
        localConnection.subscribe(topic);
        if (connectionOpenResolve) {
          connectionOpenResolve();
        }
      });
      this.connection.on('message', (_topic, data: Buffer) => {
        if (this.closed) return;

        this.log('Message received', data.toString());
        const fragment = JSON.parse(data.toString());
        let message: SpyMessageStorage | undefined = undefined;
        if (!fragment.id) {
          message = JSON.parse(fragment.data) as SpyMessageStorage;
        }

        let pending = this.fragments.get(fragment.id);
        if (!pending) {
          pending = new Map();
          this.fragments.set(fragment.id, pending);
        }
        pending.set(fragment.index, fragment);

        if (pending.size === fragment.count) {
          const data = [...pending.values()]
            .sort((a, b) => a.index - b.index)
            .map((item) => item.data)
            .join('');
          this.fragments.delete(fragment.id);
          message = JSON.parse(data) as SpyMessageStorage;
        }

        if (message) {
          message.serviceKeyForFunction = message.serviceKey.replace(/#/g, '');

          if (message.serviceKey.startsWith('Function')) {
            message.functionContextAwsRequestId = (
              message.data as FunctionRequestSpyEvent
            ).context.awsRequestId;
          }

          this.messages.push(message);
          this.resolveOldTrackerWithNewMessage(message);
        }
      });
      this.connection.on('close', () => {
        this.log('Connection closed');

        this.closed = true;
      });

      const connectionOpenReject = this.connectionOpenReject;
      this.connection.on('error', (error) => {
        this.log('Connection error:', error);
        connectionOpenReject?.(error);
      });
    } catch (e) {
      console.error('Failed to get connection', e);
      throw e;
    }
  }

  public async stop() {
    this.closed = true;
    this.connection!.end();
  }

  private trackerMatchMessage(tracker: Tracker, message: SpyMessageStorage) {
    if (tracker.finished) return;

    if (
      (tracker.serviceKey && tracker.serviceKey === message.serviceKey) ||
      (tracker.serviceKeyForFunction &&
        tracker.serviceKeyForFunction === message.serviceKeyForFunction)
    ) {
      if (this.trackerMatchCondition(tracker, message)) {
        tracker.finished = true;

        const spyAndJestMatchers: any = {
          getData: () => message.data,
        };

        const serviceKeyForFunction = tracker.serviceKeyForFunction;
        if (
          serviceKeyForFunction &&
          serviceKeyForFunction.startsWith('Function') &&
          (serviceKeyForFunction.endsWith('Request') ||
            serviceKeyForFunction.endsWith('Console'))
        ) {
          let serviceKeyForFunctionChain = serviceKeyForFunction;

          if (serviceKeyForFunctionChain.endsWith('Request')) {
            serviceKeyForFunctionChain = serviceKeyForFunctionChain.substring(
              0,
              serviceKeyForFunctionChain.length - 'Request'.length
            );
          } else if (serviceKeyForFunctionChain.endsWith('Console')) {
            serviceKeyForFunctionChain = serviceKeyForFunctionChain.substring(
              0,
              serviceKeyForFunctionChain.length - 'Console'.length
            );
          }

          spyAndJestMatchers.followedByConsole = (paramsW: WaitForParams) => {
            return this.createWaitForXXXFunc(
              `${serviceKeyForFunctionChain}Console`,
              (message.data as FunctionRequestSpyEvent).context.awsRequestId
            )(paramsW);
          };

          spyAndJestMatchers.followedByResponse = (paramsW: WaitForParams) => {
            return this.createWaitForXXXFunc(
              `${serviceKeyForFunctionChain}Response`,
              (message.data as FunctionRequestSpyEvent).context.awsRequestId
            )(paramsW);
          };
        }

        const proxy = new Proxy(spyAndJestMatchers, {
          get: function (target: any, objectKey: string) {
            if (target.hasOwnProperty(objectKey)) {
              return target[objectKey];
            } else if (objectKey !== 'then') {
              return function () {
                const jestFunctionToExecute = (expect(message.data) as any)[
                  objectKey
                ];
                jestFunctionToExecute.apply(undefined, arguments);
                return proxy;
              };
            }
          },
        });

        tracker.promiseResolve(proxy);
        return true;
      }
    }
    return false;
  }

  private resolveTrackerInOldMessages(tracker: Tracker) {
    for (const message of this.messages) {
      if (this.trackerMatchMessage(tracker, message)) {
        return true;
      }
    }

    return false;
  }

  private resolveOldTrackerWithNewMessage(message: SpyMessageStorage) {
    for (let index = 0; index < this.trackers.length; index++) {
      const tracker = this.trackers[index];
      if (this.trackerMatchMessage(tracker, message)) {
        this.trackers = this.trackers.splice(index, 1);
        return true;
      }
    }

    return false;
  }

  private trackerMatchCondition(tracker: Tracker, message: SpyMessageStorage) {
    const matchCondition =
      (tracker.condition && tracker.condition(message.data)) ||
      !tracker.condition;

    const matchRequestId =
      (tracker.functionContextAwsRequestId &&
        tracker.functionContextAwsRequestId ===
          message.functionContextAwsRequestId) ||
      !tracker.functionContextAwsRequestId;

    if (matchCondition && matchRequestId) {
      return true;
    } else {
      if (
        !matchCondition &&
        matchRequestId &&
        !tracker.possibleSpyMessageDataForDebugging
      ) {
        tracker.possibleSpyMessageDataForDebugging = message.data;
      }
      return false;
    }
  }

  private createWaitForXXXFunc(
    serviceKeyForFunction: string,
    functionContextAwsRequestId?: string
  ) {
    let tracker: Tracker;

    const promise = new Promise((resolve, reject) => {
      tracker = {
        finished: false,
        promiseResolve: resolve,
        promiseReject: reject,
        serviceKeyForFunction,
        functionContextAwsRequestId,
      };
    });

    return (paramsW?: WaitForParams<SpyEvent>) => {
      tracker.condition = paramsW?.condition;

      const timer = setTimeout(() => {
        if (tracker.finished) return;
        tracker.finished = true;
        let message = `Timeout waiting for Serverless Spy message ${serviceKeyForFunction}.`;

        if (tracker.possibleSpyMessageDataForDebugging) {
          message += ` Similar matching spy event data: ${JSON.stringify(
            tracker.possibleSpyMessageDataForDebugging,
            null,
            2
          )}`;
        }

        tracker.promiseReject(new Error(message));
      }, paramsW?.timoutMs || 10000);

      void promise.finally(() => {
        clearTimeout(timer);
      });

      if (!this.resolveTrackerInOldMessages(tracker)) {
        this.trackers.push(tracker);
      }

      return promise;
    };
  }

  public createProxy() {
    const spyListener = {} as ServerlessSpyListener<TSpyEvents>;

    spyListener.stop = async () => {
      await this.stop();
    };

    const proxy = new Proxy(spyListener, {
      get: (target: any, objectKey: string) => {
        if (target.hasOwnProperty(objectKey)) {
          return target[objectKey];
        } else if (
          typeof objectKey === 'string' &&
          objectKey.startsWith(this.functionPrefix)
        ) {
          const serviceKeyForFunction = objectKey.substring(
            this.functionPrefix.length
          );

          return this.createWaitForXXXFunc(serviceKeyForFunction);
        }
      },
    });

    return proxy as ServerlessSpyListener<TSpyEvents>;
  }

  private log(message: string, ...optionalParams: any[]) {
    if (this.debugMode) {
      console.debug('SSPY', message, ...optionalParams);
    }
  }
}

type Tracker = {
  promiseResolve: (data: any) => void;
  promiseReject: (data: any) => void;
  finished: boolean;
  serviceKey?: string;
  serviceKeyForFunction?: string;
  condition?: (data: any) => boolean;
  timoutMs?: number;
  functionContextAwsRequestId?: string;
  possibleSpyMessageDataForDebugging?: any;
};

type SpyMessageStorage = SpyMessage & {
  serviceKeyForFunction: string;
  functionContextAwsRequestId?: string;
};
