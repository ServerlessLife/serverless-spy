import * as path from 'path';
import { Duration, Stack, CfnOutput } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { ServerlessSpy } from '../../../src/ServerlessSpy';
import { GenerateSpyEventsFileProps } from './GenerateSpyEventsFileProps';

export class LambdaStack extends Stack {
  constructor(scope: Construct, id: string, props: GenerateSpyEventsFileProps) {
    super(scope, id, props);

    const func = new NodejsFunction(this, 'MyLambda', {
      memorySize: 512,
      timeout: Duration.seconds(5),
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'handler',
      entry: path.join(__dirname, '../functions/lambda.ts'),
    });
    const serverlessSpy = new ServerlessSpy(this, 'ServerlessSpy', {
      generateSpyEventsFileLocation: props.generateSpyEventsFile
        ? '.cdkOut/ServerlessSpyEventsLambda.ts'
        : undefined,
    });

    new CfnOutput(this, `FunctionName${serverlessSpy.getConstructName(func)}`, {
      value: func.functionName,
    });
  }
}
