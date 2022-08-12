import { ClientContext, CognitoIdentity } from 'aws-lambda';

export interface FunctionContext {
  functionName: string;
  awsRequestId: string;
  identity?: CognitoIdentity | undefined;
  clientContext?: ClientContext | undefined;
}
