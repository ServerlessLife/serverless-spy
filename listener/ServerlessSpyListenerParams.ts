import { Credentials } from '@aws-sdk/types';

export type ServerlessSpyListenerParams = {
  serverlessSpyWsUrl: string;
  credentials?: Credentials;
  debugMode?: boolean;
};
