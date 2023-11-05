import * as fs from 'fs';
import * as path from 'path';
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { v4 as uuidv4 } from 'uuid';
import { createServerlessSpyListener } from '../../../listener/createServerlessSpyListener';
import { ServerlessSpyListener } from '../../../listener/ServerlessSpyListener';
import { ServerlessSpyEvents } from '../serverlessSpyEvents/ServerlessSpyEventsPythonLambda';
import { PythonLambdaStack } from '../src/pythonLambdaStack';
import { TestData } from './TestData';

jest.setTimeout(30000);

describe('PythonLambda', () => {
  const exportLocation = path.join(__dirname, '../cdkOutput.json');
  let serverlessSpyListener: ServerlessSpyListener<ServerlessSpyEvents>;
  let lambdaClient: LambdaClient;

  if (!fs.existsSync(exportLocation)) {
    throw new Error(`File ${exportLocation} does not exists.`);
  }
  const output = JSON.parse(fs.readFileSync(exportLocation).toString())[
    'ServerlessSpyPythonLambda'
  ];

  beforeEach(async () => {
    lambdaClient = new LambdaClient({});
    serverlessSpyListener =
      await createServerlessSpyListener<ServerlessSpyEvents>({
        scope: 'ServerlessSpyPythonLambda',
      });
  });

  afterEach(async () => {
    serverlessSpyListener.stop();
    lambdaClient.destroy();
  });

  test('Basic test', async () => {
    const myData1 = <TestData>{
      id: uuidv4(),
      message: 'Hello 1',
    };

    await lambdaClient.send(
      new InvokeCommand({
        FunctionName: output.FunctionNameMyLambda,
        InvocationType: 'RequestResponse',
        LogType: 'Tail',
        Payload: JSON.stringify(myData1) as any,
      })
    );

    await testWithoutConditionsAndWithoutChaining(
      serverlessSpyListener,
      myData1
    );

    await testWithConditionsAndWithoutChaining(serverlessSpyListener, myData1);
    await testWithConditionsAndWithChaining(serverlessSpyListener, myData1);
    await testFullyChained(serverlessSpyListener, myData1);

    //************** DATA 2 **************************

    const myData2 = <TestData>{
      id: uuidv4(),
      message: 'Hello 2',
    };

    await lambdaClient.send(
      new InvokeCommand({
        FunctionName: output.FunctionNameMyLambda,
        InvocationType: 'RequestResponse',
        LogType: 'Tail',
        Payload: JSON.stringify(myData2) as any,
      })
    );

    await testWithConditionsAndWithChaining(serverlessSpyListener, myData2);

    //this will not work, because we would get the first event
    // const requestData2 = await (
    //   await serverlessSpyListener.waitForFunctionMyLambdaRequest<TestData>()
    // ).getData();

    const followedResponse2 = await (
      await serverlessSpyListener.waitForFunctionMyLambdaRequest<TestData>({
        condition: (d) => d.request.id === myData2.id,
      })
    ).followedByResponse();

    followedResponse2.toMatchObject({
      request: myData2,
      response: {
        ...myData2,
        message: `${myData2.message} ServerlessSpy`,
      },
    });

    const responseDataSameRequest2 = followedResponse2.getData();

    expect(responseDataSameRequest2.request).toMatchObject(myData2);
    expect(responseDataSameRequest2.response).toMatchObject({
      ...myData2,
      message: `${myData2.message} ServerlessSpy`,
    });

    (
      await serverlessSpyListener.waitForFunctionMyLambdaResponse<TestData>({
        condition: (d) => d.response.id === myData2.id,
      })
    ).toMatchObject({
      request: myData2,
      response: {
        ...myData2,
        message: `${myData2.message} ServerlessSpy`,
      },
    });
  });

  test('Test error', async () => {
    const lambdaClient = new LambdaClient({});

    const myData1 = <TestData>{
      id: uuidv4(),
      message: 'Hello 1',
    };

    await lambdaClient.send(
      new InvokeCommand({
        FunctionName: output.FunctionNameMyLambdaThatFails,
        InvocationType: 'RequestResponse',
        LogType: 'Tail',
        Payload: JSON.stringify(myData1) as any,
      })
    );

    const errorResponse = (
      await serverlessSpyListener.waitForFunctionMyLambdaThatFailsError()
    ).getData();

    expect(errorResponse.error).toMatchObject({
      message: 'My test error',
      name: 'Error',
      stack: expect.any(String),
    });

    (
      await serverlessSpyListener.waitForFunctionMyLambdaThatFailsError()
    ).toMatchObject({
      request: myData1,
      error: {
        message: 'My test error',
        name: 'Error',
        stack: expect.any(String),
      },
    });
  });

  test('Snapshot', () => {
    const app = new App();
    const stack = new PythonLambdaStack(app, 'Test', {
      generateSpyEventsFile: false,
    });
    const template = Template.fromStack(stack);
    expect(template.toJSON()).toMatchSnapshot();
  });
});

async function testWithConditionsAndWithChaining(
  serverlessSpyListener: ServerlessSpyListener<ServerlessSpyEvents>,
  myData: TestData
) {
  // request
  const awaitedRequest =
    await serverlessSpyListener.waitForFunctionMyLambdaRequest<TestData>({
      condition: (d) => d.request.id === myData.id,
    });

  awaitedRequest.toMatchObject({
    request: myData,
  });

  const requestData = awaitedRequest.getData();

  expect(requestData.request).toMatchObject(myData);

  //console log
  const awaitedFollowedConsole = await awaitedRequest.followedByConsole();

  awaitedFollowedConsole.toMatchObject({
    request: myData,
    console: {
      message: 'My console log message',
      optionalParams: [myData],
    },
  });

  const consoleData = awaitedFollowedConsole.getData();

  expect(consoleData.console).toMatchObject({
    message: 'My console log message',
    optionalParams: [myData],
  });

  //response
  const awaitedFollowedResponse = await awaitedRequest.followedByResponse();

  awaitedFollowedResponse.toMatchObject({
    request: myData,
    response: {
      ...myData,
      message: `${myData.message} ServerlessSpy`,
    },
  });

  const responseData = awaitedFollowedResponse.getData();

  expect(responseData.request).toMatchObject(myData);
  expect(responseData.response).toMatchObject({
    ...myData,
    message: `${myData.message} ServerlessSpy`,
  });
}

async function testFullyChained(
  serverlessSpyListener: ServerlessSpyListener<ServerlessSpyEvents>,
  myData: TestData
) {
  (
    await (
      await (
        await serverlessSpyListener.waitForFunctionMyLambdaRequest<TestData>({
          condition: (d) => d.request.id === myData.id,
        })
      )
        .toMatchObject({
          request: myData,
        })
        .followedByConsole()
    )
      .toMatchObject({
        request: myData,
        console: {
          message: 'My console log message',
          optionalParams: [myData],
        },
      })
      .followedByResponse()
  ).toMatchObject({
    request: myData,
    response: {
      ...myData,
      message: `${myData.message} ServerlessSpy`,
    },
  });

  //no checking the data
  await (
    await (
      await serverlessSpyListener.waitForFunctionMyLambdaRequest<TestData>({
        condition: (d) => d.request.id === myData.id,
      })
    ).followedByConsole()
  ).followedByResponse();
}

async function testWithoutConditionsAndWithoutChaining(
  serverlessSpyListener: ServerlessSpyListener<ServerlessSpyEvents>,
  data: TestData
) {
  //request
  const awaitedRequest =
    await serverlessSpyListener.waitForFunctionMyLambdaRequest<TestData>();

  awaitedRequest.toMatchObject({
    request: data,
  });
  console.log('request found');

  const requestData = awaitedRequest.getData();

  expect(requestData.request).toMatchObject(data);
  console.log('matched data');

  //TODO: Pretty sure it's the console logs that aren't set up properly
  //console log
  const awaitedConsole =
    await serverlessSpyListener.waitForFunctionMyLambdaConsole<TestData>();

  awaitedConsole.toMatchObject({
    request: data,
    console: {
      message: 'My console log message',
      optionalParams: [data],
    },
  });

  const consoleData = awaitedConsole.getData();

  expect(consoleData.console).toMatchObject({
    message: 'My console log message',
    optionalParams: [data],
  });

  //response
  const awaitedResponse =
    await serverlessSpyListener.waitForFunctionMyLambdaResponse<TestData>();

  awaitedResponse.toMatchObject({
    request: data,
    response: {
      ...data,
      message: `${data.message} ServerlessSpy`,
    },
  });

  const responseData = awaitedResponse.getData();

  expect(responseData.request).toMatchObject(data);
  expect(responseData.response).toMatchObject({
    ...data,
    message: `${data.message} ServerlessSpy`,
  });
}

async function testWithConditionsAndWithoutChaining(
  serverlessSpyListener: ServerlessSpyListener<ServerlessSpyEvents>,
  data: TestData
) {
  //request
  const awaitedRequest =
    await serverlessSpyListener.waitForFunctionMyLambdaRequest<TestData>({
      condition: (d) => d.request.id === data.id,
    });

  awaitedRequest.toMatchObject({
    request: data,
  });

  const requestData = awaitedRequest.getData();

  expect(requestData.request).toMatchObject(data);

  //console log
  const awaitedConsole =
    await serverlessSpyListener.waitForFunctionMyLambdaConsole<TestData>({
      condition: (d) => d.request.id === data.id,
    });

  awaitedConsole.toMatchObject({
    request: data,
    console: {
      message: 'My console log message',
      optionalParams: [data],
    },
  });

  const consoleData = awaitedConsole.getData();

  expect(consoleData.console).toMatchObject({
    message: 'My console log message',
    optionalParams: [data],
  });

  //response
  const awaitedResponse =
    await serverlessSpyListener.waitForFunctionMyLambdaResponse<TestData>({
      condition: (d) => d.response.id === data.id,
    });

  awaitedResponse.toMatchObject({
    request: data,
    response: {
      ...data,
      message: `${data.message} ServerlessSpy`,
    },
  });

  const responseData = awaitedResponse.getData();

  expect(responseData.request).toMatchObject(data);
  expect(responseData.response).toMatchObject({
    ...data,
    message: `${data.message} ServerlessSpy`,
  });
}
