import * as path from 'path';
import { Duration, Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sns from 'aws-cdk-lib/aws-sns';
import {
  LambdaSubscription,
  SqsSubscription,
} from 'aws-cdk-lib/aws-sns-subscriptions';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';
import { ServerlessSpy } from 'serverless-spy';

export class E2eStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    const s3Bucket = new s3.Bucket(this, 'logs');

    const queueNo1 = new sqs.Queue(this, 'QueueNo1');

    const queueNo2 = new sqs.Queue(this, 'QueueNo2');

    const topicNo1 = new sns.Topic(this, 'TopicNo1', {});

    // new SstFunction(this, 'SstLambda1', {
    //   handler: 'functions/testSst1.handler',
    //   bundle: {
    //     esbuildConfig: {
    //       plugins: 'esbuild/esbuild.js',
    //     },
    //     // commandHooks: {
    //     //   beforeBundling: (inputDir, outputDir) => {
    //     //     return ["echo beforeBundling > beforeBundling.txt"];
    //     //   },
    //     //   beforeInstall: (inputDir, outputDir) => {
    //     //     return ["echo beforeInstall > beforeInstall.txt"];
    //     //   },
    //     //   afterBundling: (inputDir, outputDir) => {
    //     //     return ["echo afterBundling > afterBundling.txt"];
    //     //   },
    //     // },
    //   },
    // });

    // new SstFunction(this, 'SstLambda2', {
    //   handler: 'functions/testSst2.handler',
    // });

    const bus = new events.EventBus(this, 'bus');

    topicNo1.addSubscription(new SqsSubscription(queueNo1));

    const dynamoDb = new dynamodb.Table(this, 'DDBTable', {
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      // stream: StreamViewType.NEW_AND_OLD_IMAGES,
    });

    const functionTestA = new NodejsFunction(this, 'TestA', {
      memorySize: 512,
      timeout: Duration.seconds(5),
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'handler',
      entry: path.join(__dirname, '../functions/testA.ts'),
      environment: {
        SNS_TOPIC_ARN: topicNo1.topicArn,
        DYNAMODB_TABLE_NAME: dynamoDb.tableName,
      },
    });
    topicNo1.grantPublish(functionTestA);
    dynamoDb.grantWriteData(functionTestA);

    const functionTestB = new NodejsFunction(this, 'TestB', {
      memorySize: 512,
      timeout: Duration.seconds(5),
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'handler',
      entry: path.join(__dirname, '../functions/testB.ts'),
      environment: {
        // SNS: topic
        S3_BUCKET_NAME: s3Bucket.bucketName,
        SQS_URL: queueNo2.queueUrl,
      },
    });
    s3Bucket.grantWrite(functionTestB);
    queueNo2.grantSendMessages(functionTestB);

    topicNo1.addSubscription(
      new LambdaSubscription(functionTestB, {
        filterPolicy: {
          test: sns.SubscriptionFilter.stringFilter({
            allowlist: ['test'],
          }),
        },
      })
    );

    const functionTestC = new NodejsFunction(this, 'TestC', {
      memorySize: 512,
      timeout: Duration.seconds(5),
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'handler',
      entry: path.join(__dirname, '../functions/testC.ts'),
      environment: {
        EB_NAME: bus.eventBusName,
      },
    });
    functionTestC.addEventSource(new SqsEventSource(queueNo2));
    bus.grantPutEventsTo(functionTestC);

    const functionTestD = new NodejsFunction(this, 'TestD', {
      memorySize: 512,
      timeout: Duration.seconds(5),
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'handler',
      entry: path.join(__dirname, '../functions/testD.ts'),
    });
    functionTestD.addEventSource(new SqsEventSource(queueNo1));

    const functionTestE = new NodejsFunction(this, 'TestE', {
      memorySize: 512,
      timeout: Duration.seconds(5),
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'handler',
      entry: path.join(__dirname, '../functions/testE.ts'),
    });

    new events.Rule(this, 'busRule', {
      eventBus: bus,
      eventPattern: { version: ['0'] },
      targets: [new targets.LambdaFunction(functionTestE)],
    });

    // console.log("queueNo2", queueNo2);
    // console.log("functonTestC", functonTestC);

    // const logicalId = stack.getLogicalId(functonTest.node.defaultChild as any);
    // console.log("FUNCTION NAME: " + logicalId);

    // --------------------- WEBSOCKET --------------------
    const serverlessSpy = new ServerlessSpy(this, 'ServerlessSpy');

    new CfnOutput(this, 'ServerlessSpyWsUrl', {
      value: serverlessSpy.wsUrl,
    });

    new CfnOutput(
      this,
      `FunctionName${serverlessSpy.getConstructName(functionTestA)}`,
      {
        value: functionTestA.functionName,
      }
    );
    // define resources here...
  }
}
