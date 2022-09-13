import * as path from 'path';
import { Duration, Stack, CfnOutput } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as sns from 'aws-cdk-lib/aws-sns';
import { SqsSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';
import { ServerlessSpy } from '../../../src/ServerlessSpy';
import { GenerateSpyEventsFileProps } from './GenerateSpyEventsFileProps';

export class SnsToSqsStack extends Stack {
  constructor(scope: Construct, id: string, props: GenerateSpyEventsFileProps) {
    super(scope, id, props);

    const topic = new sns.Topic(this, 'MyTopic', {});

    const queue = new sqs.Queue(this, 'MyQueue');

    topic.addSubscription(new SqsSubscription(queue));

    const func = new NodejsFunction(this, 'MyLambda', {
      memorySize: 512,
      timeout: Duration.seconds(5),
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'handler',
      entry: path.join(__dirname, '../functions/dummy.ts'),
    });
    func.addEventSource(new SqsEventSource(queue));

    const serverlessSpy = new ServerlessSpy(this, 'ServerlessSpy', {
      generateSpyEventsFileLocation: props.generateSpyEventsFile
        ? '.cdkOut/ServerlessSpyEventsSnsToSqs.ts'
        : undefined,
    });

    new CfnOutput(this, `SnsTopicArn${serverlessSpy.getConstructName(topic)}`, {
      value: topic.topicArn,
    });
  }
}
