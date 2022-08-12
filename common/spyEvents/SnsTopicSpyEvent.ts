import { SNSMessageAttributes } from 'aws-lambda';
import { SpyEvent } from './SpyEvent';

export interface SnsTopicSpyEvent<MessageType = any> extends SpyEvent {
  spyEventType: 'FunctionSnsTopic';
  message: MessageType;
  subject: string;
  timestamp: string;
  topicArn: string;
  messageId: string;
  messageAttributes: SNSMessageAttributes;
}
