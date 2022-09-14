import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import { Callback, Context, Handler } from 'aws-lambda';
import { publishSpyEvent } from '../common/publishSpyEvent';
import { FunctionContext } from '../common/spyEvents/FunctionContext';
import { FunctionErrorSpyEvent } from '../common/spyEvents/FunctionErrorSpyEvent';
import { FunctionRequestSpyEvent } from '../common/spyEvents/FunctionRequestSpyEvent';
import { FunctionResponseSpyEvent } from '../common/spyEvents/FunctionResponseSpyEvent';
import { envVariableNames } from '../src/common/envVariableNames';
import { load } from './aws/UserFunction';

const ORIGINAL_HANDLER_KEY = 'ORIGINAL_HANDLER';

const subscribedToSQS =
  process.env[envVariableNames.SSPY_SUBSCRIBED_TO_SQS] === 'true';

const lambdaClient = new LambdaClient({});

// Wrap original handler.
// Handler can be async or non-async:
// https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-handler.html
export const handler = (
  event: any,
  context: Context,
  callback: Callback
): Promise<any> | undefined => {
  const promises: Promise<any>[] = [];

  if (subscribedToSQS) {
    // send raw message
    console.log('EXTENSION: Send raw message for SQS');
    const p = sendRawSpyEvent(event);
    promises.push(p);
  }

  const contextSpy: FunctionContext = {
    functionName: context.functionName,
    awsRequestId: context.awsRequestId,
    identity: context.identity,
    clientContext: context.clientContext,
  };

  console.log('EXTENSION REQUEST:', JSON.stringify(event));
  const key = `Function#${
    process.env[envVariableNames.SSPY_FUNCTION_NAME]
  }#Request`;
  const p = sendLambdaSpyEvent(key, <FunctionRequestSpyEvent>{
    request: event,
    context: contextSpy,
  });
  promises.push(p);

  const originalHandler = getOriginalHandler();

  const fail = (error: any) => {
    console.error('FAIL', error);
    const key = `Function#${
      process.env[envVariableNames.SSPY_FUNCTION_NAME]
    }#Error`;
    const p = sendLambdaSpyEvent(key, <FunctionErrorSpyEvent>{
      request: event,
      error,
      context: contextSpy,
    });
    promises.push(p);
    return Promise.all(promises);
  };

  const succeed = (response: any) => {
    console.log('EXTENSION RESPONSE:', JSON.stringify(response));
    const key = `Function#${
      process.env[envVariableNames[envVariableNames.SSPY_FUNCTION_NAME]]
    }#Response`;
    const p = sendLambdaSpyEvent(key, <FunctionResponseSpyEvent>{
      request: event,
      response,
      context: contextSpy,
    });
    promises.push(p);
    return Promise.all(promises);
  };

  const newCallback = (err: any, data: any) => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (err ? fail(err) : succeed(data)).then(() => {
      callback(err, data);
    });
  };

  try {
    const result = originalHandler(event, context, newCallback);

    // Async handler returns Promise
    if (isPromise(result)) {
      return new Promise((resolve, reject) => {
        (result as Promise<any>)
          .then((response: any) =>
            // The response is received via Promise
            succeed(response).then(() => {
              resolve(response);
            })
          )
          .catch((error: any) =>
            fail(error).then(() => {
              reject(error);
            })
          );
      });
    }
  } catch (error) {
    // Even if the original handler is not async, we return the promise as an async handler so we can send an error message
    return new Promise((_, reject) =>
      fail(error).then(() => {
        reject(error);
      })
    );
  }
};

function isPromise(obj: any): boolean {
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
  await publishSpyEvent(data);

  // console.log('EXTENSION SPY EVENT:', JSON.stringify(data));

  // const command = new InvokeCommand({
  //   FunctionName: fluentTestSendFunctionName,
  //   InvocationType: 'RequestResponse',
  //   LogType: 'Tail',
  //   Payload: JSON.stringify(data) as any,
  // });
  // await lambdaClient.send(command);
}

function getOriginalHandler(): Handler {
  console.log('ORIGINAL_HANDLER_KEY', process.env[ORIGINAL_HANDLER_KEY]);

  if (process.env[ORIGINAL_HANDLER_KEY] === undefined)
    throw Error('Missing original handler');
  return load(
    process.env.LAMBDA_TASK_ROOT!,
    process.env[ORIGINAL_HANDLER_KEY]
  ) as Handler;
}
