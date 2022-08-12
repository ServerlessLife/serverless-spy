import { FunctionContext } from './FunctionContext';
import { SpyEvent } from './SpyEvent';

export interface FunctionErrorSpyEvent<TRequest = any> extends SpyEvent {
  spyEventType: 'FunctionError';
  request: TRequest;
  context: FunctionContext;
  error: any;
}
