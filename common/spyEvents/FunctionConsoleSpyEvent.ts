import { SpyEvent } from './SpyEvent';

export interface FunctionConsoleSpyEvent<TRequest = any> extends SpyEvent {
  spyEventType: 'FunctionConsole';
  request: TRequest;
  console: {
    type: 'log' | 'debug' | 'info' | 'error' | 'warn';
    message?: any;
    optionalParams: any[];
  };
}
