import * as fs from 'fs';
import * as path from 'path';
import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { v4 as uuidv4 } from 'uuid';
import { TestData } from './TestData';
import { createServerlessSpyListener } from '../../../listener/createServerlessSpyListener';
import { ServerlessSpyListener } from '../../../listener/ServerlessSpyListener';
import { ServerlessSpyEvents } from '../serverlessSpyEvents/ServerlessSpyEventsSqs';

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
});
