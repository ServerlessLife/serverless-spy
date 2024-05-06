import { Stack } from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';
import { GenerateSpyEventsFileProps } from './GenerateSpyEventsFileProps';
import { ServerlessSpy } from '../../../src/ServerlessSpy';

// No test file for this stack, because the error will occur during deployment
export class SingletonLambdaFunctionStack extends Stack {
  constructor(scope: Construct, id: string, props: GenerateSpyEventsFileProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(
      this,
      'SingletonLambdaFunctionBucket-3fc2bca1-567b-4c3e-a1ba-34af41a09dcc'
    );

    new s3deploy.BucketDeployment(this, 'DeployStaticAssets1', {
      sources: [s3deploy.Source.jsonData('DummyKey1', { test: 'testing' })],
      destinationBucket: bucket,
    });

    new s3deploy.BucketDeployment(this, 'DeployStaticAssets2', {
      sources: [s3deploy.Source.jsonData('DummyKey2', { test: 'testing' })],
      destinationBucket: bucket,
    });

    const serverlessSpy = new ServerlessSpy(this, 'ServerlessSpy', {
      generateSpyEventsFileLocation: props.generateSpyEventsFile
        ? 'serverlessSpyEvents/SingletonLambdaFunction.ts'
        : undefined,
      debugMode: true,
    });

    serverlessSpy.spy();
  }
}
