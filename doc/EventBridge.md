# EventBridge

EventBridge integration has two types of methods:
 - `waitForEventBridgeXxx()` - Intercept all events received by EventBridge.
 - `waitForEventBridgeRuleXxxYyy` - Intercept only events received by Rule.

Basic example:

```typescript
await serverlessSpyListener.waitForEventBridgeMyEventBus<TestData>();

await serverlessSpyListener.waitForEventBridgeRuleMyEventBusMyRule<TestData>();
```

You can use conditions to wait for a particular event. You can also use generic (`TestData`) to strongly type the event.

```typescript     
await serverlessSpyListener.waitForEventBridgeMyEventBus<TestData>({
  condition: (d) => d.detail.id === id,
});

await serverlessSpyListener.waitForEventBridgeRuleMyEventBusMyRule<TestData>({
  condition: (d) => d.detail.id === id,
});
```
Check [this](https://github.com/ServerlessLife/serverless-spy/blob/main/test/cdk/test/eventBridgeToLambda.test.ts){:target="_blank"} and 
[this](https://github.com/ServerlessLife/serverless-spy/blob/main/test/cdk/test/lambdaToEventBridge.test.ts){:target="_blank"} test.