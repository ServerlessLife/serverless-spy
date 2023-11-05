import * as fs from 'fs';
import * as path from 'path';
import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { v4 as uuidv4 } from 'uuid';
import { createServerlessSpyListener } from '../../../listener/createServerlessSpyListener';
import { ServerlessSpyListener } from '../../../listener/ServerlessSpyListener';
import { ServerlessSpyEvents } from '../serverlessSpyEvents/ServerlessSpyEventsSqs';
import { SqsStack } from '../src/sqsStack';
import { TestData } from './TestData';

jest.setTimeout(30000);

describe('SQS with option spySqsWithNoSubscriptionAndDropAllMessages', () => {
  const exportLocation = path.join(__dirname, '../cdkOutput.json');
  let serverlessSpyListener: ServerlessSpyListener<ServerlessSpyEvents>;

  if (!fs.existsSync(exportLocation)) {
    throw new Error(`File ${exportLocation} does not exists.`);
  }
  const output = JSON.parse(fs.readFileSync(exportLocation).toString())[
    'ServerlessSpySqs'
  ];

  beforeEach(async () => {
    serverlessSpyListener =
      await createServerlessSpyListener<ServerlessSpyEvents>({
        scope: 'ServerlessSpySqs',
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
      MessageBody: JSON.stringify(data),
      QueueUrl: output.QueueUrlMyQueue,
    });
    await sqsClient.send(sendMessageCommand);

    (
      await serverlessSpyListener.waitForSqsMyQueue<TestData>({
        condition: (d) => d.body.id === id,
      })
    ).toMatchObject({ body: data });
  });

  test('Snapshot', () => {
    const app = new App();
    const stack = new SqsStack(app, 'Test', {
      generateSpyEventsFile: false,
    });
    const template = Template.fromStack(stack);
    expect(template.toJSON()).toMatchSnapshot();
  });
});
