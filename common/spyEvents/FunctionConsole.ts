export type FunctionConsole = {
  type: 'log' | 'debug' | 'info' | 'error' | 'warn';
  message?: any;
  optionalParams: any[];
};
