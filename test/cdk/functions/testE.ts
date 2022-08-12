import { EventBridgeEvent } from 'aws-lambda';

export const handler = async (event: EventBridgeEvent<any, any>) => {
  console.log('RECEIVED EVENT:', JSON.stringify(event));

  const message = event.detail;

  return { message: 'Hello ' + message.key1 };
};
