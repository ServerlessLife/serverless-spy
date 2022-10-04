# SNS

SNS integration has two types of methods:
 - `waitForSnsTopicXxx()` - Intercept all events on SNS.
 - `waitForSnsSubscriptionXxxYyy` - Intercept all events for SNS subscription. If the subscription has no filters it is the same as previous method.

Basic example:

```typescript
await serverlessSpyListener.waitForSnsTopicMyTopic();

await serverlessSpyListener.waitForSnsSubscriptionMyTopicMyLambda();    
```

You can use conditions to wait for particular event. You can also use generic (`TestData`) to strongly type the event.

```typescript    
await serverlessSpyListener.waitForSnsTopicMyTopic<TestData>({
  condition: (d) => d.message.id === id,
});

await serverlessSpyListener.waitForSnsSubscriptionMyTopicMyLambda<TestData>({
    condition: (d) => d.message.id === id,
});    
```
Check [this](https://github.com/ServerlessLife/serverless-spy/blob/main/test/cdk/test/lambdaToSnS.test.ts){:target="_blank"} and 
[this](https://github.com/ServerlessLife/serverless-spy/blob/main/test/cdk/test/snsToLambda.test.ts){:target="_blank"} test.