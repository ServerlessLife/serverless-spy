import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  MessageAttributeValue,
  PublishCommand,
  SNSClient,
} from '@aws-sdk/client-sns';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

const snsClient = new SNSClient({});
const ddbDocClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const handler = async (event: any) => {
  console.log('RECEIVED EVENT:', JSON.stringify(event));

  const params = new PublishCommand({
    Message: JSON.stringify(event),
    TopicArn: process.env.SNS_TOPIC_ARN,
    MessageAttributes: {
      test: <MessageAttributeValue>{ StringValue: 'test', DataType: 'String' },
    },
  });

  await snsClient.send(params);

  const putCommand = new PutCommand({
    TableName: process.env.DYNAMODB_TABLE_NAME!,
    Item: {
      pk: Math.floor(Math.random() * 1000000000).toString(),
      ...event,
    },
  });

  await ddbDocClient.send(putCommand);

  // return { message: "Hello " + event.key1 };
  return event;
};
