import { SnsSpyEventBase } from './SnsSpyEventBase';

export interface SnsSubscriptionSpyEvent<MessageType = any>
  extends SnsSpyEventBase<MessageType> {
  spyEventType: 'FunctionSnsSubscription';
}
