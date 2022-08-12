import { SQSEvent } from 'aws-lambda';

export const handler = async (event: SQSEvent) => {
  console.log('RECEIVED EVENT:', JSON.stringify(event));

  const message = JSON.parse(event.Records[0].body);

  return { message: 'Hello ' + message.key1 };
};
