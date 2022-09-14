import * as path from 'path';
import { Duration, Stack, CfnOutput } from 'aws-cdk-lib';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { ServerlessSpy } from '../../../src/ServerlessSpy';
import { GenerateSpyEventsFileProps } from './GenerateSpyEventsFileProps';

export class EventBridgeToLambdaStack extends Stack {
  constructor(scope: Construct, id: string, props: GenerateSpyEventsFileProps) {
    super(scope, id, props);

    const bus = new events.EventBus(this, 'MyEventBus');

    const func = new NodejsFunction(this, 'MyLambda', {
      memorySize: 512,
      timeout: Duration.seconds(5),
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'handler',
      entry: path.join(__dirname, '../functions/dummy.ts'),
      environment: {
        NODE_OPTIONS: '--enable-source-maps',
      },
    });

    new events.Rule(this, 'MyRule', {
      eventBus: bus,
      eventPattern: { version: ['0'] },
      targets: [new targets.LambdaFunction(func)],
    });

    const serverlessSpy = new ServerlessSpy(this, 'ServerlessSpy', {
      generateSpyEventsFileLocation: props.generateSpyEventsFile
        ? '.cdkOut/ServerlessSpyEventsEventBridgeToLambda.ts'
        : undefined,
    });

    serverlessSpy.spy();

    new CfnOutput(this, `EventBusName${serverlessSpy.getConstructName(bus)}`, {
      value: bus.eventBusName,
    });
  }
}
