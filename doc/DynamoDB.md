# DynamoDB

DynamoDB integration subscribes to DynamoDb Stream and intercepts events. The event has the following properties:
 - `keys`
 - `newImage`
 - `oldImage`
 - `eventName` (`INSERT`, `MODIFY`, `REMOVE`) 
 
You can use `eventName` and compare `newImage` and `oldImage` to validate if the correct operation has been executed.

Basic example:

```typescript
await serverlessSpyListener.waitForDynamoDBMyTable<TestData>();
```

You can use conditions to wait for a particular event. You can also use generic (`TestData`) to strongly type the event.

```typescript    
await serverlessSpyListener.waitForDynamoDBMyTable<TestData>({
  condition: (d) => d.keys.pk === id,
});
```

Validating the data with Jest would look like this:
```typescript
(
  await serverlessSpyListener.waitForDynamoDBMyTable<TestData>({
    condition: (d) => d.keys.pk === id,
  })
).toMatchObject({
  eventName: 'INSERT',
  newImage: data,
});
```

**⚠️Warning: DynamoDB can have only two Lambdas subscribed to DynamoDB Streams. If your primary stack already has two, you can not use DynamoDB interception. You should [exclude DynamoDB interception in your CDK stack](./CDK_construct.md):
```typescript
serverlessSpy.spy({
  spyDynamoDB: false,
});
```

Check [this test](https://github.com/ServerlessLife/serverless-spy/blob/main/test/cdk/test/lambdaToDynamoDb.test.ts){:target="_blank"}.