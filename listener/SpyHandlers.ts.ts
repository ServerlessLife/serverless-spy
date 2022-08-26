import { DynamoDBSpyEvent } from '../common/spyEvents/DynamoDBSpyEvent';
import { EventBridgeRuleSpyEvent } from '../common/spyEvents/EventBridgeRuleSpyEvent';
import { EventBridgeSpyEvent } from '../common/spyEvents/EventBridgeSpyEvent';
import { FunctionConsoleSpyEvent } from '../common/spyEvents/FunctionConsoleSpyEvent';
import { FunctionContext } from '../common/spyEvents/FunctionContext';
import { FunctionRequestSpyEvent } from '../common/spyEvents/FunctionRequestSpyEvent';
import { FunctionResponseSpyEvent } from '../common/spyEvents/FunctionResponseSpyEvent';
import { S3SpyEvent } from '../common/spyEvents/S3SpyEvent';
import { SnsSubscriptionSpyEvent } from '../common/spyEvents/SnsSubscriptionSpyEvent';
import { SnsTopicSpyEvent } from '../common/spyEvents/SnsTopicSpyEvent';
import { SqsSpyEvent } from '../common/spyEvents/SqsSpyEvent';
import { PrettifyForDisplay } from './PrettifyForDisplay';
import { RecursivePartial } from './RecursivePartial';

type MyJestMatchers = ReturnType<typeof expect>;
type MyJestMatchersWitOnlyFunctions = Pick<
  MyJestMatchers,
  {
    [P in keyof MyJestMatchers]: MyJestMatchers[P] extends (...args: any) => any
      ? P
      : never;
  }[keyof MyJestMatchers]
>;
type JestExpectWithSpyMethods<TSpyEvent, TSpyHandler> = Omit<
  {
    // toMatchObject: (expected: RecursivePartial<TSpyEvent>) => TSpyHandler;
    [K in keyof MyJestMatchersWitOnlyFunctions]: (
      ...args: Parameters<MyJestMatchersWitOnlyFunctions[K]>
    ) => TSpyHandler;
  },
  'toContainEqual' | 'toEqual' | 'toMatchObject' | 'toStrictEqual'
> & {
  /**
   * Used when you want to check that an item is in a list.
   * For testing the items in the list, this matcher recursively checks the
   * equality of all fields, rather than checking for object identity.
   *
   * Optionally, you can provide a type for the expected value via a generic.
   * This is particularly useful for ensuring expected objects have the right structure.
   */

  toContainEqual(expected: TSpyEvent): TSpyHandler;
  /**
   * Used when you want to check that two objects have the same value.
   * This matcher recursively checks the equality of all fields, rather than checking for object identity.
   *
   * Optionally, you can provide a type for the expected value via a generic.
   * This is particularly useful for ensuring expected objects have the right structure.
   */

  toEqual(expected: TSpyEvent): TSpyHandler;

  /**
   * Used to check that a JavaScript object matches a subset of the properties of an object
   *
   * Optionally, you can provide an object to use as Generic type for the expected value.
   * This ensures that the matching object matches the structure of the provided object-like type.
   *
   * @example
   *
   * type House = {
   *   bath: boolean;
   *   bedrooms: number;
   *   kitchen: {
   *     amenities: string[];
   *     area: number;
   *     wallColor: string;
   *   }
   * };
   *
   * expect(desiredHouse).toMatchObject<House>({...standardHouse, kitchen: {area: 20}}) // wherein standardHouse is some base object of type House
   */

  toMatchObject(
    expected: PrettifyForDisplay<RecursivePartial<TSpyEvent>>
  ): TSpyHandler;

  /**
   * Use to test that objects have the same types as well as structure.
   *
   * Optionally, you can provide a type for the expected value via a generic.
   * This is particularly useful for ensuring expected objects have the right structure.
   */

  toStrictEqual(expected: TSpyEvent): TSpyHandler;
};

export interface DynamoDBSpyHandler<TData = any>
  extends JestExpectWithSpyMethods<
    DynamoDBSpyEvent<TData>,
    DynamoDBSpyHandler<TData>
  > {
  getData: () => PrettifyForDisplay<DynamoDBSpyEvent<TData>>;
}
export interface EventBridgeRuleSpyHandler<TData = any>
  extends JestExpectWithSpyMethods<
    EventBridgeRuleSpyEvent<TData>,
    DynamoDBSpyHandler<TData>
  > {
  getData: () => PrettifyForDisplay<EventBridgeRuleSpyEvent<TData>>;
}
export interface EventBridgeSpyHandler<TData = any>
  extends JestExpectWithSpyMethods<
    EventBridgeSpyEvent<TData>,
    DynamoDBSpyHandler<TData>
  > {
  getData: () => PrettifyForDisplay<EventBridgeSpyEvent<TData>>;
}

export interface FunctionBaseSpyHandler<TData = any>
  extends JestExpectWithSpyMethods<
    FunctionRequestSpyEvent<TData>,
    FunctionRequestSpyHandler<TData>
  > {
  // follwedByConsoleLog: () => Promise<
  //   FunctionBaseSpyHandler<TData> &
  //     JestExpectWithSpyMethods<
  //       FunctionRequestSpyEvent<TData>,
  //       FunctionRequestSpyHandler<TData>
  //     >
  // >;
  followedByResponse: <TDataResponse = any>(
    // This implementation confuses TypeScript which does not accurately display the type.
    // Leave it for reference!
    // param: PrettifyForDisplay<
    //   WaitForParams<
    //     PrettifyForDisplay<FunctionResponseSpyEvent<TData, TDataResponse>>
    //   >
    // >
    param: {
      condition?: (event: {
        spyEventType: 'FunctionResponse';
        request: TData;
        context: FunctionContext;
        response: TDataResponse;
      }) => boolean;
      timoutMs?: number;
    }
  ) => Promise<
    FunctionResponseSpyHandler &
      JestExpectWithSpyMethods<
        FunctionRequestSpyEvent<TData>,
        FunctionRequestSpyHandler<TData>
      >
  >;
}

export interface FunctionRequestSpyHandler<TData = any>
  extends FunctionBaseSpyHandler<TData> {
  getData: () => PrettifyForDisplay<FunctionRequestSpyEvent<TData>>;
}

export interface FunctionConsoleSpyHandler<TData = any>
  extends FunctionBaseSpyHandler<TData> {
  getData: () => PrettifyForDisplay<FunctionConsoleSpyEvent<TData>>;
}

export interface FunctionResponseSpyHandler<TData = any>
  extends JestExpectWithSpyMethods<
    FunctionResponseSpyEvent<TData>,
    FunctionResponseSpyHandler<TData>
  > {
  getData: () => PrettifyForDisplay<FunctionResponseSpyEvent<TData>>;
}

export interface S3SpyHandler
  extends JestExpectWithSpyMethods<S3SpyEvent, DynamoDBSpyHandler> {
  getData: () => S3SpyEvent;
}
export interface SnsSubscriptionSpyHandler<TData = any>
  extends JestExpectWithSpyMethods<
    SnsSubscriptionSpyEvent<TData>,
    DynamoDBSpyHandler<TData>
  > {
  getData: () => PrettifyForDisplay<SnsSubscriptionSpyEvent<TData>>;
}
export interface SnsTopicSpyHandler<TData = any>
  extends JestExpectWithSpyMethods<
    SnsTopicSpyEvent<TData>,
    DynamoDBSpyHandler<TData>
  > {
  getData: () => PrettifyForDisplay<SnsTopicSpyEvent<TData>>;
}
export interface SqsSpyHandler<TData = any>
  extends JestExpectWithSpyMethods<
    SqsSpyEvent<TData>,
    DynamoDBSpyHandler<TData>
  > {
  getData: () => PrettifyForDisplay<SqsSpyEvent<TData>>;
}
