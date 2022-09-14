import * as fs from 'fs';
import * as path from 'path';
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { v4 as uuidv4 } from 'uuid';
import { createServerlessSpyListener } from '../../../listener/createServerlessSpyListener';
import { ServerlessSpyListener } from '../../../listener/ServerlessSpyListener';
import { ServerlessSpyEvents } from '../.cdkOut/ServerlessSpyEventsLambda';
import { E2eStack } from '../src/e2eStack';
import { TestData } from './TestData';

jest.setTimeout(30000);

describe('E2e', () => {
  const exportLocation = path.join(__dirname, '../.cdkOut/cdkExports.json');
  let serverlessSpyListener: ServerlessSpyListener<ServerlessSpyEvents>;

  if (!fs.existsSync(exportLocation)) {
    throw new Error(`File ${exportLocation} doen not exists.`);
  }
  const output = JSON.parse(fs.readFileSync(exportLocation).toString())[
    'ServerlessSpyLambda'
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

    const data1 = <TestData>{
      id: uuidv4(),
      message: 'Hello 1',
    };

    await lambdaClient.send(
      new InvokeCommand({
        FunctionName: output.FunctionNameMyLambda,
        InvocationType: 'RequestResponse',
        LogType: 'Tail',
        Payload: JSON.stringify(data1) as any,
      })
    );

    const requestData1 = await (
      await serverlessSpyListener.waitForFunctionMyLambdaRequest<TestData>()
    ).getData();

    expect(requestData1.request).toMatchObject(data1);

    const followedResponse1 = await (
      await serverlessSpyListener.waitForFunctionMyLambdaRequest<TestData>({
        condition: (d) => d.request.id === data1.id,
      })
    ).followedByResponse();

    followedResponse1.toMatchObject({
      request: data1,
      response: {
        ...data1,
        message: `${data1.message} ServerlessSpy`,
      },
    });

    const responseDataSameRequest1 = followedResponse1.getData();

    expect(responseDataSameRequest1.request).toMatchObject(data1);
    expect(responseDataSameRequest1.response).toMatchObject({
      ...data1,
      message: `${data1.message} ServerlessSpy`,
    });

    const responseData1 = await (
      await serverlessSpyListener.waitForFunctionMyLambdaResponse<TestData>()
    ).getData();

    expect(responseData1.request).toMatchObject(data1);
    expect(responseData1.response).toMatchObject({
      ...data1,
      message: `${data1.message} ServerlessSpy`,
    });

    (
      await await serverlessSpyListener.waitForFunctionMyLambdaResponse<TestData>(
        {
          condition: (d) => d.response.id === data1.id,
        }
      )
    ).toMatchObject({
      request: data1,
      response: {
        ...data1,
        message: `${data1.message} ServerlessSpy`,
      },
    });

    const data2 = <TestData>{
      id: uuidv4(),
      message: 'Hello 2',
    };

    await lambdaClient.send(
      new InvokeCommand({
        FunctionName: output.FunctionNameMyLambda,
        InvocationType: 'RequestResponse',
        LogType: 'Tail',
        Payload: JSON.stringify(data2) as any,
      })
    );

    //this will not work, because we would get the first event
    // const requestData2 = await (
    //   await serverlessSpyListener.waitForFunctionMyLambdaRequest<TestData>()
    // ).getData();

    const followedResponse2 = await (
      await serverlessSpyListener.waitForFunctionMyLambdaRequest<TestData>({
        condition: (d) => d.request.id === data2.id,
      })
    ).followedByResponse();

    followedResponse2.toMatchObject({
      request: data2,
      response: {
        ...data2,
        message: `${data2.message} ServerlessSpy`,
      },
    });

    const responseDataSameRequest2 = followedResponse2.getData();

    expect(responseDataSameRequest2.request).toMatchObject(data2);
    expect(responseDataSameRequest2.response).toMatchObject({
      ...data2,
      message: `${data2.message} ServerlessSpy`,
    });

    (
      await await serverlessSpyListener.waitForFunctionMyLambdaResponse<TestData>(
        {
          condition: (d) => d.response.id === data2.id,
        }
      )
    ).toMatchObject({
      request: data2,
      response: {
        ...data2,
        message: `${data2.message} ServerlessSpy`,
      },
    });
  });

  test('Snapshot', () => {
    const app = new App();
    const stack = new E2eStack(app, 'Test', {
      generateSpyEventsFile: false,
    });
    const template = Template.fromStack(stack);
    expect(template.toJSON()).toMatchSnapshot();
  });
});
