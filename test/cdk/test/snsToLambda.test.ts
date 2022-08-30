import * as fs from 'fs';
import * as path from 'path';
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { v4 as uuidv4 } from 'uuid';
import { createServerlessSpyListener } from '../../../listener/createServerlessSpyListener';
import { SpyListener } from '../../../listener/SpyListener';
import { ServerlessSpyEvents } from '../.cdkOut/ServerlessSpyEventsSnsToLambda';
import { SnsToLambdaStack } from '../src/snsToLambdaStack';
import { TestData } from './TestData';

jest.setTimeout(30000);

describe('SNS to Lambda', () => {
  const exportLocation = path.join(__dirname, '../.cdkOut/cdkExports.json');
  let serverlessSpyListener: SpyListener<ServerlessSpyEvents>;

  if (!fs.existsSync(exportLocation)) {
    throw new Error(`File ${exportLocation} doen not exists.`);
  }
  const output = JSON.parse(fs.readFileSync(exportLocation).toString())[
    'ServerlessSpySnsToLambda'
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

    const snsClient = new SNSClient({});
    const params = new PublishCommand({
      Message: JSON.stringify(data),
      TopicArn: output.SnsTopicArnMyTopic,
    });
    await snsClient.send(params);

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
    //   await serverlessSpyListener.waitForSnsTopicMyTopic<TestData>({
    //     condition: (d) => d.message.id === id,
    //   })
    // ).toMatchObject({ message: data });

    // (
    //   await serverlessSpyListener.waitForSnsSubscriptionMyTopicMyLambda<TestData>(
    //     {
    //       condition: (d) => d.message.id === id,
    //     }
    //   )
    // ).toMatchObject({ message: data });
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
