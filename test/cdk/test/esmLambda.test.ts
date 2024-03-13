import * as fs from 'fs';
import * as path from 'path';
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import { v4 as uuidv4 } from 'uuid';
import { TestData } from './TestData';
import { createServerlessSpyListener } from '../../../listener/createServerlessSpyListener';
import { ServerlessSpyListener } from '../../../listener/ServerlessSpyListener';
import { ServerlessSpyEvents } from '../serverlessSpyEvents/ServerlessSpyEventsLambda';

jest.setTimeout(30000);

describe('EsmLambda', () => {
  const exportLocation = path.join(__dirname, '../cdkOutput.json');
  let serverlessSpyListener: ServerlessSpyListener<ServerlessSpyEvents>;

  if (!fs.existsSync(exportLocation)) {
    throw new Error(`File ${exportLocation} does not exists.`);
  }
  const output = JSON.parse(fs.readFileSync(exportLocation).toString())[
    'ServerlessSpyEsmLambda'
  ];

  beforeEach(async () => {
    serverlessSpyListener =
      await createServerlessSpyListener<ServerlessSpyEvents>({
        serverlessSpyWsUrl: output.ServerlessSpyWsUrl,
      });
  });

  afterEach(async () => {
    serverlessSpyListener.stop();
  });

  test('Basic test', async () => {
    const lambdaClient = new LambdaClient({});

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
      await await serverlessSpyListener.waitForFunctionMyLambdaResponse<TestData>(
        {
          condition: (d) => d.response.id === myData2.id,
        }
      )
    ).toMatchObject({
      request: myData2,
      response: {
        ...myData2,
        message: `${myData2.message} ServerlessSpy`,
      },
    });

    //************** Test Lambda with uncommon name **************************

    const myData3 = <TestData>{
      id: uuidv4(),
      message: 'Hello 3',
    };

    await lambdaClient.send(
      new InvokeCommand({
        FunctionName: output.FunctionNameMyLambdaTestName2,
        InvocationType: 'RequestResponse',
        LogType: 'Tail',
        Payload: JSON.stringify(myData3) as any,
      })
    );

    await testWithConditionsAndWithChaining2(serverlessSpyListener, myData3);
    await testFullyChained2(serverlessSpyListener, myData3);

    const followedResponse3 = await (
      await serverlessSpyListener.waitForFunctionMyLambdaTestName2Request<TestData>(
        {
          condition: (d) => d.request.id === myData3.id,
        }
      )
    ).followedByResponse();

    followedResponse3.toMatchObject({
      request: myData3,
      response: {
        ...myData3,
        message: `${myData3.message} ServerlessSpy`,
      },
    });

    const responseDataSameRequest3 = followedResponse3.getData();

    expect(responseDataSameRequest3.request).toMatchObject(myData3);
    expect(responseDataSameRequest3.response).toMatchObject({
      ...myData3,
      message: `${myData3.message} ServerlessSpy`,
    });

    (
      await await serverlessSpyListener.waitForFunctionMyLambdaTestName2Response<TestData>(
        {
          condition: (d) => d.response.id === myData3.id,
        }
      )
    ).toMatchObject({
      request: myData3,
      response: {
        ...myData3,
        message: `${myData3.message} ServerlessSpy`,
      },
    });
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

  const requestData = awaitedRequest.getData();

  expect(requestData.request).toMatchObject(data);

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

  const responseData = await awaitedResponse.getData();

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

  const responseData = await awaitedResponse.getData();

  expect(responseData.request).toMatchObject(data);
  expect(responseData.response).toMatchObject({
    ...data,
    message: `${data.message} ServerlessSpy`,
  });
}

async function testWithConditionsAndWithChaining2(
  serverlessSpyListener: ServerlessSpyListener<ServerlessSpyEvents>,
  myData: TestData
) {
  // request
  const awaitedRequest =
    await serverlessSpyListener.waitForFunctionMyLambdaTestName2Request<TestData>(
      {
        condition: (d) => d.request.id === myData.id,
      }
    );

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

async function testFullyChained2(
  serverlessSpyListener: ServerlessSpyListener<ServerlessSpyEvents>,
  myData: TestData
) {
  (
    await (
      await (
        await serverlessSpyListener.waitForFunctionMyLambdaTestName2Request<TestData>(
          {
            condition: (d) => d.request.id === myData.id,
          }
        )
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
      await serverlessSpyListener.waitForFunctionMyLambdaTestName2Request<TestData>(
        {
          condition: (d) => d.request.id === myData.id,
        }
      )
    ).followedByConsole()
  ).followedByResponse();
}
