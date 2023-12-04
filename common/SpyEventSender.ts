import { unmarshall } from '@aws-sdk/util-dynamodb';
import iot from 'aws-iot-device-sdk';
import {
  DynamoDBStreamEvent,
  S3Event,
  SNSEvent,
  EventBridgeEvent,
  SQSEvent,
} from 'aws-lambda';
import { v4 } from 'uuid';
import {
  fragment,
  getConnection,
  SSPY_TOPIC,
} from '../listener/iot-connection';
import { envVariableNames } from '../src/common/envVariableNames';
import { DynamoDBSpyEvent } from './spyEvents/DynamoDBSpyEvent';
import { EventBridgeRuleSpyEvent } from './spyEvents/EventBridgeRuleSpyEvent';
import { EventBridgeSpyEvent } from './spyEvents/EventBridgeSpyEvent';
import { S3SpyEvent } from './spyEvents/S3SpyEvent';
import { SnsSubscriptionSpyEvent } from './spyEvents/SnsSubscriptionSpyEvent';
import { SnsTopicSpyEvent } from './spyEvents/SnsTopicSpyEvent';
import { SpyMessage } from './spyEvents/SpyMessage';
import { SqsSpyEvent } from './spyEvents/SqsSpyEvent';

export class SpyEventSender {
  debugMode = process.env[envVariableNames.SSPY_DEBUG] === 'true';
  connection: iot.device | undefined;
  scope: string;

  constructor(params: {
    log?: (message: string, ...optionalParams: any[]) => void;
    logError?: (message: string, ...optionalParams: any[]) => void;
    scope: string;
  }) {
    if (params.log) {
      this.log = params.log;
    }

    if (params.logError) {
      this.logError = params.logError;
    }

    this.scope = params.scope;
  }

  public async close() {
    this.connection?.end();
  }

  public async connect() {
    this.connection = await getConnection(this.debugMode);
  }

  public async publishSpyEvent(event: any) {
    this.log('Event', JSON.stringify(event));

    const mapping = JSON.parse(
      process.env[envVariableNames.SSPY_INFRA_MAPPING]!
    );
    this.log('ARN to names mapping', JSON.stringify(mapping));

    const postDataPromises: Promise<any>[] = [];

    if (event?.Records && event.Records[0]?.Sns) {
      //console.log('*** SNS ***');
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

        const spyEventType = this.getSpyEventType(serviceKey) as
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
        postDataPromises.push(this.postData(fluentEvent));
      }
    } else if (event?.Records && event.Records[0]?.eventSource === 'aws:sqs') {
      //console.log('*** SQS ***');
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
        postDataPromises.push(this.postData(fluentEvent));
      }
    } else if (event?.Records && event.Records[0]?.s3) {
      //console.log('*** S3 ***');
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
        postDataPromises.push(this.postData(fluentEvent));
      }
    } else if (event.Records && event.Records[0]?.dynamodb) {
      //console.log('*** DYNAMODB ***');
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
        postDataPromises.push(this.postData(fluentEvent));
      }
    } else if (
      event.detail &&
      event['detail-type'] &&
      event.version &&
      event.source
    ) {
      //console.log('*** EventBridge ***');
      const eventEb = event as EventBridgeEvent<any, any>;

      const serviceKey = mapping.eventBridge; // the is new lambda for each subscription

      const spyEventType = this.getSpyEventType(serviceKey) as
        | 'EventBridge'
        | 'EventBridgeRule';

      const message = eventEb.detail;

      const data: EventBridgeSpyEvent | EventBridgeRuleSpyEvent = {
        spyEventType,
        detail: message,
        detailType: eventEb['detail-type'],
        eventBridgeId: eventEb['id'],
        source: eventEb.source,
        time: eventEb.time,
        account: eventEb.account,
      };

      const fluentEvent: Omit<SpyMessage, 'timestamp'> = {
        data,
        serviceKey,
      };
      postDataPromises.push(this.postData(fluentEvent));
    } else {
      //console.log('*** OTHER ***');
      const fluentEvent: Omit<SpyMessage, 'timestamp'> = event;
      postDataPromises.push(this.postData(fluentEvent));
    }

    await Promise.all(postDataPromises);
  }

  private encode(input: any): fragment[] {
    const payload = JSON.stringify(input);
    const parts = payload.match(/.{1,50000}/g);
    if (!parts) return [];
    this.log(`Encoded iot message, ${parts.length}`);
    const id = v4();
    return parts.map((part, index) => ({
      id,
      index,
      count: parts.length,
      data: part,
    }));
  }

  private async postData(spyMessage: Omit<SpyMessage, 'timestamp'>) {
    if (this.connection === undefined) {
      throw new Error(
        'No IoT connection created yet, did you forget to call connect()?'
      );
    }

    this.log('Post spy message', JSON.stringify(spyMessage));

    const connection = this.connection;
    const topic = `${SSPY_TOPIC}/${this.scope}`;

    try {
      for (const fragment of this.encode(spyMessage)) {
        await new Promise<void>((resolve) => {
          connection.publish(
            topic,
            JSON.stringify(fragment),
            {
              qos: 1,
            },
            () => {
              console.error('Publishing finished');
              resolve();
            }
          );
        });
        this.log(
          `Published fragment ${fragment.index} out of ${fragment.count} to topic ${topic}`
        );
      }
    } catch (e) {
      this.logError(`Failed to send payload to iot: ${e}`);
    }

    this.log('Send spy message finish');
  }

  private getSpyEventType(serviceKey: string) {
    if (!serviceKey) {
      throw new Error('Missing serviceKey');
    }

    return serviceKey.substring(0, serviceKey.indexOf('#'));
  }

  private log(message: string, ...optionalParams: any[]) {
    if (this.debugMode) {
      console.debug('SSPY EXTENSION', message, ...optionalParams);
    }
  }

  private logError(message: string, ...optionalParams: any[]) {
    if (this.debugMode) {
      console.error('SSPY EXTENSION', message, ...optionalParams);
    }
  }
}
