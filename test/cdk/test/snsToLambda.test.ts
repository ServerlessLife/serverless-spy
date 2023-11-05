import * as fs from 'fs';
import * as path from 'path';
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { SNSEvent } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { createServerlessSpyListener } from '../../../listener/createServerlessSpyListener';
import { ServerlessSpyListener } from '../../../listener/ServerlessSpyListener';
import { ServerlessSpyEvents } from '../serverlessSpyEvents/ServerlessSpyEventsSnsToLambda';
import { SnsToLambdaStack } from '../src/snsToLambdaStack';
import { TestData } from './TestData';

jest.setTimeout(30000);

describe('SNS to Lambda', () => {
  const exportLocation = path.join(__dirname, '../cdkOutput.json');
  let serverlessSpyListener: ServerlessSpyListener<ServerlessSpyEvents>;

  if (!fs.existsSync(exportLocation)) {
    throw new Error(`File ${exportLocation} does not exists.`);
  }
  const output = JSON.parse(fs.readFileSync(exportLocation).toString())[
    'ServerlessSpySnsToLambda'
  ];

  beforeEach(async () => {
    serverlessSpyListener =
      await createServerlessSpyListener<ServerlessSpyEvents>({
        scope: 'ServerlessSpySnsToLambda',
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

    const snsClient = new SNSClient({});
    const params = new PublishCommand({
      Message: JSON.stringify(data),
      TopicArn: output.SnsTopicArnMyTopic,
    });
    await snsClient.send(params);

    (
      await serverlessSpyListener.waitForSnsTopicMyTopic<TestData>({
        condition: (d) => d.message.id === id,
      })
    ).toMatchObject({ message: data });

    (
      await serverlessSpyListener.waitForSnsSubscriptionMyTopicMyLambda<TestData>(
        {
          condition: (d) => d.message.id === id,
        }
      )
    ).toMatchObject({ message: data });

    (
      await (
        await serverlessSpyListener.waitForFunctionMyLambdaRequest<SNSEvent>({
          condition: (d) =>
            !!d.request.Records.map(
              (r) => JSON.parse(r.Sns.Message) as TestData
            ).find((d) => d.id === data.id),
        })
      )
        .toMatchObject({
          request: {
            Records: expect.arrayContaining([
              expect.objectContaining({
                Sns: expect.objectContaining({
                  Message: JSON.stringify(data),
                }),
              }),
            ]),
          },
        })
        .followedByResponse({})
    ).toMatchObject({
      request: {
        Records: expect.arrayContaining([
          expect.objectContaining({
            Sns: expect.objectContaining({
              Message: JSON.stringify(data),
            }),
          }),
        ]),
      },
    });

    (
      await (
        await serverlessSpyListener.waitForFunctionMyPythonLambdaRequest<SNSEvent>(
          {
            condition: (d) =>
              !!d.request.Records.map(
                (r) => JSON.parse(r.Sns.Message) as TestData
              ).find((d) => d.id === data.id),
          }
        )
      )
        .toMatchObject({
          request: {
            Records: expect.arrayContaining([
              expect.objectContaining({
                Sns: expect.objectContaining({
                  Message: JSON.stringify(data),
                }),
              }),
            ]),
          },
        })
        .followedByResponse({})
    ).toMatchObject({
      request: {
        Records: expect.arrayContaining([
          expect.objectContaining({
            Sns: expect.objectContaining({
              Message: JSON.stringify(data),
            }),
          }),
        ]),
      },
    });
  });

  test('Snapshot', () => {
    const app = new App();
    const stack = new SnsToLambdaStack(app, 'Test', {
      generateSpyEventsFile: false,
    });
    const template = Template.fromStack(stack);
    expect(template.toJSON()).toMatchSnapshot();
  });
});
