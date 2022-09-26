import { EventBridgeBaseSpyEvent } from './EventBridgeBaseSpyEvent';

export interface EventBridgeSpyEvent<
  MessageType = any,
  EventBridgeDetailType extends string = string
> extends EventBridgeBaseSpyEvent<MessageType, EventBridgeDetailType> {
  spyEventType: 'EventBridge';
}
