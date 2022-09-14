import { DeleteItemCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { APIGatewayEvent } from 'aws-lambda';
import { envVariableNames } from '../src/common/envVariableNames';

const ddb = new DynamoDBClient({
  region: process.env.AWS_REGION,
});
export const handler = async (event: APIGatewayEvent) => {
  console.log('EVENT', JSON.stringify(event));

  const deleteParams = new DeleteItemCommand({
    TableName: process.env[envVariableNames.SSPY_WS_TABLE_NAME],
    Key: {
      connectionId: { S: event.requestContext.connectionId! },
    },
  });

  try {
    await ddb.send(deleteParams);
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: 'Failed to disconnect: ' + JSON.stringify(err),
    };
  }

  return { statusCode: 200, body: 'Disconnected.' };
};
