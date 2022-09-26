import { SnsSpyEventBase } from './SnsSpyEventBase';

export interface SnsTopicSpyEvent<MessageType = any>
  extends SnsSpyEventBase<MessageType> {
  spyEventType: 'FunctionSnsTopic';
}
