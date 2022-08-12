import { FunctionContext } from './FunctionContext';
import { SpyEvent } from './SpyEvent';

export interface FunctionRequestSpyEvent<TData = any> extends SpyEvent {
  spyEventType: 'FunctionRequest';
  request: TData;
  context: FunctionContext;
}
