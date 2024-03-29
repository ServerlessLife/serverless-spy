# Writing Tests

## Creating `ServerlessSpyListener`

### Include the TypeScript file that was generated when deploying

```typescript
import { ServerlessSpyEvents } from '../serverlessSpyEvents/ServerlessSpyEvents';
```

### Get ServerlessSpy WebSocket URL from CloudFormation output
```typescript
const exportLocation = path.join(__dirname, 'cdkOutput.json');
const output = JSON.parse(fs.readFileSync(exportLocation).toString())[
  'YourStackName'
];
```

### Initialize the `ServerlessSpyListener`
```typescript
let serverlessSpyListener: ServerlessSpyListener<ServerlessSpyEvents>;
beforeEach(async () => {
  serverlessSpyListener =
    await createServerlessSpyListener<ServerlessSpyEvents>({
      serverlessSpyWsUrl: output.ServerlessSpyWsUrl,
    });
});
```  

### Close the `ServerlessSpyListener`
```typescript
afterEach(async () => {
  serverlessSpyListener.stop();
});
```
## Writing test

There are several ways that you can use to write a test.

## Waiting for the event to occur

```typescript
await serverlessSpyListener.waitForXXX<TestData>()
```
or
```typescript
await serverlessSpyListener.waitForXXX()
```

`WaitFor` methods are generated with TypeScript. You should name your resources in CDK in a way that these methods are easy to read.

Please note that there is no order enforced on events. The same event can match with multiple `WaitFor` calls. When `WaitFor` is called, it checks for a matching event in the bucket of all received events since initializing `ServerlessSpyListener`. The matching event will not be removed. If the event is not found, it starts to wait for one. So if you write  `await serverlessSpyListener.waitForXXX<TestData>()` twice, because you expect events to occur twice, it will not work. The first event will satisfy both `WaitFor` calls. 

`TestData` is an optional generic argument that makes all parameters strongly typed. If that is useful, decide based on your use case.

## Filtering the events

It makes a lot of sense to filter a message by some condition, like ID.
```typescript
await serverlessSpyListener.waitForSnsTopicMyTopic<TestData>({
  condition: (d) => d.message.id === id,
})
```
This way, you can run tests in parallel and handle cases when a similar event occurs multiple times as part of the same test.

**💡Recommendation: Try not to use conditions for validating the event. Just find the event with the help of conditions and then validate it with Jest. Tests are easier to debug this way because the error shows which part of the data does not match. But if you like using just conditions, so tests are easy to read, go ahead.**

## Extracting the event data with `getData()`
```typescript
const event = (await serverlessSpyListener.waitForXXX<TestData>()).getData();
```
You can validate that event with Jest, or any other testing framework like you always do:
```typescript
expect(event).toMatchObject(...);
```

## Using ServerlessSpy integration with Jest
The previous example can be done in a much slicker way:

```typescript
(await serverlessSpyListener.waitForXXX<TestData>()).toMatchObject(...);
```

## Tracing event through the same Lambda call
Tests for the same Lambda request can be chained together:
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
That is useful when you expect a Lambda request that will produce some data. You can also validate intermediate steps of processing with console log events.

[more on spying on Lambda](Lambda.md)