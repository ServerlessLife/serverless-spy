import { NativeAttributeValue } from '@aws-sdk/util-dynamodb';
import { DynamoDBRecord } from 'aws-lambda';
import { SpyEvent } from './SpyEvent';

// asdasd
export interface DynamoDBSpyEvent<TData = any> extends SpyEvent {
  spyEventType: 'DynamoDB';
  eventName: DynamoDBRecord['eventName'];
  newImage?: TData;
  keys: Record<string, NativeAttributeValue>;
  oldImage?: TData;
}
