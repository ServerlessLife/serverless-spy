import * as path from 'path';
import { Duration, Stack, CfnOutput } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as sns from 'aws-cdk-lib/aws-sns';
import { Construct } from 'constructs';
import { ServerlessSpy } from 'serverless-spy';
import { GenerateSpyEventsFileProps } from './GenerateSpyEventsFileProps';

export class LambdaToSnsStack extends Stack {
  constructor(scope: Construct, id: string, props: GenerateSpyEventsFileProps) {
    super(scope, id, props);

    const topic = new sns.Topic(this, 'MyTopic', {});

    const func = new NodejsFunction(this, 'MyLambda', {
      memorySize: 512,
      timeout: Duration.seconds(5),
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'handler',
      entry: path.join(__dirname, '../functions/toSns.ts'),
      environment: {
        SNS_TOPIC_ARN: topic.topicArn,
      },
    });
    topic.grantPublish(func);

    const serverlessSpy = new ServerlessSpy(this, 'ServerlessSpy', {
      generateSpyEventsFileLocation: props.generateSpyEventsFile
        ? '.cdkOut/ServerlessSpyEventsLambdaToSns.ts'
        : undefined,
    });

    new CfnOutput(this, `FunctionName${serverlessSpy.getConstructName(func)}`, {
      value: func.functionName,
    });
  }
}
