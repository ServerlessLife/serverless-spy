import * as path from 'path';
import { Duration, Stack, CfnOutput } from 'aws-cdk-lib';
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
import { ServerlessSpy } from '../../../src/ServerlessSpy';
import { GenerateSpyEventsFileProps } from './GenerateSpyEventsFileProps';

export class E2eStack extends Stack {
  constructor(scope: Construct, id: string, props: GenerateSpyEventsFileProps) {
    super(scope, id, props);

    const s3Bucket = new s3.Bucket(this, 'MyBucket');

    const queueNo1 = new sqs.Queue(this, 'MyQueueNo1');

    const queueNo2 = new sqs.Queue(this, 'MyQueueNo2');

    const topicNo1 = new sns.Topic(this, 'MyTopicNo1', {});

    // TODO - integrate SST
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

    const bus = new events.EventBus(this, 'MyEventBus');

    topicNo1.addSubscription(new SqsSubscription(queueNo1));

    const dynamoDb = new dynamodb.Table(this, 'MyTable', {
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    const functionToSnsAndDynamoDb = new NodejsFunction(
      this,
      'ToSnsAndDynamoDb',
      {
        memorySize: 512,
        timeout: Duration.seconds(5),
        runtime: lambda.Runtime.NODEJS_16_X,
        handler: 'handler',
        entry: path.join(__dirname, '../functions/toSnsAndDynamoDb.ts'),
        environment: {
          SNS_TOPIC_ARN: topicNo1.topicArn,
          DYNAMODB_TABLE_NAME: dynamoDb.tableName,
          NODE_OPTIONS: '--enable-source-maps',
        },
      }
    );
    topicNo1.grantPublish(functionToSnsAndDynamoDb);
    dynamoDb.grantWriteData(functionToSnsAndDynamoDb);

    const functionFromSnsToSqsAndS3 = new NodejsFunction(
      this,
      'FromSnsToSqsAndS3',
      {
        memorySize: 512,
        timeout: Duration.seconds(5),
        runtime: lambda.Runtime.NODEJS_16_X,
        handler: 'handler',
        entry: path.join(__dirname, '../functions/fromSnsToSqsAndS3.ts'),
        environment: {
          S3_BUCKET_NAME: s3Bucket.bucketName,
          SQS_URL: queueNo2.queueUrl,
          NODE_OPTIONS: '--enable-source-maps',
        },
      }
    );
    s3Bucket.grantWrite(functionFromSnsToSqsAndS3);
    queueNo2.grantSendMessages(functionFromSnsToSqsAndS3);

    topicNo1.addSubscription(
      new LambdaSubscription(functionFromSnsToSqsAndS3, {
        filterPolicy: {
          test: sns.SubscriptionFilter.stringFilter({
            allowlist: ['test'],
          }),
        },
      })
    );

    const functionFromSqsToEventBridge = new NodejsFunction(
      this,
      'FromSqsToEventBridge',
      {
        memorySize: 512,
        timeout: Duration.seconds(5),
        runtime: lambda.Runtime.NODEJS_16_X,
        handler: 'handler',
        entry: path.join(__dirname, '../functions/fromSqsToEventBridge.ts'),
        environment: {
          EB_NAME: bus.eventBusName,
          NODE_OPTIONS: '--enable-source-maps',
        },
      }
    );
    functionFromSqsToEventBridge.addEventSource(new SqsEventSource(queueNo2));
    bus.grantPutEventsTo(functionFromSqsToEventBridge);

    const functionReceiveSqs = new NodejsFunction(this, 'ReceiveSqs', {
      memorySize: 512,
      timeout: Duration.seconds(5),
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'handler',
      entry: path.join(__dirname, '../functions/dummy.ts'),
      environment: {
        NODE_OPTIONS: '--enable-source-maps',
      },
    });
    functionReceiveSqs.addEventSource(new SqsEventSource(queueNo1));

    const functionReceiveEventBridge = new NodejsFunction(
      this,
      'ReceiveEventBridge',
      {
        memorySize: 512,
        timeout: Duration.seconds(5),
        runtime: lambda.Runtime.NODEJS_16_X,
        handler: 'handler',
        entry: path.join(__dirname, '../functions/dummy.ts'),
        environment: {
          NODE_OPTIONS: '--enable-source-maps',
        },
      }
    );

    new events.Rule(this, 'MyEventBridge', {
      eventBus: bus,
      eventPattern: { version: ['0'] },
      targets: [new targets.LambdaFunction(functionReceiveEventBridge)],
    });

    const serverlessSpy = new ServerlessSpy(this, 'ServerlessSpy', {
      generateSpyEventsFileLocation: props.generateSpyEventsFile
        ? '.cdkOut/ServerlessSpyEventsE2e.ts'
        : undefined,
    });

    new CfnOutput(
      this,
      `FunctionName${serverlessSpy.getConstructName(functionToSnsAndDynamoDb)}`,
      {
        value: functionToSnsAndDynamoDb.functionName,
      }
    );
  }
}
