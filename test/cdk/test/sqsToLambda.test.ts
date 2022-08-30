import * as fs from 'fs';
import * as path from 'path';
import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { v4 as uuidv4 } from 'uuid';
import { createServerlessSpyListener } from '../../../listener/createServerlessSpyListener';
import { SpyListener } from '../../../listener/SpyListener';
import { ServerlessSpyEvents } from '../.cdkOut/ServerlessSpyEventsSqsToLambda';
import { SqsToLambdaStack } from '../src/sqsToLambdaStack';
import { TestData } from './TestData';

jest.setTimeout(30000);

describe('SQS to Lambda', () => {
  const exportLocation = path.join(__dirname, '../.cdkOut/cdkExports.json');
  let serverlessSpyListener: SpyListener<ServerlessSpyEvents>;

  if (!fs.existsSync(exportLocation)) {
    throw new Error(`File ${exportLocation} doen not exists.`);
  }
  const output = JSON.parse(fs.readFileSync(exportLocation).toString())[
    'ServerlessSpySqsToLambda'
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
    const id = uuidv4();
    const data = <TestData>{
      id,
      message: 'Hello',
    };

    const sqsClient = new SQSClient({});
    const sendMessageCommand = new SendMessageCommand({
      DelaySeconds: 10,
      MessageBody: JSON.stringify(data),
      QueueUrl: output.QueueUrlMyQueue,
    });
    await sqsClient.send(sendMessageCommand);

    // (
    //   await (
    //     await serverlessSpyListener.waitForFunctionMyLambdaRequest<TestData>({
    //       condition: (d) => d.request.id === id,
    //     })
    //   )
    //     .toMatchObject({ request: data })
    //     .followedByResponse({})
    // ).toMatchObject({ response: data });

    // (
    //   await serverlessSpyListener.waitForSqsMyQueue<TestData>({
    //     condition: (d) => d.body.id === id,
    //   })
    // ).toMatchObject({ body: data });
  });

  test('Snapshot', () => {
    const app = new App();
    const stack = new SqsToLambdaStack(app, 'Test', {
      generateSpyEventsFile: false,
    });
    const template = Template.fromStack(stack);
    expect(template.toJSON()).toMatchSnapshot();
  });
});
