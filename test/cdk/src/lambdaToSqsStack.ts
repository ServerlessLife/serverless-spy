import * as path from 'path';
import { Duration, Stack, CfnOutput } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';
import { GenerateSpyEventsFileProps } from './GenerateSpyEventsFileProps';
import { ServerlessSpy } from '../../../src/ServerlessSpy';

export class LambdaToSqsStack extends Stack {
  constructor(scope: Construct, id: string, props: GenerateSpyEventsFileProps) {
    super(scope, id, props);

    const queue = new sqs.Queue(this, 'MyQueue');

    const func = new NodejsFunction(this, 'MyLambda', {
      memorySize: 512,
      timeout: Duration.seconds(5),
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'handler',
      entry: path.join(__dirname, '../functions/toSqs.ts'),
      environment: {
        SQS_URL: queue.queueUrl,
        NODE_OPTIONS: '--enable-source-maps',
      },
    });
    queue.grantSendMessages(func);

    const serverlessSpy = new ServerlessSpy(this, 'ServerlessSpy', {
      generateSpyEventsFileLocation: props.generateSpyEventsFile
        ? 'serverlessSpyEvents/ServerlessSpyEventsLambdaToSqs.ts'
        : undefined,
      debugMode: true,
    });

    serverlessSpy.spy();

    new CfnOutput(this, `FunctionName${serverlessSpy.getConstructName(func)}`, {
      value: func.functionName,
    });
  }
}
