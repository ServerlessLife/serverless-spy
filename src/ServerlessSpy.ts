import * as fs from 'fs';
import * as path from 'path';
import * as apiGwV2 from '@aws-cdk/aws-apigatewayv2-alpha';
import * as apiGwV2Int from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import { Duration, Stack } from 'aws-cdk-lib';
import * as agw from 'aws-cdk-lib/aws-apigatewayv2';
import * as dynamoDb from 'aws-cdk-lib/aws-dynamodb';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamoDbStream from 'aws-cdk-lib/aws-lambda-event-sources';
import * as lambdaNode from 'aws-cdk-lib/aws-lambda-nodejs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3notif from 'aws-cdk-lib/aws-s3-notifications';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as snsSubs from 'aws-cdk-lib/aws-sns-subscriptions';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Construct, IConstruct } from 'constructs';

export class ServerlessSpy extends Construct {
  private extensionLayer: lambda.LayerVersion;

  private table: dynamoDb.Table;

  private webSocketApi: apiGwV2.WebSocketApi;

  private ownContructs: IConstruct[] = [];

  private functionSubscriptionPool: FunctionSubscription[] = [];

  private functionSubscriptionMain: FunctionSubscription;

  private webSocketStage: apiGwV2.WebSocketStage;

  wsUrl: string;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const extensionAssetLocation = path.join(
      __dirname,
      '../extension/dist/layer'
    );

    if (!fs.existsSync(extensionAssetLocation)) {
      throw new Error(
        `Folder with assets for extension does not exists ${extensionAssetLocation}`
      );
    }

    const extensionAssetLocationWraper = path.join(
      extensionAssetLocation,
      'spy-wrapper'
    );
    if (!fs.existsSync(extensionAssetLocationWraper)) {
      throw new Error(
        `Wraper script for extension does not exists ${extensionAssetLocation}`
      );
    }

    const extensionAssetLocationCode = path.join(
      extensionAssetLocation,
      'nodejs/node_modules/interceptor.js'
    );
    if (!fs.existsSync(extensionAssetLocationCode)) {
      throw new Error(
        `Code for extension does not exists ${extensionAssetLocationCode}`
      );
    }

    this.extensionLayer = new lambda.LayerVersion(this, 'Extension', {
      compatibleRuntimes: [
        lambda.Runtime.NODEJS_12_X,
        lambda.Runtime.NODEJS_14_X,
        lambda.Runtime.NODEJS_16_X,
      ],
      code: lambda.Code.fromAsset(extensionAssetLocation),
    });
    this.ownContructs.push(this.extensionLayer);

    this.table = new dynamoDb.Table(this, 'WebSocket', {
      partitionKey: {
        name: 'connectionId',
        type: dynamoDb.AttributeType.STRING,
      },
      billingMode: dynamoDb.BillingMode.PAY_PER_REQUEST,
    });
    this.ownContructs.push(this.table);

    const functionOnConnect = new lambdaNode.NodejsFunction(this, 'OnConnect', {
      memorySize: 512,
      timeout: Duration.seconds(5),
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'handler',
      entry: getAssetLocation('functions/onConnect.ts'),
      environment: {
        TABLE_NAME: this.table.tableName,
      },
    });
    this.table.grantWriteData(functionOnConnect);
    this.ownContructs.push(functionOnConnect);

    const functionOnDisconnect = new lambdaNode.NodejsFunction(
      this,
      'OnDisconnect',
      {
        memorySize: 512,
        timeout: Duration.seconds(5),
        runtime: lambda.Runtime.NODEJS_16_X,
        handler: 'handler',
        entry: getAssetLocation('functions/onDisconnect.ts'),
        environment: {
          TABLE_NAME: this.table.tableName,
        },
      }
    );
    this.table.grantWriteData(functionOnDisconnect);
    this.ownContructs.push(functionOnDisconnect);

    this.webSocketApi = new apiGwV2.WebSocketApi(this, 'ApiGwWebSocket');
    this.ownContructs.push(this.webSocketApi);
    this.webSocketStage = new apiGwV2.WebSocketStage(
      this,
      'ApiGwWebSocketStage',
      {
        webSocketApi: this.webSocketApi,
        stageName: 'prod',
        autoDeploy: true,
      }
    );
    this.ownContructs.push(this.webSocketStage);
    const webSocketApiRoute = this.webSocketApi.addRoute('$connect', {
      integration: new apiGwV2Int.WebSocketLambdaIntegration(
        '$connect',
        functionOnConnect
      ),
    });
    (webSocketApiRoute.node.defaultChild as agw.CfnRoute).authorizationType =
      'AWS_IAM';

    this.webSocketApi.addRoute('$disconnect', {
      integration: new apiGwV2Int.WebSocketLambdaIntegration(
        '$disconnect',
        functionOnDisconnect
      ),
    });

    this.functionSubscriptionMain = this.provideFunctionForSubscription();

    this.webSocketApi.addRoute('sendmessage', {
      integration: new apiGwV2Int.WebSocketLambdaIntegration(
        'SendMessage',
        this.functionSubscriptionMain.function
      ),
    });

    this.iterateAllElements(Stack.of(this));

    for (const func of this.functionSubscriptionPool) {
      func.function.addEnvironment(
        'INFRA_MAPPING',
        JSON.stringify(func.mapping)
      );
    }

    // new CfnOutput(this, "API_URL", {
    //   value: `wss://${this.webSocketApi.apiId}.execute-api.${
    //     Stack.of(scope).region
    //   }.amazonaws.com/${this.webSocketStage.stageName}`,
    // });

    this.wsUrl = `wss://${this.webSocketApi.apiId}.execute-api.${
      Stack.of(this).region
    }.amazonaws.com/${this.webSocketStage.stageName}`;

    // new CfnOutput(this, "API_URL", {
    //   value: this.wsUrl,
    // });
  }

  private iterateAllElements(parent: IConstruct) {
    for (const node of parent.node.children) {
      if (this.ownContructs.includes(node)) {
        continue;
      }

      if (this.functionSubscriptionPool.find((s) => s.function === node)) {
        continue;
      }

      console.log('NODE', node.constructor.name);

      if (node instanceof lambda.Function) {
        this.interceptFunction(node);
      } else if (node instanceof sns.Topic) {
        console.log('interceptSnsTopic');
        this.interceptSnsTopic(node);
      } else if (node instanceof sns.Subscription) {
        this.interceptSnsSubscription(node);
      } else if (node instanceof s3.Bucket) {
        this.interceptS3(node);
      } else if (node instanceof dynamoDb.Table) {
        this.interceptDynamodb(node);
      } else if (node instanceof events.EventBus) {
        this.interceptEventBus(node);
      } else if (node instanceof events.Rule) {
        this.interceptEventBusRule(node);
      } else if (node instanceof lambda.CfnEventSourceMapping) {
        this.interceptSqs(node);
      } else {
        // console.log('NO MATCH', node);
      }

      this.iterateAllElements(node);
    }
  }

  private interceptSqs(node: lambda.CfnEventSourceMapping) {
    const queue = this.findElement<sqs.Queue>(
      (n: IConstruct) =>
        n instanceof sqs.Queue &&
        (n as sqs.Queue).queueArn === node.eventSourceArn
    );

    const func = this.findElement<lambda.Function>(
      (n: IConstruct) =>
        n instanceof lambda.Function &&
        (n as lambda.Function).functionName === node.functionName
    );

    if (queue && func) {
      const queueName = this.getConstructName(queue);
      this.functionSubscriptionMain.mapping[
        queue.queueArn
      ] = `Sqs#${queueName}`;
      func.addEnvironment('FLUENT_TEST_SUBSCRIBED_TO_SQS', 'true');
    }
  }

  private createFunctionForSubscription(index: number) {
    const func = new lambdaNode.NodejsFunction(this, `Subscription${index}`, {
      memorySize: 512,
      timeout: Duration.seconds(5),
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'handler',
      entry: getAssetLocation('functions/sendMessage.ts'),
      environment: {
        TABLE_NAME: this.table.tableName,
      },
    });

    this.table.grantWriteData(func);
    this.table.grantReadData(func);
    func.addEnvironment(
      'WS_ENDPOINT',
      `https://${this.webSocketApi.apiId}.execute-api.${
        Stack.of(this).region
      }.amazonaws.com/${this.webSocketStage.stageName}`
    );

    this.webSocketApi.grantManageConnections(func);
    return func;
  }

  private interceptS3(s3Bucket: s3.Bucket) {
    s3Bucket.addEventNotification(
      s3.EventType.OBJECT_CREATED_PUT,
      new s3notif.LambdaDestination(this.functionSubscriptionMain.function)
    );

    const name = this.getConstructName(s3Bucket);
    this.functionSubscriptionMain.mapping[s3Bucket.bucketArn] = `S3#${name}`;
  }

  private interceptDynamodb(table: dynamoDb.Table) {
    // enable DynamoDB streams with a hack
    (table.node.defaultChild as dynamoDb.CfnTable).streamSpecification = {
      streamViewType: dynamoDb.StreamViewType.NEW_AND_OLD_IMAGES,
    };
    (table as any).tableStreamArn = (
      table.node.defaultChild as dynamoDb.CfnTable
    ).attrStreamArn;

    this.functionSubscriptionMain.function.addEventSource(
      new dynamoDbStream.DynamoEventSource(table, {
        startingPosition: lambda.StartingPosition.LATEST,
        batchSize: 1,
        retryAttempts: 0,
      })
    );

    const name = this.getConstructName(table);

    this.functionSubscriptionMain.mapping[table.tableArn] = `DynamoDB#${name}`;
  }

  private interceptEventBusRule(rule: events.Rule) {
    const { eventBusName } = rule.node.defaultChild as events.CfnRule;
    const eventBridge = this.getEventBridge(
      (rule.node.defaultChild as any).eventBusName
    );

    if (!eventBridge) {
      throw new Error(`Can not find EventBridge with name "${eventBusName}"`);
    }

    const functionSubscription = this.provideFunctionForSubscription(
      (s) => !s.usedForEventBridge
    );
    functionSubscription.usedForEventBridge = true;

    rule.addTarget(new targets.LambdaFunction(functionSubscription.function));

    const bridgeName = this.getConstructName(eventBridge);
    const ruleName = this.getConstructName(rule);
    functionSubscription.mapping.eventBridge = `EventBridgeRule#${bridgeName}#${ruleName}`;
  }

  private interceptEventBus(eventBus: events.EventBus) {
    const functionSubscription = this.provideFunctionForSubscription(
      (s) => !s.usedForEventBridge
    );
    functionSubscription.usedForEventBridge = true;

    const bridgeName = this.getConstructName(eventBus);
    const rule = new events.Rule(this, `RuleAll${bridgeName}`, {
      eventBus,
      eventPattern: { version: ['0'] },
      targets: [new targets.LambdaFunction(functionSubscription.function)],
    });

    this.ownContructs.push(rule);
    functionSubscription.mapping.eventBridge = `EventBridge#${bridgeName}`;
  }

  private interceptSnsTopic(topic: sns.Topic) {
    const functionSubscription = this.provideFunctionForSubscription(
      (s) => !s.subsribedTopics.includes(topic)
    );

    topic.addSubscription(
      new snsSubs.LambdaSubscription(functionSubscription.function)
    );
    const topicName = this.getConstructName(topic);
    functionSubscription.mapping[topic.topicArn] = `SnsTopic#${topicName}`;
    functionSubscription.subsribedTopics.push(topic);
  }

  private interceptSnsSubscription(subscription: sns.Subscription) {
    if (!subscription.node.scope) {
      return;
    }

    const topic = this.getTopic(
      (subscription.node.defaultChild as sns.CfnSubscription).topicArn
    );

    if (!topic) {
      throw new Error('Can not find Topic');
    }

    const functionSubscription = this.provideFunctionForSubscription(
      (s) => !s.subsribedTopics.includes(topic)
    );

    const { filterPolicy } = subscription.node
      .defaultChild as sns.CfnSubscription;

    const subscriptionClone = topic.addSubscription(
      new snsSubs.LambdaSubscription(functionSubscription.function)
    );
    (subscriptionClone.node.defaultChild as sns.CfnSubscription).filterPolicy =
      filterPolicy;

    this.ownContructs.push(subscriptionClone);

    const topicName = this.getConstructName(topic);
    const targetName = this.getConstructName(subscription.node.scope);

    functionSubscription.subsribedTopics.push(topic);
    functionSubscription.mapping[
      topic.topicArn
    ] = `SnsSubscription#${topicName}#${targetName}`;
  }

  private provideFunctionForSubscription(
    filterFunction?: (subscription: FunctionSubscription) => boolean
  ) {
    let functionSubscription: FunctionSubscription | undefined;

    if (filterFunction) {
      functionSubscription = this.functionSubscriptionPool.find(filterFunction);
    } else if (this.functionSubscriptionPool.length > 0) {
      functionSubscription = this.functionSubscriptionPool[0];
    }

    if (!functionSubscription) {
      functionSubscription = {
        subsribedTopics: [],
        usedForEventBridge: false,
        mapping: {},
        function: this.createFunctionForSubscription(
          this.functionSubscriptionPool.length
        ),
      };
      this.functionSubscriptionPool.push(functionSubscription);
    }
    return functionSubscription;
  }

  private interceptFunction(func: lambda.Function) {
    func.addLayers(this.extensionLayer);
    this.functionSubscriptionMain.function.grantInvoke(func);

    const functionName = this.getConstructName(func);

    func.addEnvironment('FUNCTION_NAME', functionName);
    func.addEnvironment('AWS_LAMBDA_EXEC_WRAPPER', '/opt/spy-wrapper');
    func.addEnvironment(
      'FLUENT_TEST_SEND_FUNCTION_NAME',
      this.functionSubscriptionMain.function.functionName
    );
  }

  public getConstructName(construct: IConstruct) {
    let functionName = construct.node.path;
    const { stackName } = Stack.of(this);

    if (functionName.startsWith(stackName)) {
      functionName = functionName.substring(stackName.length + 1);
    }
    return functionName;
  }

  private getTopic(topicArn: string): sns.Topic | undefined {
    const topic = this.findElement<sns.Topic>(
      (node: IConstruct) =>
        node instanceof sns.Topic && (node as sns.Topic).topicArn === topicArn
    );

    return topic;
  }

  private getEventBridge(eventBusName: string): events.EventBus | undefined {
    const eventBridge = this.findElement<events.EventBus>(
      (node: IConstruct) =>
        node instanceof events.EventBus &&
        (node as events.EventBus).eventBusName === eventBusName
    );

    return eventBridge;
  }

  private findElement<T extends IConstruct = IConstruct>(
    filterFunc: (node: IConstruct) => boolean,
    parent?: IConstruct
  ): T | undefined {
    if (!parent) {
      parent = Stack.of(this);
    }

    for (const node of parent.node.children) {
      if (filterFunc(node)) {
        return node as T;
      }
      this.findElement<T>(filterFunc, node);
    }

    return undefined;
  }
}

type FunctionSubscription = {
  subsribedTopics: sns.Topic[];
  usedForEventBridge: boolean;
  function: lambdaNode.NodejsFunction;
  mapping: Record<string, string>;
};

function getAssetLocation(location: string) {
  const loc = path.join(__dirname, '../' + location);

  if (fs.existsSync(loc)) {
    return loc;
  }

  const loc2 = path.join(__dirname, '../../' + location);

  if (fs.existsSync(loc2)) {
    return loc2;
  }

  throw new Error(`Location ${loc} and ${loc2} does not exists.`);
}
