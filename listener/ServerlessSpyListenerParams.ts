import { Credentials } from '@aws-sdk/types';

export type ServerlessSpyListenerParams = {
  credentials?: Credentials;
  debugMode?: boolean;
  scope?: string;
  serverlessSpyWsUrl: string;
  connectionOpenResolve?: () => void;
  connectionOpenReject?: (reason?: any) => void;
};
