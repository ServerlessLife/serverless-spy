export type FunctionConsole = {
  type: 'log' | 'debug' | 'info' | 'error' | 'warn';
  formattedMessage?: string;
  message?: any;
  optionalParams: any[];
};
