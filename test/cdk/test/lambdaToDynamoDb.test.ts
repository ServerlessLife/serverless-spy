import * as fs from 'fs';
import * as path from 'path';
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { v4 as uuidv4 } from 'uuid';
import { createServerlessSpyListener } from '../../../listener/createServerlessSpyListener';
import { ServerlessSpyListener } from '../../../listener/ServerlessSpyListener';
import { ServerlessSpyEvents } from '../.cdkOut/ServerlessSpyEventsLambdaToDynamoDbStack';
import { LambdaToDynamoDbStack } from '../src/lambdaToDynamoDbStack';
import { TestData } from './TestData';

jest.setTimeout(30000);

describe('Lambda to DynamoDB', () => {
  const exportLocation = path.join(__dirname, '../.cdkOut/cdkExports.json');
  let serverlessSpyListener: ServerlessSpyListener<ServerlessSpyEvents>;

  if (!fs.existsSync(exportLocation)) {
    throw new Error(`File ${exportLocation} doen not exists.`);
  }
  const output = JSON.parse(fs.readFileSync(exportLocation).toString())[
    'ServerlessSpyLambdaToDynamoDb'
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

    const id = uuidv4();
    const data = <TestData>{
      id,
      message: 'Hello',
    };

    const command = new InvokeCommand({
      FunctionName: output.FunctionNameMyLambda,
      InvocationType: 'RequestResponse',
      LogType: 'Tail',
      Payload: JSON.stringify(data) as any,
    });

    await lambdaClient.send(command);

    (
      await (
        await serverlessSpyListener.waitForFunctionMyLambdaRequest<TestData>({
          condition: (d) => d.request.id === id,
        })
      )
        .toMatchObject({ request: data })
        .followedByResponse({})
    ).toMatchObject({ response: data });

    (
      await serverlessSpyListener.waitForDynamoDBMyTable<TestData>({
        condition: (d) => d.keys.pk === id,
      })
    ).toMatchObject({
      eventName: 'INSERT',
      newImage: data,
    });
  });

  test('Snapshot', () => {
    const app = new App();
    const stack = new LambdaToDynamoDbStack(app, 'Test', {
      generateSpyEventsFile: false,
    });
    const template = Template.fromStack(stack);
    expect(template.toJSON()).toMatchSnapshot();
  });
});