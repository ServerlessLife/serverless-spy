import * as path from 'path';
import { Duration, Stack, CfnOutput } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import {
  NodejsFunction,
  OutputFormat,
  BundlingOptions,
} from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { GenerateSpyEventsFileProps } from './GenerateSpyEventsFileProps';
import { ServerlessSpy } from '../../../src/ServerlessSpy';

export class EsmLambdaStack extends Stack {
  constructor(scope: Construct, id: string, props: GenerateSpyEventsFileProps) {
    super(scope, id, props);
    const bundling: BundlingOptions = {
      format: OutputFormat.ESM,
      target: 'node18.13.0',
      // See https://github.com/evanw/esbuild/issues/1921#issuecomment-1152991694
      banner:
        "import { createRequire } from 'module';const require = createRequire(import.meta.url);",
      esbuildArgs: {
        '--out-extension:.js': '.mjs',
      },
      tsconfig: path.join(__dirname, '../tsconfig.esm.json'),
    };
    const func = new NodejsFunction(this, 'MyLambda', {
      memorySize: 512,
      timeout: Duration.seconds(5),
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'handler',
      entry: path.join(__dirname, '../functions/lambda.ts'),
      environment: {
        NODE_OPTIONS: '--enable-source-maps',
      },
      bundling,
    });

    // use uncommon name
    const func2 = new NodejsFunction(this, 'my_lambda-TestName_2', {
      memorySize: 512,
      timeout: Duration.seconds(5),
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'handler',
      entry: path.join(__dirname, '../functions/lambda.ts'),
      environment: {
        NODE_OPTIONS: '--enable-source-maps',
      },
      bundling,
    });

    const serverlessSpy = new ServerlessSpy(this, 'ServerlessSpy', {
      generateSpyEventsFileLocation: props.generateSpyEventsFile
        ? 'serverlessSpyEvents/ServerlessSpyEventsEsmLambda.ts'
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
  }
}
