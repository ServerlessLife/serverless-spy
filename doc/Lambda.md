# Lambda

Basic example:

```typescript
await serverlessSpyListener.waitForFunctionMyLambdaRequest();
```

You can use conditions to wait for a particular event. You can also use generic (`TestData`) to strongly type the event.

```typescript
await serverlessSpyListener.waitForFunctionMyLambdaRequest<TestData>({
  condition: (d) => d.request.id === myData.id,
});
```

Lambda produces three kinds of events: **Request, Console, Response**
```typescript
await serverlessSpyListener.waitForFunctionMyLambdaRequest();
await serverlessSpyListener.waitForFunctionMyLambdaConsole();
await serverlessSpyListener.waitForFunctionMyLambdaResponse();
```
The `Console` event can be useful to validate intermediate processing steps. You write events with a simple `console.log()` method in the Lambda code.

You can chain calls for the same request:
```typescript
await (
  await (
    await serverlessSpyListener.waitForFunctionMyLambdaRequest({
      condition: (d) => d.request.id === myData.id,
    })
  ).followedByConsole()
).followedByResponse();
```

The condition `condition: (d) => d.request.id === myData.id` finds the correct request and than you can use on each part `getData()` to get the event or any Jest functions to validate.

So fully blown test would look like this:
```typescript
(
  await (
    await (
      await serverlessSpyListener.waitForFunctionMyLambdaRequest<TestData>({
        condition: (d) => d.request.id === myData.id,
      })
    )
      .toMatchObject({
        request: myData,
      })
      .followedByConsole()
  )
    .toMatchObject({
      request: myData,
      console: {
        message: 'My console log message',
        optionalParams: [myData],
      },
    })
    .followedByResponse()
).toMatchObject({
  request: myData,
  response: {
    ...myData,
    message: `${myData.message} ServerlessSpy`,
  },
```

You can see all combinations in [this test](https://github.com/ServerlessLife/serverless-spy/blob/main/test/cdk/test/lambda.test.ts){:target="_blank"}.