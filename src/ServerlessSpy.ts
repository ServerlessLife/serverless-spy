import * as fs from 'fs';
import * as path from 'path';
import { PythonLayerVersion } from '@aws-cdk/aws-lambda-python-alpha';
import {
  aws_iam,
  BundlingFileAccess,
  CfnOutput,
  custom_resources,
  Duration,
  NestedStack,
  Stack,
} from 'aws-cdk-lib';
import * as dynamoDb from 'aws-cdk-lib/aws-dynamodb';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import { Effect } from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import {
  Architecture,
  ILayerVersion,
  SingletonFunction,
} from 'aws-cdk-lib/aws-lambda';
import * as dynamoDbStream from 'aws-cdk-lib/aws-lambda-event-sources';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import * as lambdaNode from 'aws-cdk-lib/aws-lambda-nodejs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3notif from 'aws-cdk-lib/aws-s3-notifications';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as snsSubs from 'aws-cdk-lib/aws-sns-subscriptions';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Construct, IConstruct } from 'constructs';
import { envVariableNames } from './common/envVariableNames';

export interface ServerlessSpyProps {
  readonly generateSpyEventsFileLocation?: string;
  readonly spySqsWithNoSubscriptionAndDropAllMessages?: boolean;
  readonly debugMode?: boolean;
}

export interface SpyFilter {
  readonly spyLambda?: boolean;
  readonly spySqs?: boolean;
  readonly spySnsTopic?: boolean;
  readonly spySnsSubsription?: boolean;
  readonly spyEventBridge?: boolean;
  readonly spyEventBridgeRule?: boolean;
  readonly spyS3?: boolean;
  readonly spyDynamoDB?: boolean;
}

const isLambdaFunction = (node: IConstruct): node is lambda.Function =>
  'functionName' in node && 'functionArn' in node && 'runtime' in node;

const serverlessSpyIotEndpointCrNamePrefix = 'ServerlessSpyIotEndpoint';

export class ServerlessSpy extends Construct {
  private createdResourcesBySSpy: IConstruct[] = [];
  private lambdaSubscriptionPool: LambdaSubscription[] = [];
  private lambdaSubscriptionMain: LambdaSubscription;
  private lambdasSpied: LambdaSpied[] = [];
  public serviceKeys: string[] = [];
  private spiedNodes: IConstruct[] = [];
  private layerMap: Partial<Record<string, ILayerVersion>> = {};
  private readonly iotEndpoint: string;

  constructor(
    scope: Construct,
    id: string,
    private props?: ServerlessSpyProps
  ) {
    super(scope, id);

    const rootStack = this.cleanName(
      this.findRootStack(Stack.of(this)).node.id
    );

    const getIoTEndpoint = new custom_resources.AwsCustomResource(
      this,
      serverlessSpyIotEndpointCrNamePrefix,
      {
        onCreate: {
          service: 'Iot',
          action: 'describeEndpoint',
          physicalResourceId:
            custom_resources.PhysicalResourceId.fromResponse('endpointAddress'),
          parameters: {
            endpointType: 'iot:Data-ATS',
          },
        },
        onUpdate: {
          service: 'Iot',
          action: 'describeEndpoint',
          physicalResourceId:
            custom_resources.PhysicalResourceId.fromResponse('endpointAddress'),
          parameters: {
            endpointType: 'iot:Data-ATS',
          },
        },
        installLatestAwsSdk: false,
        policy: custom_resources.AwsCustomResourcePolicy.fromSdkCalls({
          resources: custom_resources.AwsCustomResourcePolicy.ANY_RESOURCE,
        }),
        functionName: serverlessSpyIotEndpointCrNamePrefix + rootStack,
      }
    );
    this.iotEndpoint = getIoTEndpoint.getResponseField('endpointAddress');

    this.createdResourcesBySSpy.push(getIoTEndpoint);

    new CfnOutput(this, 'ServerlessSpyIoTEndpoint', {
      key: 'ServerlessSpyWsUrl',
      value: `${this.iotEndpoint}/${rootStack}`,
    });

    this.lambdaSubscriptionMain = this.provideFunctionForSubscription();
  }

  private getDefaultLambdaEnvironmentVariables(): { [key: string]: string } {
    return {
      NODE_OPTIONS: '--enable-source-maps',
    };
  }

  /**
   * Initalize spying on resources given as parameter.
   * @param nodes Which reources and their children to spy on.
   */
  public spyNodes(nodes: IConstruct[]) {
    for (const node of nodes) {
      let ns = this.getAllNodes(node);
      this.internalSpyNodes(ns);
    }

    this.finalizeSpy();
  }

  /**
   * Initalize spying on resources.
   * @param filter Limit which resources to spy on.
   */
  public spy(filter?: SpyFilter) {
    let nodes = this.getAllNodes(Stack.of(this));

    const filterWithDefaults: Required<SpyFilter> = {
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

    const CRID =
      'AWS' +
      custom_resources.AwsCustomResource.PROVIDER_FUNCTION_UUID.replace(
        /-/gi,
        ''
      ).substring(0, 16);

    nodes = nodes.filter((node) => {
      if (
        // Ignore the custom resource and the Provider (as well as any other Providers using the same provider function), otherwise we cause
        // circular dependencies
        node.node.id.startsWith(CRID) ||
        node.node.id === 'Provider' ||
        // Ignore singleton functions as they can cause very odd behavior and crashes
        node instanceof SingletonFunction
      ) {
        if (this.props?.debugMode) {
          console.info(`Skipping ${node.node.id}`);
        }
        return false;
      } else if (
        filterWithDefaults.spyLambda &&
        (node instanceof lambda.Function ||
          node instanceof NodejsFunction ||
          isLambdaFunction(node))
      ) {
        return true;
      } else if (filterWithDefaults.spySnsTopic && node instanceof sns.Topic) {
        return true;
      } else if (
        filterWithDefaults.spySnsSubsription &&
        node instanceof sns.Subscription
      ) {
        return true;
      } else if (filterWithDefaults.spyS3 && node instanceof s3.Bucket) {
        return true;
      } else if (
        filterWithDefaults.spyDynamoDB &&
        node instanceof dynamoDb.Table
      ) {
        return true;
      } else if (
        filterWithDefaults.spyDynamoDB &&
        node instanceof dynamoDb.TableV2
      ) {
        return true;
      } else if (
        filterWithDefaults.spyEventBridge &&
        node instanceof events.EventBus
      ) {
        return true;
      } else if (
        filterWithDefaults.spyEventBridgeRule &&
        node instanceof events.Rule
      ) {
        return true;
      } else if (
        filterWithDefaults.spySqs &&
        node instanceof lambda.CfnEventSourceMapping
      ) {
        return true;
      } else if (
        filterWithDefaults.spySqs &&
        this.props?.spySqsWithNoSubscriptionAndDropAllMessages &&
        node instanceof sqs.Queue
      ) {
        return true;
      }

      return false;
    });

    this.internalSpyNodes(nodes);
    this.finalizeSpy();
  }

  private internalSpyNodes(nodes: IConstruct[]) {
    for (const node of nodes) {
      this.internalSpyNode(node);
    }
  }

  private finalizeSpy() {
    //set mapping property for all functions we created
    for (const func of this.lambdaSubscriptionPool) {
      func.function.addEnvironment(
        envVariableNames.SSPY_INFRA_MAPPING,
        JSON.stringify(func.mapping)
      );
    }

    //set mapping property for all functions we spy on
    for (const func of this.lambdasSpied) {
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

    const extensionAssetLocationWrapper = path.join(
      extensionAssetLocation,
      'spy-wrapper'
    );
    if (!fs.existsSync(extensionAssetLocationWrapper)) {
      throw new Error(
        `Wrapper script for extension does not exists ${extensionAssetLocation}`
      );
    }

    const extensionAssetLocationCode = path.join(
      extensionAssetLocation,
      `nodejs/node_modules/interceptor.js`
    );
    if (!fs.existsSync(extensionAssetLocationCode)) {
      throw new Error(
        `Code for extension does not exists ${extensionAssetLocationCode}`
      );
    }
    return extensionAssetLocation;
  }

  private getLanguageExtensionAssetLocation(language: string) {
    const rootDir = path.join(__dirname, '..');

    let extensionAssetLocation = path.join(rootDir, `extensions/${language}`);

    const extensionAssetLocationAlt = path.join(
      rootDir,
      `lib/extensions/${language}`
    );

    if (!fs.existsSync(extensionAssetLocation)) {
      if (!fs.existsSync(extensionAssetLocationAlt)) {
        throw new Error(
          `Folder with assets for extension for ${language} does not exists at ${extensionAssetLocation} or at ${extensionAssetLocationAlt} `
        );
      } else {
        extensionAssetLocation = extensionAssetLocationAlt;
      }
    }

    const extensionAssetLocationWrapper = path.join(
      // extensionAssetLocation.substring(
      //   0,
      //   extensionAssetLocation.lastIndexOf(path.sep)
      // ),
      extensionAssetLocation,
      'spy-wrapper'
    );
    if (!fs.existsSync(extensionAssetLocationWrapper)) {
      throw new Error(
        `Wrapper script for extension does not exists at ${extensionAssetLocationWrapper}`
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

  private getAllNodes(parent: IConstruct) {
    const nodes: IConstruct[] = [];
    nodes.push(parent);
    this.getAllNodesRecursive(parent, nodes);
    return nodes;
  }

  private getAllNodesRecursive(parent: IConstruct, nodes: IConstruct[]) {
    for (const node of parent.node.children) {
      nodes.push(node);
      this.getAllNodesRecursive(node, nodes);
    }
  }

  private internalSpyNode(node: IConstruct) {
    if (this.spiedNodes.includes(node)) {
      return;
    }

    this.spiedNodes.push(node);

    if (this.createdResourcesBySSpy.includes(node)) {
      return;
    }

    if (this.lambdaSubscriptionPool.find((s) => s.function === node)) {
      return;
    }

    if (this.props?.debugMode) {
      console.info('Spy on node', this.getConstructName(node));
    }

    if (
      node instanceof lambda.Function ||
      node instanceof NodejsFunction ||
      isLambdaFunction(node)
    ) {
      this.internalSpyLambda(node);
    } else if (node instanceof sns.Topic) {
      this.internalSpySnsTopic(node);
    } else if (node instanceof sns.Subscription) {
      this.internalSpySnsSubscription(node);
    } else if (node instanceof s3.Bucket) {
      this.internalSpyS3(node);
    } else if (node instanceof dynamoDb.Table) {
      this.internalSpyDynamodb(node);
    } else if (node instanceof dynamoDb.TableV2) {
      this.internalSpyDynamodb(node);
    } else if (node instanceof events.EventBus) {
      this.internalSpyEventBus(node);
    } else if (node instanceof events.Rule) {
      this.internalSpyEventBusRule(node);
    } else if (node instanceof lambda.CfnEventSourceMapping) {
      this.internalSpySqs(node);
    } else if (node instanceof sqs.Queue) {
      if (this.props?.spySqsWithNoSubscriptionAndDropAllMessages) {
        this.internalSpySpySqsWithNoSubscription(node);
      }
    }
  }

  private getExtensionForRuntime(
    runtime: lambda.Runtime,
    architecture: lambda.Architecture
  ): { layer: lambda.ILayerVersion; spyWrapperPath: string } | undefined {
    const layerKey = (r: lambda.Runtime, a: lambda.Architecture) =>
      `${r.toString()}_${a.name.toString()}`;

    let layer = this.layerMap[layerKey(runtime, architecture)];
    let spyWrapperPath = '/opt/spy-wrapper';

    switch (runtime.name) {
      case lambda.Runtime.PYTHON_3_8.name:
      case lambda.Runtime.PYTHON_3_9.name:
      case lambda.Runtime.PYTHON_3_10.name:
      case lambda.Runtime.PYTHON_3_11.name:
      case lambda.Runtime.PYTHON_3_12.name:
        const location = this.getLanguageExtensionAssetLocation('python');
        spyWrapperPath = '/opt/python/spy-wrapper';
        layer =
          layer ||
          new PythonLayerVersion(
            this,
            `PythonExtension${runtime.name
              .replace('python', '')
              .replace('.', '_')}`,
            {
              compatibleRuntimes: [runtime],
              compatibleArchitectures: [architecture],
              entry: location,
              bundling: {
                bundlingFileAccess: BundlingFileAccess.VOLUME_COPY,
                // command: [
                //   `cp ${path.join(
                //     location.substring(0, location.lastIndexOf(path.sep)),
                //     'spy-wrapper/spy-wrapper'
                //   )} /asset-output/python`,
                // ],
              },
            }
          );
        break;
      case lambda.Runtime.NODEJS_12_X.name:
      case lambda.Runtime.NODEJS_14_X.name:
      case lambda.Runtime.NODEJS_16_X.name:
      case lambda.Runtime.NODEJS_18_X.name:
      case lambda.Runtime.NODEJS_20_X.name:
      case lambda.Runtime.NODEJS_22_X.name:
        layer =
          layer ||
          new lambda.LayerVersion(this, 
          `NodeExtension${runtime.name
            .replace('node', '')
            .replace('.', '_')}`, 
          {
            compatibleRuntimes: [
              lambda.Runtime.NODEJS_12_X,
              lambda.Runtime.NODEJS_14_X,
              lambda.Runtime.NODEJS_16_X,
              lambda.Runtime.NODEJS_18_X,
              lambda.Runtime.NODEJS_20_X,
              lambda.Runtime.NODEJS_22_X,
            ],
            compatibleArchitectures: [architecture],
            code: lambda.Code.fromAsset(this.getExtensionAssetLocation()),
          });
        break;
      default:
        console.log(`No extensions available for ${runtime.toString()}`);
        return undefined;
    }

    for (const compatibleRuntime of layer.compatibleRuntimes!) {
      this.layerMap[layerKey(compatibleRuntime, architecture)] = layer;
    }
    this.createdResourcesBySSpy.push(layer);
    return { layer, spyWrapperPath };
  }

  private internalSpySpySqsWithNoSubscription(queue: sqs.Queue) {
    const subscription = this.findElement<lambda.CfnEventSourceMapping>(
      (n: IConstruct) =>
        n instanceof lambda.CfnEventSourceMapping &&
        (n as lambda.CfnEventSourceMapping).eventSourceArn === queue.queueArn
    );

    if (subscription) {
      return; //already have subscription
    }

    const queueName = this.getConstructName(queue);
    const func = new NodejsFunction(
      this,
      `${queueName}SqsSubscriptionAndDropAllMessages`,
      {
        memorySize: 512,
        timeout: Duration.seconds(5),
        runtime: lambda.Runtime.NODEJS_22_X,
        handler: 'handler',
        entry: this.getAssetLocation(
          'functions/sqsSubscriptionAndDropAllMessages.js'
        ),
        environment: this.getDefaultLambdaEnvironmentVariables(),
      }
    );
    func.addEventSource(new SqsEventSource(queue));
    this.setupForIoT(func);
    const { layer, spyWrapperPath } = this.getExtensionForRuntime(
      func.runtime,
      func.architecture
    )!;
    func.addLayers(layer);

    func.addEnvironment('AWS_LAMBDA_EXEC_WRAPPER', spyWrapperPath);

    if (this.props?.debugMode) {
      func.addEnvironment(envVariableNames.SSPY_DEBUG, 'true');
    }

    this.createdResourcesBySSpy.push(func);

    const serviceKey = `Sqs#${queueName}`;

    this.addMappingToFunction(func, {
      key: queue.queueArn,
      value: serviceKey,
    });

    this.serviceKeys.push(serviceKey);
    func.addEnvironment(envVariableNames.SSPY_SUBSCRIBED_TO_SQS, 'true');
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
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'handler',
      entry: this.getAssetLocation('functions/sendMessage.js'),
      environment: {
        NODE_OPTIONS: '--enable-source-maps',
      },
    });
    this.setupForIoT(func);
    return func;
  }

  private internalSpyS3(s3Bucket: s3.Bucket) {
    s3Bucket.addEventNotification(
      s3.EventType.OBJECT_CREATED_PUT,
      new s3notif.LambdaDestination(this.lambdaSubscriptionMain.function)
    );

    const name = this.getConstructName(s3Bucket);

    const serviceKey = `S3#${name}`;
    this.lambdaSubscriptionMain.mapping[s3Bucket.bucketArn] = serviceKey;
    this.serviceKeys.push(serviceKey);
  }

  private internalSpyDynamodb(table: dynamoDb.Table | dynamoDb.TableV2) {
    // enable DynamoDB streams with a hack
    (table.node.defaultChild as dynamoDb.CfnTable).streamSpecification = {
      streamViewType: dynamoDb.StreamViewType.NEW_AND_OLD_IMAGES,
    };
    (table as any).tableStreamArn = (
      table.node.defaultChild as dynamoDb.CfnTable
    ).attrStreamArn;

    this.lambdaSubscriptionMain.function.addEventSource(
      new dynamoDbStream.DynamoEventSource(table, {
        startingPosition: lambda.StartingPosition.LATEST,
        batchSize: 1,
        retryAttempts: 0,
      })
    );

    const name = this.getConstructName(table);

    const serviceKey = `DynamoDB#${name}`;
    this.lambdaSubscriptionMain.mapping[table.tableArn] = serviceKey;
    this.serviceKeys.push(serviceKey);
  }

  private internalSpyEventBusRule(rule: events.Rule) {
    const { eventBusName } = rule.node.defaultChild as events.CfnRule;
    let bridgeName = 'Default';
    if (!!eventBusName) {
      const eventBridge = this.getEventBridge(eventBusName);

      if (!eventBridge) {
        throw new Error(`Can not find EventBridge with name "${eventBusName}"`);
      }
      bridgeName = this.getConstructName(eventBridge);
    }

    const functionSubscription = this.provideFunctionForSubscription(
      (s) => !s.usedForEventBridge
    );
    functionSubscription.usedForEventBridge = true;

    rule.addTarget(new targets.LambdaFunction(functionSubscription.function));

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

    this.createdResourcesBySSpy.push(rule);
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
    this.createdResourcesBySSpy.push(subscription);
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

    this.createdResourcesBySSpy.push(subscriptionClone);

    const topicName = this.getConstructName(topic);
    const targetName = this.getConstructName(subscription.node.scope);

    functionSubscription.subsribedTopics.push(topic);
    const serviceKey = `SnsSubscription#${topicName}#${targetName}`;
    functionSubscription.mapping[topic.topicArn] = serviceKey;
    this.serviceKeys.push(serviceKey);
  }

  private provideFunctionForSubscription(
    filterFunction?: (subscription: LambdaSubscription) => boolean
  ) {
    let functionSubscription: LambdaSubscription | undefined;

    if (filterFunction) {
      functionSubscription = this.lambdaSubscriptionPool.find(filterFunction);
    } else if (this.lambdaSubscriptionPool.length > 0) {
      functionSubscription = this.lambdaSubscriptionPool[0];
    }

    if (!functionSubscription) {
      functionSubscription = {
        subsribedTopics: [],
        usedForEventBridge: false,
        mapping: {},
        function: this.createFunctionForSubscription(
          this.lambdaSubscriptionPool.length
        ),
      };
      this.lambdaSubscriptionPool.push(functionSubscription);
    }
    return functionSubscription;
  }

  private setupForIoT(func: lambda.Function) {
    func.addEnvironment(
      envVariableNames.SSPY_ROOT_STACK,
      this.cleanName(this.findRootStack(Stack.of(this)).node.id)
    );
    func.addEnvironment(envVariableNames.SSPY_IOT_ENDPOINT, this.iotEndpoint);

    func.addToRolePolicy(
      new aws_iam.PolicyStatement({
        actions: ['iot:*'],
        effect: Effect.ALLOW,
        resources: ['*'],
      })
    );
  }

  private internalSpyLambda(func: lambda.Function) {
    const { layer, spyWrapperPath } = this.getExtensionForRuntime(
      func.runtime,
      func.architecture || Architecture.X86_64
    )!;
    if (!layer) {
      return;
    }
    func.addLayers(layer);

    const functionName = this.getConstructName(func);

    func.addEnvironment(envVariableNames.SSPY_FUNCTION_NAME, functionName);
    func.addEnvironment('AWS_LAMBDA_EXEC_WRAPPER', spyWrapperPath);

    if (this.props?.debugMode) {
      func.addEnvironment(envVariableNames.SSPY_DEBUG, 'true');
    }

    this.setupForIoT(func);

    this.serviceKeys.push(`Function#${functionName}#Request`);
    this.serviceKeys.push(`Function#${functionName}#Error`);
    this.serviceKeys.push(`Function#${functionName}#Console`);
    this.serviceKeys.push(`Function#${functionName}#Response`);

    this.addMappingToFunction(func);
  }

  public getConstructName(construct: IConstruct) {
    let constructName = construct.node.path;
    const { node } = Stack.of(this);

    if (constructName.startsWith(node.id)) {
      constructName = constructName.substring(node.id.length + 1);
    }

    return this.cleanName(constructName);
  }

  private cleanName(name: string) {
    //snake case to camel case including dash and first letter to upper case
    return name
      .replace(/[-_]+/g, ' ')
      .replace(/[^\w\s]/g, '')
      .replace(/\s(.)/g, ($1) => $1.toUpperCase())
      .replace(/\s/g, '')
      .replace(/^(.)/, ($1) => $1.toUpperCase());
  }

  private getTopic(topicArn: string): sns.Topic | undefined {
    const topic = this.findElement<sns.Topic>(
      (node: IConstruct) =>
        node instanceof sns.Topic && (node as sns.Topic).topicArn === topicArn
    );

    return topic;
  }

  private getEventBridge(eventBusName: string): events.IEventBus | undefined {
    const eventBridge = this.findElement<events.IEventBus>(
      (node: IConstruct) =>
        (node instanceof events.EventBus ||
          node.constructor.name === 'ImportedEventBus') &&
        (node as events.IEventBus).eventBusName === eventBusName
    );

    return eventBridge;
  }

  private findRootStack(stack: Stack): Stack {
    if (stack.nested) {
      const parentStack = (stack as NestedStack).nestedStackParent;
      if (parentStack) return this.findRootStack(parentStack);
      return stack;
    } else {
      return stack;
    }
  }

  private findElement<T extends IConstruct = IConstruct>(
    filterFunc: (node: IConstruct) => boolean,
    parent?: IConstruct
  ): T | undefined {
    if (!parent) {
      parent = this.findRootStack(Stack.of(this));
    }

    for (const node of parent.node.children) {
      if (filterFunc(node)) {
        return node as T;
      }
      const elementFoundInChild = this.findElement<T>(filterFunc, node);
      if (elementFoundInChild) {
        return elementFoundInChild;
      }
    }

    return undefined;
  }

  private addMappingToFunction(
    func: lambda.Function,
    keyValue?: { key: string; value: string }
  ) {
    for (const fs of this.lambdasSpied) {
      if (fs.function === func) {
        if (keyValue) {
          fs.mapping[keyValue.key] = keyValue.value;
        }
        return;
      }
    }

    const fs: LambdaSpied = {
      function: func,
      mapping: {},
    };

    if (keyValue) {
      fs.mapping[keyValue.key] = keyValue.value;
    }

    this.lambdasSpied.push(fs);
  }

  private getAssetLocation(location: string) {
    const loc = path.join(__dirname, '../lib/' + location);

    if (fs.existsSync(loc)) {
      return loc;
    }

    const loc2 = path.join(__dirname, '../../lib/' + location);

    if (fs.existsSync(loc2)) {
      return loc2;
    }

    throw new Error(`Location ${loc} and ${loc2} does not exists.`);
  }
}

type LambdaSubscription = {
  subsribedTopics: sns.Topic[];
  usedForEventBridge: boolean;
  function: lambdaNode.NodejsFunction;
  mapping: Record<string, string>;
};

type LambdaSpied = {
  function: lambda.Function;
  mapping: Record<string, string>;
};
