import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { APIGatewayEvent } from 'aws-lambda';
import { envVariableNames } from '../src/common/envVariableNames';

const ddb = new DynamoDBClient({
  region: process.env.AWS_REGION,
});

exports.handler = async (event: APIGatewayEvent) => {
  console.log('EVENT', JSON.stringify(event));

  const putParams = new PutItemCommand({
    TableName: process.env[envVariableNames.SSPY_WS_TABLE_NAME] as string,
    Item: {
      connectionId: { S: event.requestContext.connectionId! },
    },
  });

  try {
    await ddb.send(putParams);
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: 'Failed to connect: ' + JSON.stringify(err),
    };
  }

  return { statusCode: 200, body: 'Connected.' };
};
