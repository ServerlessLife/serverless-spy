import * as path from 'path';
import { Duration, Stack, CfnOutput } from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { GenerateSpyEventsFileProps } from './GenerateSpyEventsFileProps';
import { ServerlessSpy } from '../../../src/ServerlessSpy';

export class LambdaToDynamoDb2Stack extends Stack {
  constructor(scope: Construct, id: string, props: GenerateSpyEventsFileProps) {
    super(scope, id, props);

    const dynamoDb = new dynamodb.TableV2(this, 'MyTable', {
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
      billing: dynamodb.Billing.onDemand(),
    });

    const func = new NodejsFunction(this, 'MyLambda', {
      memorySize: 512,
      timeout: Duration.seconds(5),
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'handler',
      entry: path.join(__dirname, '../functions/toDynamoDb.ts'),
      environment: {
        DYNAMODB_TABLE_NAME: dynamoDb.tableName,
        NODE_OPTIONS: '--enable-source-maps',
      },
    });
    dynamoDb.grantWriteData(func);

    const serverlessSpy = new ServerlessSpy(this, 'ServerlessSpy', {
      generateSpyEventsFileLocation: props.generateSpyEventsFile
        ? 'serverlessSpyEvents/ServerlessSpyEventsLambdaToDynamoDbStack.ts'
        : undefined,
      debugMode: true,
    });

    serverlessSpy.spy();

    new CfnOutput(this, `FunctionName${serverlessSpy.getConstructName(func)}`, {
      value: func.functionName,
    });
  }
}
