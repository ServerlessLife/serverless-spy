import * as path from 'path';
import { Duration, Stack, CfnOutput } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as sns from 'aws-cdk-lib/aws-sns';
import { LambdaSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';
import { Construct } from 'constructs';
import { ServerlessSpy } from '../../../src/ServerlessSpy';
import { GenerateSpyEventsFileProps } from './GenerateSpyEventsFileProps';

export class SnsToLambdaStack extends Stack {
  constructor(scope: Construct, id: string, props: GenerateSpyEventsFileProps) {
    super(scope, id, props);

    const topic = new sns.Topic(this, 'MyTopic', {});

    const func = new NodejsFunction(this, 'MyLambda', {
      memorySize: 512,
      timeout: Duration.seconds(5),
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'handler',
      entry: path.join(__dirname, '../functions/dummy.ts'),
      environment: {
        NODE_OPTIONS: '--enable-source-maps',
      },
    });
    topic.addSubscription(new LambdaSubscription(func));

    const pythonFunc = new lambda.Function(this, 'MyPythonLambda', {
      memorySize: 512,
      timeout: Duration.seconds(5),
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'dummy.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../functions/python/')),
      environment: {},
    });
    topic.addSubscription(new LambdaSubscription(pythonFunc));

    const serverlessSpy = new ServerlessSpy(this, 'ServerlessSpy', {
      generateSpyEventsFileLocation: props.generateSpyEventsFile
        ? 'serverlessSpyEvents/ServerlessSpyEventsSnsToLambda.ts'
        : undefined,
      debugMode: true,
    });

    serverlessSpy.spy();

    new CfnOutput(this, `SnsTopicArn${serverlessSpy.getConstructName(topic)}`, {
      value: topic.topicArn,
    });
  }
}
