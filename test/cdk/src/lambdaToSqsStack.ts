import * as path from 'path';
import { Duration, Stack, CfnOutput } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';
//import { ServerlessSpy } from 'serverless-spy';
import { ServerlessSpy } from '../../../src/ServerlessSpy';
import { GenerateSpyEventsFileProps } from './GenerateSpyEventsFileProps';

export class LambdaToSqsStack extends Stack {
  constructor(scope: Construct, id: string, props: GenerateSpyEventsFileProps) {
    super(scope, id, props);

    const queue = new sqs.Queue(this, 'MyQueue');

    const func = new NodejsFunction(this, 'MyLambda', {
      memorySize: 512,
      timeout: Duration.seconds(5),
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'handler',
      entry: path.join(__dirname, '../functions/toSqs.ts'),
      environment: {
        SQS_URL: queue.queueUrl,
      },
    });
    queue.grantSendMessages(func);

    const serverlessSpy = new ServerlessSpy(this, 'ServerlessSpy', {
      generateSpyEventsFileLocation: props.generateSpyEventsFile
        ? '.cdkOut/ServerlessSpyEventsLambdaToSqs.ts'
        : undefined,
    });

    new CfnOutput(this, `FunctionName${serverlessSpy.getConstructName(func)}`, {
      value: func.functionName,
    });
  }
}
