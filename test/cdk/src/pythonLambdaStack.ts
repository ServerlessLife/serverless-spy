import * as path from 'path';
import { Duration, Stack, CfnOutput } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { ServerlessSpy } from '../../../src/ServerlessSpy';
import { GenerateSpyEventsFileProps } from './GenerateSpyEventsFileProps';

export class PythonLambdaStack extends Stack {
  constructor(scope: Construct, id: string, props: GenerateSpyEventsFileProps) {
    super(scope, id, props);

    const func = new lambda.Function(this, 'MyLambda', {
      memorySize: 512,
      timeout: Duration.seconds(5),
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'lambda.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../functions/python/')),
      environment: {},
    });

    const func3 = new lambda.Function(this, 'MyLambdaThatFails', {
      memorySize: 512,
      timeout: Duration.seconds(5),
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'lambdaFail.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../functions/python/')),
      environment: {},
    });

    const serverlessSpy = new ServerlessSpy(this, 'ServerlessSpy', {
      generateSpyEventsFileLocation: props.generateSpyEventsFile
        ? 'serverlessSpyEvents/ServerlessSpyEventsPythonLambda.ts'
        : undefined,
      debugMode: true,
    });

    serverlessSpy.spy();

    new CfnOutput(this, `FunctionName${serverlessSpy.getConstructName(func)}`, {
      value: func.functionName,
    });
    new CfnOutput(
      this,
      `FunctionName${serverlessSpy.getConstructName(func3)}`,
      {
        value: func3.functionName,
      }
    );
  }
}
