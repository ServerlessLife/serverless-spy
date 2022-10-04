# SQS

Basic example:

```typescript
await serverlessSpyListener.waitForSqsMyQueue();
```

You can use conditions to wait for particular event. You can also use generic (`TestData`) to strongly type the event.

```typescript
await serverlessSpyListener.waitForSqsMyQueue<TestData>({
  condition: (d) => d.body.id === id,
});
```

Intercept of SQS event actually intercept events that are consumed by Lambda subscribed to SQS. **⚠️If no Lambda is subscribed to SQS, the ServerlessSpy can not intercept, events.** If you still want to catch them enable `spySqsWithNoSubscriptionAndDropAllMessages` when [creating ServerlessSpy in CDK](./CDK_construct.md). With this flag on, additional Lambda will be created that will just consume messages and throw them away (= lost forever ⛔). Of course, that is undesirable in most cases, but for some tests it could be useful.

Check [this](https://github.com/ServerlessLife/serverless-spy/blob/main/test/cdk/test/sqs.test.ts){:target="_blank"} and 
[this](https://github.com/ServerlessLife/serverless-spy/blob/main/test/cdk/test/lambdaToSqs.test.ts){:target="_blank"} test.