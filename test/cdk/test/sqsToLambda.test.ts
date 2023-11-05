import * as fs from 'fs';
import * as path from 'path';
import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { SQSEvent } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { createServerlessSpyListener } from '../../../listener/createServerlessSpyListener';
import { ServerlessSpyListener } from '../../../listener/ServerlessSpyListener';
import { ServerlessSpyEvents } from '../serverlessSpyEvents/ServerlessSpyEventsSqsToLambda';
import { SqsToLambdaStack } from '../src/sqsToLambdaStack';
import { TestData } from './TestData';

jest.setTimeout(60000);

describe('SQS to Lambda', () => {
  const exportLocation = path.join(__dirname, '../cdkOutput.json');
  let serverlessSpyListener: ServerlessSpyListener<ServerlessSpyEvents>;

  if (!fs.existsSync(exportLocation)) {
    throw new Error(`File ${exportLocation} does not exists.`);
  }
  const output = JSON.parse(fs.readFileSync(exportLocation).toString())[
    'ServerlessSpySqsToLambda'
  ];

  beforeEach(async () => {
    serverlessSpyListener =
      await createServerlessSpyListener<ServerlessSpyEvents>({
        scope: 'ServerlessSpySqsToLambda',
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
    const sendMessageCommand2 = new SendMessageCommand({
      MessageBody: JSON.stringify(data),
      QueueUrl: output.QueueUrlMyQueue2,
    });
    await sqsClient.send(sendMessageCommand2);

    (
      await serverlessSpyListener.waitForSqsMyQueue<TestData>({
        condition: (d) => d.body.id === id,
      })
    ).toMatchObject({ body: data });

    (
      await (
        await serverlessSpyListener.waitForFunctionMyLambdaRequest<SQSEvent>({
          condition: (d) =>
            !!d.request.Records.map((r) => JSON.parse(r.body) as TestData).find(
              (d) => d.id === data.id
            ),
        })
      )
        .toMatchObject({
          request: {
            Records: expect.arrayContaining([
              expect.objectContaining({
                body: JSON.stringify(data),
              }),
            ]),
          },
        })
        .followedByResponse({})
    ).toMatchObject({
      request: {
        Records: expect.arrayContaining([
          expect.objectContaining({
            body: JSON.stringify(data),
          }),
        ]),
      },
    });

    (
      await (
        await serverlessSpyListener.waitForFunctionMyPythonLambdaRequest<SQSEvent>(
          {
            condition: (d) =>
              !!d.request.Records.map(
                (r) => JSON.parse(r.body) as TestData
              ).find((d) => d.id === data.id),
          }
        )
      )
        .toMatchObject({
          request: {
            Records: expect.arrayContaining([
              expect.objectContaining({
                body: JSON.stringify(data),
              }),
            ]),
          },
        })
        .followedByResponse({})
    ).toMatchObject({
      request: {
        Records: expect.arrayContaining([
          expect.objectContaining({
            body: JSON.stringify(data),
          }),
        ]),
      },
    });
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
