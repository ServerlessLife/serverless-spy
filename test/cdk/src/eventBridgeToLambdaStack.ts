import * as path from 'path';
import { Duration, Stack, CfnOutput } from 'aws-cdk-lib';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { GenerateSpyEventsFileProps } from './GenerateSpyEventsFileProps';
import { ServerlessSpy } from '../../../src/ServerlessSpy';

export class EventBridgeToLambdaStack extends Stack {
  constructor(scope: Construct, id: string, props: GenerateSpyEventsFileProps) {
    super(scope, id, props);

    const bus = new events.EventBus(this, 'MyEventBus');

    const func = new NodejsFunction(this, 'MyLambda', {
      memorySize: 512,
      timeout: Duration.seconds(5),
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'handler',
      entry: path.join(__dirname, '../functions/dummy.ts'),
      environment: {
        NODE_OPTIONS: '--enable-source-maps',
      },
    });

    const pythonFunc = new lambda.Function(this, 'MyPythonLambda', {
      memorySize: 512,
      timeout: Duration.seconds(5),
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'dummy.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../functions/python/')),
      environment: {},
    });

    new events.Rule(this, 'MyRule', {
      eventBus: bus,
      eventPattern: { version: ['0'] },
      targets: [
        new targets.LambdaFunction(func),
        new targets.LambdaFunction(pythonFunc),
      ],
    });

    const serverlessSpy = new ServerlessSpy(this, 'ServerlessSpy', {
      generateSpyEventsFileLocation: props.generateSpyEventsFile
        ? 'serverlessSpyEvents/ServerlessSpyEventsEventBridgeToLambda.ts'
        : undefined,
      debugMode: true,
    });

    serverlessSpy.spy();

    new CfnOutput(this, `EventBusName${serverlessSpy.getConstructName(bus)}`, {
      value: bus.eventBusName,
    });
  }
}
