import { App } from 'aws-cdk-lib';
import { E2eStack } from './e2e';
import { LambdaToSNSStack } from './lambdaToSNS';

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new E2eStack(app, 'ServerlessSpyE2e', { env: devEnv });
new LambdaToSNSStack(app, 'ServerlessSpyLambdaToSNS', { env: devEnv });

app.synth();
