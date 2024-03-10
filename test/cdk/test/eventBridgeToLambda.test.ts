import * as fs from 'fs';
import * as path from 'path';
import {
  EventBridgeClient,
  PutEventsCommand,
} from '@aws-sdk/client-eventbridge';
import { EventBridgeEvent } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { TestData } from './TestData';
import { createServerlessSpyListener } from '../../../listener/createServerlessSpyListener';
import { ServerlessSpyListener } from '../../../listener/ServerlessSpyListener';
import { ServerlessSpyEvents } from '../serverlessSpyEvents/ServerlessSpyEventsEventBridgeToLambda';

jest.setTimeout(30000);

describe('EventBridge to Lambda', () => {
  const exportLocation = path.join(__dirname, '../cdkOutput.json');
  let serverlessSpyListener: ServerlessSpyListener<ServerlessSpyEvents>;

  if (!fs.existsSync(exportLocation)) {
    throw new Error(`File ${exportLocation} does not exists.`);
  }
  const output = JSON.parse(fs.readFileSync(exportLocation).toString())[
    'ServerlessSpyEventBridgeToLambda'
  ];

  beforeEach(async () => {
    serverlessSpyListener =
      await createServerlessSpyListener<ServerlessSpyEvents>({
        scope: 'ServerlessSpyEventBridgeToLambda',
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

    const command = new PutEventsCommand({
      Entries: [
        {
          EventBusName: output.EventBusNameMyEventBus,
          Detail: JSON.stringify(data),
          DetailType: 'test',
          Source: 'test-source',
        },
      ],
    });

    const eventBridgeClient = new EventBridgeClient({});
    await eventBridgeClient.send(command);

    (
      await serverlessSpyListener.waitForEventBridgeMyEventBus<TestData>({
        condition: (d) => d.detail.id === id,
      })
    ).toMatchObject({
      detail: data,
      detailType: 'test',
      source: 'test-source',
    });

    (
      await serverlessSpyListener.waitForEventBridgeRuleMyEventBusMyRule<TestData>(
        {
          condition: (d) => d.detail.id === id,
        }
      )
    ).toMatchObject({
      detail: data,
      detailType: 'test',
      source: 'test-source',
    });

    (
      await (
        await serverlessSpyListener.waitForFunctionMyLambdaRequest<
          EventBridgeEvent<'test', TestData>
        >({
          condition: (d) => d.request.detail.id === id,
        })
      )
        .toMatchObject({
          request: {
            detail: data,
            source: 'test-source',
          },
        })
        .followedByResponse<EventBridgeEvent<'test', TestData>>({})
    ).toMatchObject({
      request: {
        detail: data,
        source: 'test-source',
      },
    });
    (
      await (
        await serverlessSpyListener.waitForFunctionMyPythonLambdaRequest<
          EventBridgeEvent<'test', TestData>
        >({
          condition: (d) => d.request.detail.id === id,
        })
      )
        .toMatchObject({
          request: {
            detail: data,
            source: 'test-source',
          },
        })
        .followedByResponse<EventBridgeEvent<'test', TestData>>({})
    ).toMatchObject({
      request: {
        detail: data,
        source: 'test-source',
      },
    });
  });
});
