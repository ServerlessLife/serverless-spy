import {
  ApiGatewayManagementApi,
  PostToConnectionCommand,
} from '@aws-sdk/client-apigatewaymanagementapi';
import {
  AttributeValue,
  DeleteItemCommand,
  DynamoDBClient,
  ScanCommand,
} from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

import {
  DynamoDBStreamEvent,
  S3Event,
  SNSEvent,
  EventBridgeEvent,
  SQSEvent,
} from 'aws-lambda';
import { DynamoDBSpyEvent } from '../common/spyEvents/DynamoDBSpyEvent';
import { EventBridgeRuleSpyEvent } from '../common/spyEvents/EventBridgeRuleSpyEvent';
import { EventBridgeSpyEvent } from '../common/spyEvents/EventBridgeSpyEvent';
import { S3SpyEvent } from '../common/spyEvents/S3SpyEvent';
import { SnsSubscriptionSpyEvent } from '../common/spyEvents/SnsSubscriptionSpyEvent';
import { SnsTopicSpyEvent } from '../common/spyEvents/SnsTopicSpyEvent';
import { SpyMessage } from '../common/spyEvents/SpyMessage';
import { SqsSpyEvent } from '../common/spyEvents/SqsSpyEvent';
import { envVariableNames } from '../src/common/envVariableNames';

const ddb = new DynamoDBClient({
  region: process.env.AWS_REGION,
});

const { TABLE_NAME } = process.env;
const endpoint = process.env[envVariableNames.WS_ENDPOINT]!;

const apigwManagementApi = new ApiGatewayManagementApi({
  apiVersion: '2018-11-29',
  endpoint,
});

let connections: Record<string, AttributeValue>[] | undefined;

export const handler = async (event: any, context: any) => {
  console.log('EVENT', JSON.stringify(event));
  // console.log("CONTEXT", JSON.stringify(context));

  const mapping = JSON.parse(process.env[envVariableNames.INFRA_MAPPING]!);
  console.log('mapping', JSON.stringify(mapping));

  let connectionData;

  const scanParams = new ScanCommand({
    TableName: process.env.TABLE_NAME as string,
    ProjectionExpression: 'connectionId',
  });

  try {
    connectionData = await ddb.send(scanParams);
  } catch (e) {
    console.error(e);
    return { statusCode: 500, body: (e as Error)?.stack };
  }
  connections = connectionData.Items;

  console.log(
    `connections at ${new Date().toISOString()}`,
    JSON.stringify(connections)
  );

  const postDataPromises: Promise<any>[] = [];

  if (event?.Records && event.Records[0]?.Sns) {
    console.log('*** SNS ***');
    const eventSns = event as SNSEvent;
    for (const record of eventSns.Records) {
      const subscriptionArn = record.EventSubscriptionArn;

      let serviceKey: string;
      if (mapping[subscriptionArn]) {
        // subscription event that could contain filter based on existing subscription
        serviceKey = mapping[subscriptionArn];
      } else {
        // catch all subscription
        const topicArn = record.Sns.TopicArn;
        serviceKey = mapping[topicArn];
      }

      let message: string;

      try {
        message = JSON.parse(record.Sns.Message);
      } catch {
        message = record.Sns.Message;
      }

      const spyEventType = getSpyEventType(serviceKey) as
        | 'FunctionSnsTopic'
        | 'FunctionSnsSubscription';

      const data: SnsTopicSpyEvent | SnsSubscriptionSpyEvent = {
        spyEventType,
        message,
        subject: record.Sns.Subject,
        timestamp: record.Sns.Timestamp,
        topicArn: record.Sns.TopicArn,
        messageId: record.Sns.MessageId,
        messageAttributes: record.Sns.MessageAttributes,
      };

      const fluentEvent: Omit<SpyMessage, 'timestamp'> = {
        data,
        serviceKey,
      };
      postDataPromises.push(postData(fluentEvent));
    }
  } else if (event?.Records && event.Records[0]?.eventSource === 'aws:sqs') {
    console.log('*** SQS ***');
    const eventSqs = event as SQSEvent;
    for (const record of eventSqs.Records) {
      const subscriptionArn = record.eventSourceARN;

      const serviceKey = mapping[subscriptionArn];
      let body: string;

      try {
        body = JSON.parse(record.body);
      } catch {
        body = record.body;
      }

      const data: SqsSpyEvent = {
        spyEventType: 'Sqs',
        body,
        messageAttributes: record.messageAttributes,
      };

      const fluentEvent: Omit<SpyMessage, 'timestamp'> = {
        data,
        serviceKey,
      };
      postDataPromises.push(postData(fluentEvent));
    }
  } else if (event?.Records && event.Records[0]?.s3) {
    console.log('*** S3 ***');
    const eventS3 = event as S3Event;
    for (const record of eventS3.Records) {
      const bucketArn = record.s3.bucket.arn;

      const data: S3SpyEvent = {
        spyEventType: 'S3',
        eventName: record.eventName,
        eventTime: record.eventTime,
        bucket: record.s3.bucket.name,
        key: record.s3.object.key,
      };

      const fluentEvent: Omit<SpyMessage, 'timestamp'> = {
        data,
        serviceKey: mapping[bucketArn],
      };
      postDataPromises.push(postData(fluentEvent));
    }
  } else if (event.Records && event.Records[0]?.dynamodb) {
    console.log('*** DYNAMODB ***');
    const eventDynamoDB = event as DynamoDBStreamEvent;
    for (const record of eventDynamoDB.Records) {
      let arn = record.eventSourceARN!;
      arn = arn.substring(0, arn.indexOf('/stream/'));

      const data: DynamoDBSpyEvent = {
        spyEventType: 'DynamoDB',
        eventName: record.eventName,
        newImage: unmarshall(record.dynamodb?.NewImage as any),
        keys: unmarshall(record.dynamodb?.Keys as any),
        oldImage: record.dynamodb?.OldImage
          ? unmarshall(record.dynamodb?.OldImage as any)
          : undefined,
      };

      const fluentEvent: Omit<SpyMessage, 'timestamp'> = {
        data,
        serviceKey: mapping[arn],
      };
      postDataPromises.push(postData(fluentEvent));
    }
  } else if (
    event.detail &&
    event['detail-type'] &&
    event.version &&
    event.source
  ) {
    console.log('*** EventBridge ***');
    const eventEb = event as EventBridgeEvent<any, any>;

    const serviceKey = mapping.eventBridge; // the is new lambda for each subscription

    const spyEventType = getSpyEventType(serviceKey) as
      | 'EventBridge'
      | 'EventBridgeRule';

    const message = eventEb.detail;

    const data: EventBridgeSpyEvent | EventBridgeRuleSpyEvent = {
      spyEventType,
      detail: message,
      detailType: eventEb['detail-type'],
      source: eventEb.source,
      time: eventEb.time,
      account: eventEb.account,
    };

    const fluentEvent: Omit<SpyMessage, 'timestamp'> = {
      data,
      serviceKey,
    };
    postDataPromises.push(postData(fluentEvent));
  } else {
    console.log('*** OTHER ***');
    const fluentEvent: Omit<SpyMessage, 'timestamp'> = event;
    postDataPromises.push(postData(fluentEvent));
  }

  await Promise.all(postDataPromises);

  return { statusCode: 200, body: 'Data sent.' };
};

async function postData(spyMessage: Omit<SpyMessage, 'timestamp'>) {
  // const postData = JSON.parse(event.body!).data;
  console.log('postData', JSON.stringify(spyMessage));

  if (!connections) {
    return;
  }

  const postCalls = connections.map(async ({ connectionId }) => {
    console.log(`Sending message to: ${connectionId.S}`);

    try {
      const postToConnectionCommand = new PostToConnectionCommand({
        ConnectionId: connectionId.S,
        Data: JSON.stringify({
          timestamp: new Date().toISOString(),
          serviceKey: spyMessage.serviceKey,
          data: spyMessage.data,
        }) as any,
      });

      await apigwManagementApi.send(postToConnectionCommand);
    } catch (e) {
      console.error(`Fails sending message to: ${connectionId.S}`, e);
      console.error(`Status code: ${(e as any).statusCode}`);
      if ((e as any).$metadata.httpStatusCode === 410) {
        console.log(`Found stale connection, deleting ${connectionId}`);

        const deleteParams = new DeleteItemCommand({
          TableName: TABLE_NAME,
          Key: { connectionId },
        });

        await ddb.send(deleteParams);
      } else {
        throw e;
      }
    }
  });

  try {
    await Promise.all(postCalls);
    console.log('Send message finish');
  } catch (e) {
    return { statusCode: 500, body: (e as Error)?.stack };
  }
}

function getSpyEventType(serviceKey: string) {
  if (!serviceKey) {
    throw new Error('Missing serviceKey');
  }

  return serviceKey.substring(0, serviceKey.indexOf('#'));
}
