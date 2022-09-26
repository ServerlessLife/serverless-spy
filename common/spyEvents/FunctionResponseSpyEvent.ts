import { FunctionBaseSpyEvent } from './FunctionBaseSpyEvent';

export interface FunctionResponseSpyEvent<TRequest = any, TResponse = any>
  extends FunctionBaseSpyEvent<TRequest> {
  spyEventType: 'FunctionResponse';
  response: TResponse;
}
