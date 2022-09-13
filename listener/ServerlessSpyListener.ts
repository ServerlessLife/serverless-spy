import { DynamoDBSpyEvent } from '../common/spyEvents/DynamoDBSpyEvent';
import { EventBridgeRuleSpyEvent } from '../common/spyEvents/EventBridgeRuleSpyEvent';
import { EventBridgeSpyEvent } from '../common/spyEvents/EventBridgeSpyEvent';
import { FunctionConsoleSpyEvent } from '../common/spyEvents/FunctionConsoleSpyEvent';
import { FunctionRequestSpyEvent } from '../common/spyEvents/FunctionRequestSpyEvent';
import { FunctionResponseSpyEvent } from '../common/spyEvents/FunctionResponseSpyEvent';
import { S3SpyEvent } from '../common/spyEvents/S3SpyEvent';
import { SnsSubscriptionSpyEvent } from '../common/spyEvents/SnsSubscriptionSpyEvent';
import { SnsTopicSpyEvent } from '../common/spyEvents/SnsTopicSpyEvent';
import { SqsSpyEvent } from '../common/spyEvents/SqsSpyEvent';
import { PrettifyForDisplay } from './PrettifyForDisplay';
import {
  DynamoDBSpyHandler,
  EventBridgeSpyHandler,
  EventBridgeRuleSpyHandler,
  S3SpyHandler,
  SnsSubscriptionSpyHandler,
  SnsTopicSpyHandler,
  SqsSpyHandler,
  FunctionRequestSpyHandler,
  FunctionConsoleSpyHandler,
  FunctionResponseSpyHandler,
} from './SpyHandlers.ts';
import { WaitForParams } from './WaitForParams';

export type ServerlessSpyListener<TSpyEvents> = {
  [P in keyof FilterConditionally<TSpyEvents, `DynamoDB#${any}`> &
    string as `waitFor${P}`]: <T = any>(
    param?: PrettifyForDisplay<
      WaitForParams<PrettifyForDisplay<DynamoDBSpyEvent>>
    >
  ) => Promise<DynamoDBSpyHandler<T>>;
} & {
  [P in keyof FilterConditionally<TSpyEvents, `EventBridge#${any}`> &
    string as `waitFor${P}`]: <T = any>(
    param?: PrettifyForDisplay<
      WaitForParams<PrettifyForDisplay<EventBridgeSpyEvent<T>>>
    >
  ) => Promise<EventBridgeSpyHandler<T>>;
} & {
  [P in keyof FilterConditionally<TSpyEvents, `EventBridgeRule#${any}`> &
    string as `waitFor${P}`]: <T = any>(
    param?: PrettifyForDisplay<
      WaitForParams<PrettifyForDisplay<EventBridgeRuleSpyEvent<T>>>
    >
  ) => Promise<EventBridgeRuleSpyHandler<T>>;
} & {
  [P in keyof FilterConditionally<TSpyEvents, `S3#${any}`> &
    string as `waitFor${P}`]: (
    param?: PrettifyForDisplay<WaitForParams<PrettifyForDisplay<S3SpyEvent>>>
  ) => Promise<S3SpyHandler>;
} & {
  [P in keyof FilterConditionally<TSpyEvents, `SnsSubscription#${any}`> &
    string as `waitFor${P}`]: <T = any>(
    param?: PrettifyForDisplay<
      WaitForParams<PrettifyForDisplay<SnsSubscriptionSpyEvent<T>>>
    >
  ) => Promise<SnsSubscriptionSpyHandler<T>>;
} & {
  [P in keyof FilterConditionally<TSpyEvents, `SnsTopic#${any}`> &
    string as `waitFor${P}`]: <T = any>(
    param?: PrettifyForDisplay<
      WaitForParams<PrettifyForDisplay<SnsTopicSpyEvent<T>>>
    >
  ) => Promise<SnsTopicSpyHandler<T>>;
} & {
  [P in keyof FilterConditionally<TSpyEvents, `Sqs#${any}`> &
    string as `waitFor${P}`]: <T = any>(
    param?: PrettifyForDisplay<
      WaitForParams<PrettifyForDisplay<SqsSpyEvent<T>>>
    >
  ) => Promise<SqsSpyHandler<T>>;
} & {
  [P in keyof FilterConditionally<TSpyEvents, `Function#${any}#Request`> &
    string as `waitFor${P}`]: <T = any>(
    param?: PrettifyForDisplay<
      WaitForParams<PrettifyForDisplay<FunctionRequestSpyEvent<T>>>
    >
  ) => Promise<FunctionRequestSpyHandler<T>>;
} & {
  [P in keyof FilterConditionally<TSpyEvents, `Function#${any}#Console`> &
    string as `waitFor${P}`]: <T = any>(
    param?: PrettifyForDisplay<
      WaitForParams<PrettifyForDisplay<FunctionConsoleSpyEvent<T>>>
    >
  ) => Promise<FunctionConsoleSpyHandler<T>>;
} & {
  [P in keyof FilterConditionally<TSpyEvents, `Function#${any}#Response`> &
    string as `waitFor${P}`]: <T = any>(
    param?: PrettifyForDisplay<
      WaitForParams<PrettifyForDisplay<FunctionResponseSpyEvent<T>>>
    > //      filter?: (event: FunctionResponseSpyEvent<T>) => boolean
  ) => Promise<FunctionResponseSpyHandler<T>>;
} & {
  stop: () => void;
};

type FilterConditionally<Source, Condition> = Pick<
  Source,
  {
    [K in keyof Source]: Source[K] extends Condition ? K : never;
  }[keyof Source]
>;
