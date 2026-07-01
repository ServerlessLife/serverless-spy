import { Context, Handler } from 'aws-lambda';
import { serializeError } from 'serialize-error';
// @ts-ignore
import { FunctionConsoleSpyEvent } from '../common/spyEvents/FunctionConsoleSpyEvent';
import { FunctionContext } from '../common/spyEvents/FunctionContext';
import { FunctionErrorSpyEvent } from '../common/spyEvents/FunctionErrorSpyEvent';
import { FunctionRequestSpyEvent } from '../common/spyEvents/FunctionRequestSpyEvent';
import { FunctionResponseSpyEvent } from '../common/spyEvents/FunctionResponseSpyEvent';
import { SpyEventSender } from '../common/SpyEventSender';
import { envVariableNames } from '../src/common/envVariableNames';
import { load } from './aws/UserFunction';
// @ts-ignore

const ORIGINAL_HANDLER_KEY = 'ORIGINAL_HANDLER';

const subscribedToSQS =
  process.env[envVariableNames.SSPY_SUBSCRIBED_TO_SQS] === 'true';

const debugMode = process.env[envVariableNames.SSPY_DEBUG] === 'true';

const oldConsoleLog = console.log;
const oldConsoleWarn = console.warn;
const oldConsoleDebug = console.debug;
const oldConsoleInfo = console.info;
const oldConsoleError = console.error;
let currentEvent: any;
let currentContext: FunctionContext | undefined;
let promises: Promise<any>[] = [];

interceptConsole();

const spyEventSender = new SpyEventSender({
  log,
  logError,
  scope: process.env['SSPY_ROOT_STACK']!,
  iotEndpoint: process.env['SSPY_IOT_ENDPOINT']!,
});

// Wrap original handler.
// Handler can be async or non-async:
// https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-handler.html
export const handler = async (event: any, context: Context): Promise<any> => {
  await spyEventSender.connect();

  const contextSpy: FunctionContext = {
    functionName: context.functionName,
    awsRequestId: context.awsRequestId,
    identity: context.identity,
    clientContext: context.clientContext,
  };

  currentEvent = event;
  currentContext = contextSpy;

  promises = [];

  log('Request', JSON.stringify(event));

  if (subscribedToSQS) {
    // send raw message
    log('Send raw message for SQS');
    const p = sendRawSpyEvent(event);
    promises.push(p);
  }

  const key = `Function#${
    process.env[envVariableNames.SSPY_FUNCTION_NAME]
  }#Request`;
  const p = sendLambdaSpyEvent(key, <FunctionRequestSpyEvent>{
    request: event,
    context: contextSpy,
  });
  promises.push(p);

  const originalHandler = await getOriginalHandler();

  const fail = (error: any) => {
    logError(error);

    const errorSerialized = serializeError(error);

    const key = `Function#${
      process.env[envVariableNames.SSPY_FUNCTION_NAME]
    }#Error`;
    const p = sendLambdaSpyEvent(key, <FunctionErrorSpyEvent>{
      request: event,
      error: errorSerialized,
      context: contextSpy,
    });
    promises.push(p);
    currentEvent = undefined;
    currentContext = undefined;
    return Promise.all(promises);
  };

  const succeed = (response: any) => {
    log('Response', JSON.stringify(response));
    const key = `Function#${
      process.env[envVariableNames[envVariableNames.SSPY_FUNCTION_NAME]]
    }#Response`;
    const p = sendLambdaSpyEvent(key, <FunctionResponseSpyEvent>{
      request: event,
      response,
      context: contextSpy,
    });
    promises.push(p);
    currentEvent = undefined;
    currentContext = undefined;

    return Promise.all(promises);
  };

  try {
    const result = await new Promise<any>((resolve, reject) => {
      const callback = (err: any, data: any) => {
        (err ? fail(err) : succeed(data))
          .then(() => {
            err ? reject(err) : resolve(data);
          })
          .catch(() => {});
      };

      try {
        const handlerResult = originalHandler(event, context, callback);

        if (isPromise(handlerResult)) {
          handlerResult
            .then((response: any) =>
              succeed(response).then(() => resolve(response))
            )
            .catch((error: any) => fail(error).then(() => reject(error)));
        }
      } catch (error) {
        fail(error)
          .then(() => reject(error))
          .catch(() => {});
      }
    });

    return result;
  } finally {
    await spyEventSender.close();
  }
};

function interceptConsole() {
  const sendLogs = (
    type: 'log' | 'debug' | 'info' | 'error' | 'warn',
    args?: any[]
  ) => {
    if (!currentContext) return;

    log(`Console ${type}`, JSON.stringify(args));
    const [message, ...rest] = args ?? [];

    const key = `Function#${
      process.env[envVariableNames.SSPY_FUNCTION_NAME]
    }#Console`;

    const p = sendLambdaSpyEvent(key, <FunctionConsoleSpyEvent>{
      request: currentEvent,
      context: currentContext,
      console: {
        type,
        message,
        optionalParams: rest,
      },
    });

    promises.push(p);
  };

  console.log = function (...args: any[]) {
    sendLogs('log', args);
    oldConsoleLog.apply(console, args);
  };

  console.warn = function (...args: any[]) {
    sendLogs('warn', args);
    oldConsoleWarn.apply(console, args);
  };

  console.debug = function (...args: any[]) {
    sendLogs('debug', args);
    oldConsoleDebug.apply(console, args);
  };

  console.info = function (...args: any[]) {
    sendLogs('info', args);
    oldConsoleInfo.apply(console, args);
  };

  console.error = function (...args: any[]) {
    sendLogs('error', args);
    oldConsoleError.apply(console, args);
  };
}

function isPromise(obj: any): obj is Promise<any> {
  return typeof obj?.then === 'function';
}

async function sendLambdaSpyEvent(
  serviceKey: string,
  data: {
    request: any;
    response?: any;
    error?: any;
  }
) {
  await sendRawSpyEvent({
    data,
    serviceKey,
  });
}

async function sendRawSpyEvent(data: any) {
  await spyEventSender.publishSpyEvent(data);
}

async function getOriginalHandler(): Promise<Handler> {
  log('Original handler', process.env[ORIGINAL_HANDLER_KEY]);

  if (process.env[ORIGINAL_HANDLER_KEY] === undefined)
    throw Error('Missing original handler');
  return load(
    process.env.LAMBDA_TASK_ROOT!,
    process.env[ORIGINAL_HANDLER_KEY]
  ) as Promise<Handler>;
}

function log(message: string, ...optionalParams: any[]) {
  if (debugMode) {
    oldConsoleDebug('SSPY EXTENSION', message, ...optionalParams);
  }
}

function logError(message: string, ...optionalParams: any[]) {
  if (debugMode) {
    oldConsoleError('SSPY EXTENSION', message, ...optionalParams);
  }
}
