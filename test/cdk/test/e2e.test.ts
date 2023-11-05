import * as fs from 'fs';
import * as path from 'path';
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import { SNSEvent, SQSEvent, EventBridgeEvent, SNSMessage } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { createServerlessSpyListener } from '../../../listener/createServerlessSpyListener';
import { ServerlessSpyListener } from '../../../listener/ServerlessSpyListener';
import { ServerlessSpyEvents } from '../serverlessSpyEvents/ServerlessSpyEventsE2e';
import { TestData } from './TestData';

jest.setTimeout(30000);

describe('E2e', () => {
  const exportLocation = path.join(__dirname, '../cdkOutput.json');
  let serverlessSpyListener: ServerlessSpyListener<ServerlessSpyEvents>;

  if (!fs.existsSync(exportLocation)) {
    throw new Error(`File ${exportLocation} does not exists.`);
  }
  const output = JSON.parse(fs.readFileSync(exportLocation).toString())[
    'ServerlessSpyE2e'
  ];

  beforeEach(async () => {
    serverlessSpyListener =
      await createServerlessSpyListener<ServerlessSpyEvents>({
        scope: 'ServerlessSpyE2e',
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
      FunctionName: output.FunctionNameToSnsAndDynamoDb,
      InvocationType: 'RequestResponse',
      LogType: 'Tail',
      Payload: JSON.stringify(data) as any,
    });

    await lambdaClient.send(command);

    // ---> function ToSnsAndDynamoDb
    (
      await serverlessSpyListener.waitForFunctionToSnsAndDynamoDbRequest<TestData>(
        {
          condition: (d) => d.request.id === id,
        }
      )
    ).toMatchObject({ request: data });

    // function ToSnsAndDynamoDb ---> SNS MyTopicNo1
    (
      await serverlessSpyListener.waitForSnsTopicMyTopicNo1<TestData>({
        condition: (d) => d.message.id === id,
      })
    ).toMatchObject({ message: data });

    // SNS MyTopicNo1 ---> SQS MyQueueNo1
    (
      await serverlessSpyListener.waitForSqsMyQueueNo1({
        condition: (d) => JSON.parse(d.body.Message).id === id,
      })
    ).toMatchObject({
      body: {
        Message: JSON.stringify(data),
      },
    });

    //SQS MyQueueNo1 ---> function ReceiveSqs
    await serverlessSpyListener.waitForFunctionReceiveSqsRequest<SQSEvent>({
      condition: (d) => {
        return !!d.request.Records.map((r) => JSON.parse(r.body) as SNSMessage)
          .flat()
          .map((r) => JSON.parse(r.Message) as TestData)
          .find((d) => d.id === data.id);
      },
    });

    // function ToSnsAndDynamoDb ---> to DynamoDB MyTable
    (
      await serverlessSpyListener.waitForDynamoDBMyTable<TestData>({
        condition: (d) => d.keys.pk === id,
      })
    ).toMatchObject({
      eventName: 'INSERT',
      newImage: data,
    });

    // SNS MyTopicNo1 ---> function FromSnsToSqsAndS3
    (
      await serverlessSpyListener.waitForFunctionFromSnsToSqsAndS3Request<SNSEvent>(
        {
          condition: (d) =>
            !!d.request.Records.map(
              (r) => JSON.parse(r.Sns.Message) as TestData
            ).find((d) => d.id === data.id),
        }
      )
    ).toMatchObject({
      request: {
        Records: [
          {
            Sns: {
              Message: JSON.stringify(data),
            },
          },
        ],
      },
    });

    //function FromSnsToSqsAndS3 ---> to SQS QueueNo2
    (
      await serverlessSpyListener.waitForSqsMyQueueNo2<TestData>({
        condition: (d) => d.body.id === id,
      })
    ).toMatchObject({ body: data });

    //function FromSnsToSqsAndS3 ---> to S3
    await serverlessSpyListener.waitForS3MyBucket({
      condition: (d) => d.key === `${id}.json`,
    });

    //SQS QueueNo2 ---> function FromSqsToEventBridge
    (
      await serverlessSpyListener.waitForFunctionFromSqsToEventBridgeRequest<SQSEvent>(
        {
          condition: (d) =>
            !!d.request.Records.map((r) => JSON.parse(r.body) as TestData).find(
              (d) => d.id === data.id
            ),
        }
      )
    ).toMatchObject({
      request: {
        Records: expect.arrayContaining([
          expect.objectContaining({
            body: JSON.stringify(data),
          }),
        ]),
      },
    });

    //function FromSqsToEventBridge ---> to EventBridge MyEventBus
    await serverlessSpyListener.waitForEventBridgeMyEventBus<TestData>({
      condition: (d) => d.detail.id === data.id,
    });

    // EventBridge MyEventBus
    await serverlessSpyListener.waitForEventBridgeRuleMyEventBusMyEventBridge<TestData>(
      {
        condition: (d) => d.detail.id === data.id,
      }
    );

    //EventBridge MyEventBus ---> function ReceiveEventBridge
    (
      await serverlessSpyListener.waitForFunctionReceiveEventBridgeRequest<
        EventBridgeEvent<'test', TestData>
      >({
        condition: (d) => d.request.detail.id === data.id,
      })
    ).toMatchObject({
      request: {
        detail: data,
      },
    });
  });
});
