import * as path from 'path';
import { Duration, Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as sns from 'aws-cdk-lib/aws-sns';
import { Construct } from 'constructs';
import { ServerlessSpy } from 'serverless-spy';

export class LambdaToSNSStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    const topic = new sns.Topic(this, 'MyTopic', {});

    const functionLambdaToSNS = new NodejsFunction(this, 'LambdaToSNS', {
      memorySize: 512,
      timeout: Duration.seconds(5),
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'handler',
      entry: path.join(__dirname, '../functions/toSNS.ts'),
      environment: {
        SNS_TOPIC_ARN: topic.topicArn,
      },
    });
    topic.grantPublish(functionLambdaToSNS);

    const serverlessSpy = new ServerlessSpy(this, 'ServerlessSpy', {
      generateSpyEventsFileLocation:
        '.cdkOut/ServerlessSpyEventsLambdaToSNS.ts',
    });

    new CfnOutput(this, 'ServerlessSpyWsUrl', {
      value: serverlessSpy.wsUrl,
    });

    new CfnOutput(
      this,
      `FunctionName${serverlessSpy.getConstructName(functionLambdaToSNS)}`,
      {
        value: functionLambdaToSNS.functionName,
      }
    );
  }
}
