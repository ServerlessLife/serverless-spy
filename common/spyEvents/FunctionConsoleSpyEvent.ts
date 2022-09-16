import { FunctionConsole } from './FunctionConsole';
import { FunctionContext } from './FunctionContext';
import { SpyEvent } from './SpyEvent';

export interface FunctionConsoleSpyEvent<TRequest = any> extends SpyEvent {
  spyEventType: 'FunctionConsole';
  request: TRequest;
  console: FunctionConsole;
  context: FunctionContext;
}
