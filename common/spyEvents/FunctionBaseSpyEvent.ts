import { FunctionContext } from './FunctionContext';
import { SpyEvent } from './SpyEvent';

export interface FunctionBaseSpyEvent<TData = any> extends SpyEvent {
  request: TData;
  context: FunctionContext;
}
