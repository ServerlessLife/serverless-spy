import { existsSync } from 'fs';
import * as path from 'path';
import { App, NestedStack, Stack } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';
import { resolveSpyContext } from '../src/common/spyContext';
import { ServerlessSpy, ServerlessSpyProps } from '../src/ServerlessSpy';

/**
 * Synth-only tests: ServerlessSpy reads the "serverless-spy" CDK context while
 * it spies on the tree, so the decisions can be asserted on the construct
 * level without deploying anything.
 *
 * These tests use the assets of the last build (npm run compile).
 */
const assets = [
  path.join(__dirname, '../lib/functions/sendMessage.js'),
  path.join(__dirname, '../lib/extension/dist/layer'),
];

if (assets.some((asset) => !existsSync(asset))) {
  throw new Error(
    `Synth tests need the build output, missing: ${assets
      .filter((asset) => !existsSync(asset))
      .join(', ')}. Run "npm run compile" first.`
  );
}

const contextKey = 'serverless-spy';

const createLambda = (scope: Construct, id: string) =>
  new lambda.Function(scope, id, {
    runtime: lambda.Runtime.NODEJS_22_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline('exports.handler = async () => {};'),
  });

const isSpied = (spy: ServerlessSpy, functionName: string) =>
  spy.serviceKeys.includes(`Function#${functionName}#Request`);

/**
 * Environment variables of a function (CDK resolves the lambda environment,
 * which is lazy, only while synthesizing or resolving the construct).
 */
const getEnvironment = (func: lambda.Function): Record<string, any> => {
  const cfnFunction = func.node.defaultChild as lambda.CfnFunction;
  const environment = Stack.of(func).resolve(cfnFunction.environment) as
    | lambda.CfnFunction.EnvironmentProperty
    | undefined;
  return environment?.variables ?? {};
};

const warningsOf = (spy: ServerlessSpy) =>
  spy.node.metadata
    .filter((entry) => entry.type === 'aws:cdk:warning')
    .map((entry) => entry.data)
    .join('\n');

type TreeProps = {
  spyProps?: ServerlessSpyProps;
  appContext?: Record<string, unknown>;
  nestedContext?: unknown;
};

const createTree = ({
  spyProps,
  appContext,
  nestedContext,
}: TreeProps = {}) => {
  const app = new App({ context: appContext });
  const root = new Stack(app, 'Root');
  const nested = new NestedStack(root, 'Nested');

  //CDK only allows setting context before a construct gets children
  if (nestedContext !== undefined) {
    nested.node.setContext(contextKey, nestedContext);
  }

  const rootLambda = createLambda(root, 'RootLambda');
  const nestedLambda = createLambda(nested, 'NestedLambda');

  const spy = new ServerlessSpy(root, 'ServerlessSpy', spyProps);

  return { app, root, nested, rootLambda, nestedLambda, spy };
};

describe('spying disabled with CDK context', () => {
  test('without context everything is spied on', () => {
    const { spy, rootLambda, nestedLambda } = createTree();

    spy.spy();

    expect(isSpied(spy, 'RootLambda')).toBe(true);
    expect(isSpied(spy, 'NestedNestedLambda')).toBe(true);
    expect(getEnvironment(rootLambda).AWS_LAMBDA_EXEC_WRAPPER).toBe(
      '/opt/spy-wrapper'
    );
    expect(getEnvironment(nestedLambda).AWS_LAMBDA_EXEC_WRAPPER).toBe(
      '/opt/spy-wrapper'
    );
  });

  test('enabled: false on a nested stack disables all resources below it', () => {
    const { nested, spy, rootLambda, nestedLambda } = createTree({
      nestedContext: { enabled: false },
    });
    const topic = new sns.Topic(nested, 'NestedTopic');

    spy.spy();

    expect(isSpied(spy, 'RootLambda')).toBe(true);
    expect(isSpied(spy, 'NestedNestedLambda')).toBe(false);
    expect(spy.serviceKeys).not.toContain('SnsTopic#NestedNestedTopic');

    expect(getEnvironment(rootLambda).AWS_LAMBDA_EXEC_WRAPPER).toBe(
      '/opt/spy-wrapper'
    );
    expect(
      getEnvironment(nestedLambda).AWS_LAMBDA_EXEC_WRAPPER
    ).toBeUndefined();

    //no spy subscription is attached to the topic
    expect(
      (topic.node.defaultChild as sns.CfnTopic).subscription
    ).toBeUndefined();
  });

  test('boolean context disables a single construct and its children', () => {
    const { nested, spy, rootLambda, nestedLambda } = createTree();
    const group = new Construct(nested, 'Group');
    group.node.setContext(contextKey, false);
    const groupedLambda = createLambda(group, 'GroupedLambda');

    spy.spy();

    expect(isSpied(spy, 'RootLambda')).toBe(true);
    expect(isSpied(spy, 'NestedNestedLambda')).toBe(true);
    expect(isSpied(spy, 'NestedGroupGroupedLambda')).toBe(false);
    expect(getEnvironment(rootLambda).AWS_LAMBDA_EXEC_WRAPPER).toBe(
      '/opt/spy-wrapper'
    );
    expect(getEnvironment(nestedLambda).AWS_LAMBDA_EXEC_WRAPPER).toBe(
      '/opt/spy-wrapper'
    );
    expect(
      getEnvironment(groupedLambda).AWS_LAMBDA_EXEC_WRAPPER
    ).toBeUndefined();
  });

  test('a single flag is disabled while other resource types are still spied on', () => {
    const { nested, spy } = createTree({
      spyProps: { spySqsWithNoSubscriptionAndDropAllMessages: true },
      nestedContext: { spyLambda: false },
    });
    new sqs.Queue(nested, 'NestedQueue');

    spy.spy();

    expect(isSpied(spy, 'NestedNestedLambda')).toBe(false);
    expect(spy.serviceKeys).toContain('Sqs#NestedNestedQueue');
  });

  test('flags are inherited and merged per key from the closest scope', () => {
    const { root, nested, spy } = createTree({
      appContext: { [contextKey]: { spyS3: false } },
      nestedContext: { spyLambda: false },
    });
    new s3.Bucket(root, 'RootBucket');
    new s3.Bucket(nested, 'NestedBucket');

    spy.spy();

    //spyS3 from the app level is inherited by the nested stack
    expect(spy.serviceKeys).not.toContain('S3#RootRootBucket');
    expect(spy.serviceKeys).not.toContain('S3#NestedNestedBucket');
    //spyLambda is only disabled in the nested stack
    expect(isSpied(spy, 'RootLambda')).toBe(true);
    expect(isSpied(spy, 'NestedNestedLambda')).toBe(false);
  });

  test('the closest scope can turn spying back on', () => {
    const { spy } = createTree({
      appContext: { [contextKey]: { enabled: false } },
      nestedContext: { enabled: true },
    });

    spy.spy();

    expect(isSpied(spy, 'RootLambda')).toBe(false);
    expect(isSpied(spy, 'NestedNestedLambda')).toBe(true);
  });

  test('spyNodes also respects the context', () => {
    const { nested, spy } = createTree({
      nestedContext: { spyLambda: false },
    });

    spy.spyNodes([nested]);

    expect(isSpied(spy, 'NestedNestedLambda')).toBe(false);
  });

  test('string values are accepted and unknown keys are reported', () => {
    const { spy } = createTree({
      nestedContext: { enabled: 'false', spyLamda: false },
    });

    spy.spy();

    expect(isSpied(spy, 'NestedNestedLambda')).toBe(false);
    expect(warningsOf(spy)).toContain(
      'Ignoring unknown "serverless-spy" CDK context key "spyLamda" on Root/Nested.'
    );
  });

  test('invalid values are reported and spying is left on', () => {
    const { spy } = createTree({
      nestedContext: { spyLambda: 'nope' },
    });

    spy.spy();

    expect(isSpied(spy, 'NestedNestedLambda')).toBe(true);
    expect(warningsOf(spy)).toContain(
      'Ignoring "serverless-spy" CDK context key "spyLambda" on Root/Nested: expected a boolean'
    );
  });

  test('correctly spelled alias of spySnsSubsription is accepted', () => {
    const app = new App({
      context: { [contextKey]: { spySnsSubscription: false } },
    });
    const stack = new Stack(app, 'Alias');

    expect(resolveSpyContext(stack).flags).toEqual({
      spySnsSubsription: false,
    });
  });
});
