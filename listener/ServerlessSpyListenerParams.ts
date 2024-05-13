export type ServerlessSpyListenerParams = {
  debugMode?: boolean;
  scope: string;
  serverlessSpyWsUrl: string;
  connectionOpenResolve?: () => void;
  connectionOpenReject?: (reason?: any) => void;
};
