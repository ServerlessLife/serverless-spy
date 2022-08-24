/* eslint-disable no-prototype-builtins */
import { Credentials } from '@aws-sdk/types';
import { getWebSocketUrl } from 'serverless-spy-common/getWebSocketUrl';
import { FunctionRequestSpyEvent } from 'serverless-spy-common/spyEvents/FunctionRequestSpyEvent';
import { SpyEvent } from 'serverless-spy-common/spyEvents/SpyEvent';
import { SpyMessage } from 'serverless-spy-common/spyEvents/SpyMessage';
import WebSocket from 'ws';
import { SpyListener } from './SpyListener';

type ServerlessSpyListenerParams = {
  serverlessSpyWsUrl: string;
  credentials?: Credentials;
};

export async function createServerlessSpyListener<TSpyEvents>(
  params: ServerlessSpyListenerParams
) {
  const urlSigned = await getWebSocketUrl(
    params.serverlessSpyWsUrl,
    params.credentials
  );
  const ws = new WebSocket(urlSigned);
  const messages: SpyMessageStorage[] = [];
  let trackers: Tracker[] = [];
  let closed = false;
  const functionPrefix = 'waitFor';
  let connectionOpenResolve: (value: unknown) => void;

  let waitForConnection = new Promise((resolve) => {
    connectionOpenResolve = resolve;
  });

  ws.on('open', () => {
    console.log('connected ' + new Date().toISOString());
    connectionOpenResolve(undefined);
  });
  ws.on('message', (data) => {
    if (closed) return;

    console.log(`From server: ${data}`);

    const message = JSON.parse(data.toString()) as SpyMessageStorage;

    message.serviceKeyForFunction = message.serviceKey.replace(/#/g, '');

    if (message.serviceKey.startsWith('Function')) {
      message.functionContextAwsRequestId = (
        message.data as FunctionRequestSpyEvent
      ).context.awsRequestId;
    }

    messages.push(message);
    resolveOldTrackerWithNewMessage(message);
  });
  ws.on('close', () => {
    closed = true;
    // console.log("disconnected " + new Date().toISOString());
  });

  const trackerMatchMessage = (
    tracker: Tracker,
    message: SpyMessageStorage
  ) => {
    if (tracker.finished) return;

    if (
      (tracker.serviceKey && tracker.serviceKey === message.serviceKey) ||
      (tracker.serviceKeyForFunction &&
        tracker.serviceKeyForFunction === message.serviceKeyForFunction)
    ) {
      if (trackerMatchCondition(tracker, message)) {
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
          let serviceKeyForFunctionResponse = serviceKeyForFunction;

          if (serviceKeyForFunctionResponse.endsWith('Request')) {
            serviceKeyForFunctionResponse =
              serviceKeyForFunctionResponse.substring(
                0,
                serviceKeyForFunctionResponse.length - 'Request'.length
              );
          } else if (serviceKeyForFunctionResponse.endsWith('Console')) {
            serviceKeyForFunctionResponse =
              serviceKeyForFunctionResponse.substring(
                0,
                serviceKeyForFunctionResponse.length - 'Console'.length
              );
          }

          serviceKeyForFunctionResponse += 'Response';

          spyAndJestMatchers.followedByResponse = (paramsW: WaitForParams) => {
            return createWaitForXXXFunc(
              serviceKeyForFunctionResponse,
              paramsW,
              (message.data as FunctionRequestSpyEvent).context.awsRequestId
            )();
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
  };

  const resolveTrackerInOldMessages = (tracker: Tracker) => {
    for (const message of messages) {
      if (trackerMatchMessage(tracker, message)) {
        return true;
      }
    }

    return false;
  };

  const resolveOldTrackerWithNewMessage = (message: SpyMessageStorage) => {
    for (let index = 0; index < trackers.length; index++) {
      const tracker = trackers[index];
      if (trackerMatchMessage(tracker, message)) {
        trackers = trackers.splice(index, 1);
        return true;
      }
    }

    return false;
  };

  const spyListener = {} as SpyListener<TSpyEvents>;

  spyListener.stop = () => {
    closed = true;
    ws.close();
  };

  const proxy = new Proxy(spyListener, {
    get: function (target: any, objectKey: string) {
      if (target.hasOwnProperty(objectKey)) {
        return target[objectKey];
      } else if (
        typeof objectKey === 'string' &&
        objectKey.startsWith(functionPrefix)
      ) {
        const paramsW = arguments[0] as WaitForParams;
        const serviceKeyForFunction = objectKey.substring(
          functionPrefix.length
        );

        return createWaitForXXXFunc(serviceKeyForFunction, paramsW);
      }
    },
  });

  await waitForConnection;

  return proxy as SpyListener<TSpyEvents>;

  function trackerMatchCondition(tracker: Tracker, message: SpyMessageStorage) {
    const matchCondition =
      (tracker.condition && tracker.condition(message.data)) ||
      !tracker.condition;

    const matchRequestId =
      (tracker.functionContextAwsRequestId &&
        tracker.functionContextAwsRequestId ===
          message.functionContextAwsRequestId) ||
      !tracker.functionContextAwsRequestId;

    if (tracker.functionContextAwsRequestId) {
      console.log(
        `${tracker.functionContextAwsRequestId} - ${message.functionContextAwsRequestId}`
      );
    }

    return matchCondition && matchRequestId;
  }

  function createWaitForXXXFunc(
    serviceKeyForFunction: string,
    paramsW: WaitForParams<SpyEvent>,
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

    return function waitForXXXFunc() {
      tracker.condition = paramsW?.condition;

      const timer = setTimeout(() => {
        if (tracker.finished) return;
        tracker.finished = true;
        tracker.promiseReject(
          new Error(
            `Timeout waiting for Serverless Spy message ${serviceKeyForFunction}`
          )
        );
      }, paramsW?.timoutMs || 10000);

      promise.finally(() => {
        clearTimeout(timer);
      });

      if (!resolveTrackerInOldMessages(tracker)) {
        trackers.push(tracker);
      }

      return promise;
    };
  }
}

export interface WaitForParams<TSpyEvent extends SpyEvent = SpyEvent> {
  condition?: (event: TSpyEvent) => boolean;
  timoutMs?: number;
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
};

type SpyMessageStorage = SpyMessage & {
  serviceKeyForFunction: string;
  functionContextAwsRequestId?: string;
};
