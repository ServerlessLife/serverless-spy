import { FunctionBaseSpyEvent } from './FunctionBaseSpyEvent';
import { FunctionConsole } from './FunctionConsole';

export interface FunctionConsoleSpyEvent<TRequest = any>
  extends FunctionBaseSpyEvent<TRequest> {
  spyEventType: 'FunctionConsole';
  console: FunctionConsole;
}
