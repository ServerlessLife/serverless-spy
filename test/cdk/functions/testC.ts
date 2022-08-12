import {
  EventBridgeClient,
  PutEventsCommand,
} from '@aws-sdk/client-eventbridge';
import { SQSEvent } from 'aws-lambda';

const eventBridgeClient = new EventBridgeClient({});

export const handler = async (event: SQSEvent) => {
  console.log('RECEIVED EVENT:', JSON.stringify(event));

  const message = JSON.parse(event.Records[0].body);

  const command = new PutEventsCommand({
    Entries: [
      {
        EventBusName: process.env.EB_NAME,
        Detail: JSON.stringify(message),
        DetailType: 'test',
        Source: 'test-source',
      },
    ],
  });

  await eventBridgeClient.send(command);

  console.log('Send to EventBridge');

  return { message: 'Hello ' + message.key1 };
};
