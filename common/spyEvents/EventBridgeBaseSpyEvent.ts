import { SpyEvent } from './SpyEvent';

export interface EventBridgeBaseSpyEvent<
  MessageType = any,
  EventBridgeDetailType extends string = string
> extends SpyEvent {
  eventBridgeId: string;
  detail: MessageType;
  detailType: EventBridgeDetailType;
  source: string;
  time: string;
  account: string;
}
