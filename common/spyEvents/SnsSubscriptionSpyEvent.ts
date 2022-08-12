import { SNSMessageAttributes } from 'aws-lambda';
import { SpyEvent } from './SpyEvent';

export interface SnsSubscriptionSpyEvent<MessageType = any> extends SpyEvent {
  spyEventType: 'FunctionSnsSubscription';
  message: MessageType;
  subject: string;
  timestamp: string;
  topicArn: string;
  messageId: string;
  messageAttributes: SNSMessageAttributes;
}
