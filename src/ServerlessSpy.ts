import * as fs from 'fs';
import * as path from 'path';
import * as apiGwV2 from '@aws-cdk/aws-apigatewayv2-alpha';
import * as apiGwV2Int from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import { CfnOutput, Duration, Stack } from 'aws-cdk-lib';
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
import { envVariableNames } from './common/envVariableNames';

export interface ServerlessSpyProps {
  readonly generateSpyEventsFileLocation?: string;
}

export class ServerlessSpy extends Construct {
  private extensionLayer: lambda.LayerVersion;
  private table: dynamoDb.Table;
  private webSocketApi: apiGwV2.WebSocketApi;
  private createdContructs: IConstruct[] = [];
  private functionSubscriptionPool: FunctionSubscription[] = [];
  private functionSubscriptionMain: FunctionSubscription;
  private functionsSpied: FunctionSpied[] = [];
  private webSocketStage: apiGwV2.WebSocketStage;
  public serviceKeys: string[] = [];
  private spiedNodes: IConstruct[] = [];
  wsUrl: string;

  constructor(
    scope: Construct,
    id: string,
    private props?: ServerlessSpyProps
  ) {
    super(scope, id);

    this.extensionLayer = new lambda.LayerVersion(this, 'Extension', {
      compatibleRuntimes: [
        lambda.Runtime.NODEJS_12_X,
        lambda.Runtime.NODEJS_14_X,
        lambda.Runtime.NODEJS_16_X,
      ],
      code: lambda.Code.fromAsset(this.getExtensionAssetLocation()),
    });
    this.createdContructs.push(this.extensionLayer);

    this.table = new dynamoDb.Table(this, 'WebSocket', {
      partitionKey: {
        name: 'connectionId',
        type: dynamoDb.AttributeType.STRING,
      },
      billingMode: dynamoDb.BillingMode.PAY_PER_REQUEST,
    });
    this.createdContructs.push(this.table);

    const functionOnConnect = new lambdaNode.NodejsFunction(this, 'OnConnect', {
      memorySize: 512,
      timeout: Duration.seconds(5),
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'handler',
      entry: this.getAssetLocation('functions/onConnect.ts'),
      environment: {
        [envVariableNames.SSPY_WS_TABLE_NAME]: this.table.tableName,
        NODE_OPTIONS: '--enable-source-maps',
      },
    });
    this.table.grantWriteData(functionOnConnect);
    this.createdContructs.push(functionOnConnect);

    const functionOnDisconnect = new lambdaNode.NodejsFunction(
      this,
      'OnDisconnect',
      {
        memorySize: 512,
        timeout: Duration.seconds(5),
        runtime: lambda.Runtime.NODEJS_16_X,
        handler: 'handler',
        entry: this.getAssetLocation('functions/onDisconnect.ts'),
        environment: {
          [envVariableNames.SSPY_WS_TABLE_NAME]: this.table.tableName,
          NODE_OPTIONS: '--enable-source-maps',
        },
      }
    );
    this.table.grantWriteData(functionOnDisconnect);
    this.createdContructs.push(functionOnDisconnect);

    this.webSocketApi = new apiGwV2.WebSocketApi(this, 'ApiGwWebSocket');
    this.createdContructs.push(this.webSocketApi);
    this.webSocketStage = new apiGwV2.WebSocketStage(
      this,
      'ApiGwWebSocketStage',
      {
        webSocketApi: this.webSocketApi,
        stageName: 'prod',
        autoDeploy: true,
      }
    );
    this.createdContructs.push(this.webSocketStage);
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

    this.wsUrl = `wss://${this.webSocketApi.apiId}.execute-api.${
      Stack.of(this).region
    }.amazonaws.com/${this.webSocketStage.stageName}`;

    new CfnOutput(Stack.of(this), 'ServerlessSpyWsUrl', {
      value: this.wsUrl,
    });
  }

  public spyNodes(nodes: IConstruct[]) {
    for (const node of nodes) {
      let ns = this.iterateAllNodes(node);
      this.internalSpyNodes(ns);
    }

    this.finializeSpy();
  }

  public spy(filter?: {
    spyLambda?: boolean;
    spySqs?: boolean;
    spySnsTopic?: boolean;
    spySnsSubsription?: boolean;
    spyEventBridge?: boolean;
    spyS3?: boolean;
    spyDynamoDB?: boolean;
  }) {
    let nodes = this.iterateAllNodes(Stack.of(this));

    const filt = {
      spyLambda: true,
      spySqs: true,
      spySnsTopic: true,
      spySnsSubsription: true,
      spyEventBridge: true,
      spyEventBridgeRule: true,
      spyS3: true,
      spyDynamoDB: true,
      ...filter,
    };

    nodes = nodes.filter((node) => {
      if (filt.spyLambda && node instanceof lambda.Function) {
        return true;
      } else if (filt.spySnsTopic && node instanceof sns.Topic) {
        return true;
      } else if (filt.spySnsSubsription && node instanceof sns.Subscription) {
        return true;
      } else if (filt.spyS3 && node instanceof s3.Bucket) {
        return true;
      } else if (filt.spyDynamoDB && node instanceof dynamoDb.Table) {
        return true;
      } else if (filt.spyEventBridge && node instanceof events.EventBus) {
        return true;
      } else if (filt.spyEventBridgeRule && node instanceof events.Rule) {
        return true;
      } else if (filt.spySqs && node instanceof lambda.CfnEventSourceMapping) {
        return true;
      }

      return false;
    });

    this.internalSpyNodes(nodes);
    this.finializeSpy();

    console.log('--------------------------------------');
  }

  private internalSpyNodes(nodes: IConstruct[]) {
    for (const node of nodes) {
      this.internalSpyNode(node);
    }
  }

  private finializeSpy() {
    //set mapping property for all functions we created
    for (const func of this.functionSubscriptionPool) {
      func.function.addEnvironment(
        envVariableNames.SSPY_INFRA_MAPPING,
        JSON.stringify(func.mapping)
      );
    }

    //set mapping property for all functions we spy on
    for (const func of this.functionsSpied) {
      func.function.addEnvironment(
        envVariableNames.SSPY_INFRA_MAPPING,
        JSON.stringify(func.mapping)
      );
    }
    for (const func of this.functionsSpied) {
      func.function.addEnvironment(
        envVariableNames.SSPY_INFRA_MAPPING,
        JSON.stringify(func.mapping)
      );
    }

    if (this.props?.generateSpyEventsFileLocation) {
      this.writeSpyEventsClass(this.props?.generateSpyEventsFileLocation);
    }
  }

  private getExtensionAssetLocation() {
    let extensionAssetLocation = path.join(
      __dirname,
      '../extension/dist/layer'
    );

    const extensionAssetLocationAlt = path.join(
      __dirname,
      '../lib/extension/dist/layer'
    );

    if (!fs.existsSync(extensionAssetLocation)) {
      if (!fs.existsSync(extensionAssetLocationAlt)) {
        throw new Error(
          `Folder with assets for extension does not exists at ${extensionAssetLocation} or at ${extensionAssetLocationAlt} `
        );
      } else {
        extensionAssetLocation = extensionAssetLocationAlt;
      }
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
    return extensionAssetLocation;
  }

  /**
   * Write SpyEvents class, which helps with writing the code for tests.
   * @param fileLocation
   */
  private writeSpyEventsClass(fileLocation: string) {
    fs.mkdirSync(path.dirname(fileLocation), { recursive: true });

    const properties = this.serviceKeys
      .map((sk) => `  ${sk.replace(/#/g, '')}: '${sk}' = '${sk}';\n`)
      .join('');

    const code = `/* eslint-disable */\nexport class ServerlessSpyEvents {\n${properties}}\n`;

    fs.writeFileSync(fileLocation, code);
  }

  private iterateAllNodes(parent: IConstruct) {
    const nodes: IConstruct[] = [];
    nodes.push(parent);
    this.iterateAllNodesRecursive(parent, nodes);
    return nodes;
  }

  private iterateAllNodesRecursive(parent: IConstruct, nodes: IConstruct[]) {
    for (const node of parent.node.children) {
      nodes.push(node);
      this.iterateAllNodesRecursive(node, nodes);
    }
  }

  private internalSpyNode(node: IConstruct) {
    if (this.spiedNodes.includes(node)) {
      return;
    }

    this.spiedNodes.push(node);

    if (this.createdContructs.includes(node)) {
      return;
    }

    if (this.functionSubscriptionPool.find((s) => s.function === node)) {
      return;
    }

    console.log('SPY', node);

    if (node instanceof lambda.Function) {
      this.internalSpyFunction(node);
    } else if (node instanceof sns.Topic) {
      this.internalSpySnsTopic(node);
    } else if (node instanceof sns.Subscription) {
      this.internalSpySnsSubscription(node);
    } else if (node instanceof s3.Bucket) {
      this.internalSpyS3(node);
    } else if (node instanceof dynamoDb.Table) {
      this.internalSpyDynamodb(node);
    } else if (node instanceof events.EventBus) {
      this.internalSpyEventBus(node);
    } else if (node instanceof events.Rule) {
      this.internalSpyEventBusRule(node);
    } else if (node instanceof lambda.CfnEventSourceMapping) {
      this.internalSpySqs(node);
    }
  }

  private internalSpySqs(node: lambda.CfnEventSourceMapping) {
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

      const serviceKey = `Sqs#${queueName}`;

      //this.functionSubscriptionMain.mapping[queue.queueArn] = serviceKey;
      func.addEnvironment(
        envVariableNames.SSPY_INFRA_MAPPING,
        JSON.stringify({})
      );
      this.addMappingToFunction(func, {
        key: queue.queueArn,
        value: serviceKey,
      });

      this.serviceKeys.push(serviceKey);
      func.addEnvironment(envVariableNames.SSPY_SUBSCRIBED_TO_SQS, 'true');
    }
  }

  private createFunctionForSubscription(index: number) {
    const func = new lambdaNode.NodejsFunction(this, `Subscription${index}`, {
      memorySize: 512,
      timeout: Duration.seconds(5),
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'handler',
      entry: this.getAssetLocation('functions/sendMessage.ts'),
      environment: {
        [envVariableNames.SSPY_WS_TABLE_NAME]: this.table.tableName,
        NODE_OPTIONS: '--enable-source-maps',
      },
    });

    this.table.grantWriteData(func);
    this.table.grantReadData(func);
    func.addEnvironment(
      envVariableNames.SSPY_WS_ENDPOINT,
      this.getWsEndpoint()
    );

    this.webSocketApi.grantManageConnections(func);
    return func;
  }

  private getWsEndpoint(): string {
    return `https://${this.webSocketApi.apiId}.execute-api.${
      Stack.of(this).region
    }.amazonaws.com/${this.webSocketStage.stageName}`;
  }

  private internalSpyS3(s3Bucket: s3.Bucket) {
    s3Bucket.addEventNotification(
      s3.EventType.OBJECT_CREATED_PUT,
      new s3notif.LambdaDestination(this.functionSubscriptionMain.function)
    );

    const name = this.getConstructName(s3Bucket);

    const serviceKey = `S3#${name}`;
    this.functionSubscriptionMain.mapping[s3Bucket.bucketArn] = serviceKey;
    this.serviceKeys.push(serviceKey);
  }

  private internalSpyDynamodb(table: dynamoDb.Table) {
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

    const serviceKey = `DynamoDB#${name}`;
    this.functionSubscriptionMain.mapping[table.tableArn] = serviceKey;
    this.serviceKeys.push(serviceKey);
  }

  private internalSpyEventBusRule(rule: events.Rule) {
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
    const serviceKey = `EventBridgeRule#${bridgeName}#${ruleName}`;
    functionSubscription.mapping.eventBridge = serviceKey;
    this.serviceKeys.push(serviceKey);
  }

  private internalSpyEventBus(eventBus: events.EventBus) {
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

    this.createdContructs.push(rule);
    const serviceKey = `EventBridge#${bridgeName}`;
    functionSubscription.mapping.eventBridge = serviceKey;
    this.serviceKeys.push(serviceKey);
  }

  private internalSpySnsTopic(topic: sns.Topic) {
    const functionSubscription = this.provideFunctionForSubscription(
      (s) => !s.subsribedTopics.includes(topic)
    );

    const subscription = topic.addSubscription(
      new snsSubs.LambdaSubscription(functionSubscription.function)
    );
    this.createdContructs.push(subscription);
    const topicName = this.getConstructName(topic);
    const serviceKey = `SnsTopic#${topicName}`;
    functionSubscription.mapping[topic.topicArn] = serviceKey;
    this.serviceKeys.push(serviceKey);
    functionSubscription.subsribedTopics.push(topic);
  }

  private internalSpySnsSubscription(subscription: sns.Subscription) {
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

    this.createdContructs.push(subscriptionClone);

    const topicName = this.getConstructName(topic);
    const targetName = this.getConstructName(subscription.node.scope);

    functionSubscription.subsribedTopics.push(topic);
    const serviceKey = `SnsSubscription#${topicName}#${targetName}`;
    functionSubscription.mapping[topic.topicArn] = serviceKey;
    this.serviceKeys.push(serviceKey);
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

  private internalSpyFunction(func: lambda.Function) {
    func.addLayers(this.extensionLayer);

    const functionName = this.getConstructName(func);

    func.addEnvironment(envVariableNames.SSPY_FUNCTION_NAME, functionName);
    func.addEnvironment('AWS_LAMBDA_EXEC_WRAPPER', '/opt/spy-wrapper');
    func.addEnvironment(
      envVariableNames.SSPY_WS_TABLE_NAME,
      this.table.tableName
    );
    func.addEnvironment(
      envVariableNames.SSPY_WS_ENDPOINT,
      this.getWsEndpoint()
    );

    this.table.grantWriteData(func);
    this.table.grantReadData(func);
    this.webSocketApi.grantManageConnections(func);

    this.serviceKeys.push(`Function#${functionName}#Request`);
    this.serviceKeys.push(`Function#${functionName}#Error`);
    this.serviceKeys.push(`Function#${functionName}#Console`);
    this.serviceKeys.push(`Function#${functionName}#Response`);

    this.addMappingToFunction(func);
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

  private addMappingToFunction(
    func: lambda.Function,
    keyValue?: { key: string; value: string }
  ) {
    for (const fs of this.functionsSpied) {
      if (fs.function === func) {
        if (keyValue) {
          fs.mapping[keyValue.key] = keyValue.value;
        }
        return;
      }
    }

    const fs: FunctionSpied = {
      function: func,
      mapping: {},
    };

    if (keyValue) {
      fs.mapping[keyValue.key] = keyValue.value;
    }

    this.functionsSpied.push(fs);
  }

  private getAssetLocation(location: string) {
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
}

type FunctionSubscription = {
  subsribedTopics: sns.Topic[];
  usedForEventBridge: boolean;
  function: lambdaNode.NodejsFunction;
  mapping: Record<string, string>;
};

type FunctionSpied = {
  function: lambda.Function;
  mapping: Record<string, string>;
};
