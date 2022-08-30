import { App } from 'aws-cdk-lib';
import { E2eStack } from './e2e';
import { EventBridgeToLambdaStack } from './eventBridgeToLambdaStack';
import { LambdaToDynamoDbStack } from './lambdaToDynamoDbStack';
import { LambdaToEventBridgeStack } from './lambdaToEventBridgeStack';
import { LambdaToS3Stack } from './lambdaToS3Stack';
import { LambdaToSnsStack } from './lambdaToSnsStack';
import { LambdaToSqsStack } from './lambdaToSqsStack';
import { SnsToLambdaStack } from './snsToLambdaStack';
import { SqsToLambdaStack } from './sqsToLambdaStack';

const testEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new E2eStack(app, 'ServerlessSpyE2e', {
  env: testEnv,
  generateSpyEventsFile: true,
});
new EventBridgeToLambdaStack(app, 'ServerlessSpyEventBridgeToLambda', {
  env: testEnv,
  generateSpyEventsFile: true,
});
new LambdaToDynamoDbStack(app, 'ServerlessSpyLambdaToDynamoDb', {
  env: testEnv,
  generateSpyEventsFile: true,
});
new LambdaToEventBridgeStack(app, 'ServerlessSpyLambdaToEventBridge', {
  env: testEnv,
  generateSpyEventsFile: true,
});
new LambdaToS3Stack(app, 'ServerlessSpyLambdaToS3', {
  env: testEnv,
  generateSpyEventsFile: true,
});
new LambdaToSnsStack(app, 'ServerlessSpyLambdaToSns', {
  env: testEnv,
  generateSpyEventsFile: true,
});
new LambdaToSqsStack(app, 'ServerlessSpyLambdaToSqs', {
  env: testEnv,
  generateSpyEventsFile: true,
});
new SnsToLambdaStack(app, 'ServerlessSpySnsToLambda', {
  env: testEnv,
  generateSpyEventsFile: true,
});
new SqsToLambdaStack(app, 'ServerlessSpySqsToLambda', {
  env: testEnv,
  generateSpyEventsFile: true,
});

app.synth();
