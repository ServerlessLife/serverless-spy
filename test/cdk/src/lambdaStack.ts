import * as path from 'path';
import { Duration, Stack, CfnOutput } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { GenerateSpyEventsFileProps } from './GenerateSpyEventsFileProps';
import { ServerlessSpy } from '../../../src/ServerlessSpy';

export class LambdaStack extends Stack {
  constructor(scope: Construct, id: string, props: GenerateSpyEventsFileProps) {
    super(scope, id, props);

    const func = new NodejsFunction(this, 'MyLambda', {
      memorySize: 512,
      timeout: Duration.seconds(5),
      runtime: lambda.Runtime.NODEJS_20_X, // older version to test
      handler: 'handler',
      entry: path.join(__dirname, '../functions/lambda.ts'),
      environment: {
        NODE_OPTIONS: '--enable-source-maps',
      },
    });
    func.addAlias('live');

    // use uncommon name
    const func2 = new NodejsFunction(this, 'my_lambda-TestName_2', {
      memorySize: 512,
      timeout: Duration.seconds(5),
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'handler',
      entry: path.join(__dirname, '../functions/lambda.ts'),
      environment: {
        NODE_OPTIONS: '--enable-source-maps',
      },
    });

    const func3 = new NodejsFunction(this, 'MyLambdaThatFails', {
      memorySize: 512,
      timeout: Duration.seconds(5),
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'handler',
      entry: path.join(__dirname, '../functions/lambdaFail.ts'),
      environment: {
        NODE_OPTIONS: '--enable-source-maps',
      },
    });

    const serverlessSpy = new ServerlessSpy(this, 'ServerlessSpy', {
      generateSpyEventsFileLocation: props.generateSpyEventsFile
        ? 'serverlessSpyEvents/ServerlessSpyEventsLambda.ts'
        : undefined,
      debugMode: true,
    });

    serverlessSpy.spy();

    new CfnOutput(this, `FunctionName${serverlessSpy.getConstructName(func)}`, {
      value: func.functionName,
    });
    new CfnOutput(
      this,
      `FunctionName${serverlessSpy.getConstructName(func2)}`,
      {
        value: func2.functionName,
      }
    );
    new CfnOutput(
      this,
      `FunctionName${serverlessSpy.getConstructName(func3)}`,
      {
        value: func3.functionName,
      }
    );
  }
}
