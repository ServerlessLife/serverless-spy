import * as fs from 'fs';
import * as path from 'path';
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import { createServerlessSpyListener } from 'serverless-spy';
import { v4 as uuidv4 } from 'uuid';
//import { createServerlessSpyListener } from '../../../listener/createServerlessSpyListener';
//import { createServerlessSpyListener } from '../../../listener/createServerlessSpyListener';
import { SpyListener } from '../../../listener/SpyListener';
import { ServerlessSpyEvents } from '../.cdkOut/ServerlessSpyEventsLambdaToSNS';

jest.setTimeout(30000);

describe('Lambda to SNS', () => {
  const exportLocation = path.join(__dirname, '../.cdkOut/cdkExports.json');
  let serverlessSpyListener: SpyListener<ServerlessSpyEvents>;

  if (!fs.existsSync(exportLocation)) {
    throw new Error(`File ${exportLocation} doen not exists.`);
  }
  const output = JSON.parse(fs.readFileSync(exportLocation).toString())[
    'ServerlessSpyLambdaToSNS'
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

  test('basic test', async () => {
    const lambdaClient = new LambdaClient({});

    const id = uuidv4();
    const data = <DataType>{
      id,
      message: 'Hello',
    };

    const command = new InvokeCommand({
      FunctionName: output.FunctionNameLambdaToSNS,
      InvocationType: 'RequestResponse',
      LogType: 'Tail',
      Payload: JSON.stringify(data) as any,
    });

    await lambdaClient.send(command);

    //await (

    await (
      await serverlessSpyListener.waitForFunctionLambdaToSNSRequest<DataType>({
        condition: (d) => d.request.id === id,
      })
    )
      .toMatchObject({ request: data })
      .followedByResponse({});
    //).toMatchObject({ response: data });

    // (
    //   await serverlessSpyListener.waitForSnsTopicMyTopic<DataType>({
    //     condition: (d) => d.message.id === id,
    //   })
    // ).toMatchObject({ message: data });

    //console.log(a);
  });
});

// test('Snapshot', () => {
//   const app = new App();
//   const stack = new MyStack(app, 'TestStack');
//   expect(Template.fromStack(stack)).toMatchSnapshot();
// });

type DataType = {
  id: string;
  message: string;
};
