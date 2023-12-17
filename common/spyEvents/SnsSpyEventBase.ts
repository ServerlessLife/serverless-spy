import { SNSMessageAttributes } from 'aws-lambda';
import { SpyEvent } from './SpyEvent';

export interface SnsSpyEventBase<MessageType = any> extends SpyEvent {
  message: MessageType;
  subject?: string;
  timestamp: string;
  topicArn: string;
  messageId: string;
  messageAttributes: SNSMessageAttributes;
}
