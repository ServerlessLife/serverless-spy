import { Credentials } from '@aws-sdk/types';

export type ServerlessSpyListenerParams = {
  credentials?: Credentials;
  debugMode?: boolean;
  scope: string;
};
