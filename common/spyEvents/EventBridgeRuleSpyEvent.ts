import { EventBridgeBaseSpyEvent } from './EventBridgeBaseSpyEvent';

export interface EventBridgeRuleSpyEvent<
  MessageType = any,
  EventBridgeDetailType extends string = string
> extends EventBridgeBaseSpyEvent<MessageType, EventBridgeDetailType> {
  spyEventType: 'EventBridgeRule';
}
