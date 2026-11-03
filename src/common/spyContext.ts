import { IConstruct } from 'constructs';
import type { SpyFilter } from '../ServerlessSpy';

/**
 * CDK context key that turns spying on/off for a scope and everything below it.
 *
 * Context is inherited through the construct tree, so it can be set on the app
 * (cdk.json, `new App({ context })`), on a (nested) stack or on a single
 * construct. Each key resolves to the value of the closest scope that sets it;
 * keys that are not set anywhere in the tree default to "spy on".
 */
export const SPY_CONTEXT_KEY = 'serverless-spy';

/**
 * Resource types that can be individually turned on/off with the
 * {@link SPY_CONTEXT_KEY} context.
 */
export type SpyKind = keyof SpyFilter;

//Record<SpyKind, true> makes the compiler complain when a filter key is not
//listed here (and a new resource type is added to SpyFilter)
const spyKindMap: Record<SpyKind, true> = {
  spyLambda: true,
  spySqs: true,
  spySnsTopic: true,
  spySnsSubsription: true,
  spyEventBridge: true,
  spyEventBridgeRule: true,
  spyS3: true,
  spyDynamoDB: true,
};

export const spyKinds = Object.keys(spyKindMap) as SpyKind[];

/**
 * Value of the {@link SPY_CONTEXT_KEY} CDK context.
 *
 * A boolean is a shortcut for `{ enabled: <boolean> }`.
 */
export interface SpyContext extends SpyFilter {
  /**
   * Turn spying on/off for this scope and all its children.
   * @default true
   */
  readonly enabled?: boolean;

  /**
   * Alias for {@link spySnsSubsription} with the correct spelling.
   */
  readonly spySnsSubscription?: boolean;
}

export interface ResolvedSpyContext {
  /**
   * False when spying is turned off for the scope.
   */
  readonly enabled: boolean;
  /**
   * Explicitly set flags. A flag that is not set is decided by the caller.
   */
  readonly flags: Partial<Record<SpyKind, boolean>>;
}

/**
 * Resolves the effective context for a construct.
 *
 * `node.tryGetContext()` already returns the inherited, closest value, but it
 * replaces the whole value: a nested stack that sets `{ spyLambda: false }`
 * would hide `{ spyS3: false }` set on the app. Walking the scopes (root ->
 * construct) resolves every key separately, so flags merge instead of replacing
 * each other. It also tells us which scope a value came from, which is used in
 * the warnings.
 * @param node Construct to resolve the context for.
 * @param onWarning Called for invalid or unknown context keys.
 */
export function resolveSpyContext(
  node: IConstruct,
  onWarning?: (scope: IConstruct, message: string) => void
): ResolvedSpyContext {
  let enabled = true;
  const flags: Partial<Record<SpyKind, boolean>> = {};

  for (const scope of node.node.scopes) {
    const raw: unknown = scope.node.tryGetContext(SPY_CONTEXT_KEY);

    if (raw === undefined || raw === null) {
      continue;
    }

    const enabledValue = toBoolean(raw);

    if (enabledValue !== undefined) {
      enabled = enabledValue;
      continue;
    }

    if (typeof raw !== 'object' || Array.isArray(raw)) {
      onWarning?.(
        scope,
        `Ignoring "${SPY_CONTEXT_KEY}" CDK context on ${
          scope.node.path
        }: expected a boolean or an object, got ${JSON.stringify(raw)}.`
      );
      continue;
    }

    for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
      if (key === 'enabled') {
        const bool = toBoolean(value);
        if (bool === undefined) {
          onWarning?.(scope, invalidValueWarning(scope, key, value));
          continue;
        }
        enabled = bool;
        continue;
      }

      const kind = toSpyKind(key);

      if (!kind) {
        onWarning?.(
          scope,
          `Ignoring unknown "${SPY_CONTEXT_KEY}" CDK context key "${key}" on ${
            scope.node.path
          }. Known keys are: enabled, ${spyKinds.join(', ')}.`
        );
        continue;
      }

      const bool = toBoolean(value);
      if (bool === undefined) {
        onWarning?.(scope, invalidValueWarning(scope, key, value));
        continue;
      }

      flags[kind] = bool;
    }
  }

  return { enabled, flags };
}

function toSpyKind(key: string): SpyKind | undefined {
  //correctly spelled alias of the (misspelled) SpyFilter property
  if (key === 'spySnsSubscription') {
    return 'spySnsSubsription';
  }

  return (spyKinds as string[]).includes(key) ? (key as SpyKind) : undefined;
}

function toBoolean(value: unknown): boolean | undefined {
  if (typeof value === 'boolean') {
    return value;
  }

  //CDK CLI context (-c key=false) ends up as a string
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true') {
      return true;
    }
    if (normalized === 'false') {
      return false;
    }
  }

  return undefined;
}

function invalidValueWarning(
  scope: IConstruct,
  key: string,
  value: unknown
): string {
  return `Ignoring "${SPY_CONTEXT_KEY}" CDK context key "${key}" on ${
    scope.node.path
  }: expected a boolean, got ${JSON.stringify(value)}.`;
}
