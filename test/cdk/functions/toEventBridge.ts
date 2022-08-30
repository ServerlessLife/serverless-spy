import {
  EventBridgeClient,
  PutEventsCommand,
} from '@aws-sdk/client-eventbridge';

const eventBridgeClient = new EventBridgeClient({});

export const handler = async (event: any) => {
  const command = new PutEventsCommand({
    Entries: [
      {
        EventBusName: process.env.EB_NAME,
        Detail: JSON.stringify(event),
        DetailType: 'test',
        Source: 'test-source',
      },
    ],
  });

  await eventBridgeClient.send(command);

  return event;
};
