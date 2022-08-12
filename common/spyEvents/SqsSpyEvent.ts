import { SQSMessageAttributes } from 'aws-lambda';
import { SpyEvent } from './SpyEvent';

export interface SqsSpyEvent<MessageType = any> extends SpyEvent {
  spyEventType: 'Sqs';
  body: MessageType;
  messageAttributes: SQSMessageAttributes;
}
