import { Stack, CfnOutput } from 'aws-cdk-lib';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';
import { ServerlessSpy } from '../../../src/ServerlessSpy';
import { GenerateSpyEventsFileProps } from './GenerateSpyEventsFileProps';

export class SqsStack extends Stack {
  constructor(scope: Construct, id: string, props: GenerateSpyEventsFileProps) {
    super(scope, id, props);

    const queue = new sqs.Queue(this, 'MyQueue');

    const serverlessSpy = new ServerlessSpy(this, 'ServerlessSpy', {
      generateSpyEventsFileLocation: props.generateSpyEventsFile
        ? 'serverlessSpyEvents/ServerlessSpyEventsSqs.ts'
        : undefined,
      debugMode: true,
      spySqsWithNoSubscriptionAndDropAllMessages: true,
    });

    serverlessSpy.spy();

    new CfnOutput(this, `QueueUrl${serverlessSpy.getConstructName(queue)}`, {
      value: queue.queueUrl,
    });
  }
}
