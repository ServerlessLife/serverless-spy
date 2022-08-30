import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

const ddbDocClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const handler = async (event: any) => {
  const putCommand = new PutCommand({
    TableName: process.env.DYNAMODB_TABLE_NAME!,
    Item: {
      pk: event.id,
      ...event,
    },
  });

  await ddbDocClient.send(putCommand);

  return event;
};
