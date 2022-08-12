import { FunctionContext } from './FunctionContext';
import { SpyEvent } from './SpyEvent';

export interface FunctionResponseSpyEvent<TRequest = any, TResponse = any>
  extends SpyEvent {
  spyEventType: 'FunctionResponse';
  request: TRequest;
  context: FunctionContext;
  response: TResponse;
}
