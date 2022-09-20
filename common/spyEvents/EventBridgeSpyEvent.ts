import { SpyEvent } from './SpyEvent';

export interface EventBridgeSpyEvent<
  MessageType = any,
  EventBridgeDetailType extends string = string
> extends SpyEvent {
  spyEventType: 'EventBridge';
  eventBridgeId: string;
  detail: MessageType;
  detailType: EventBridgeDetailType;
  source: string;
  time: string;
  account: string;
}
