![ServerlessSpy](./logo/full_logo.svg)

CDK-based library for writing elegant, fast-executing integration tests on AWS serverless architecture and an additional web console to monitor events in real time. 

# How it works

**ServerlessSpy CDK construct creates infrastructure to intercept events in Lambda, SNS, SQS, EventBridge, DynamoDB, S3... and sends it to a testing library or your local web console via API Gateway WebSocket. The testing library subscribes to events so tests can be executed fast without checking/retrying if the process has finished. The testing library is integrated with Jest but can also be used with any other testing library. The web console can be used to see and inspect events in real time.**

[![Concept](./doc/concept.svg)](https://serverlessspy.com/)

**Your test for the example above would look something like this:**
```typescript
(
  await serverlessSpyListener.waitForEventBridgeMyEventBus<TestData>({
    condition: (d) => d.detail.id === id,
  })
).toMatchObject(...);

(
  await serverlessSpyListener.waitForSnsTopicMyTopic<TestData>({
    condition: (d) => d.message.id === id,
  })
).toMatchObject(...);

(
  await serverlessSpyListener.waitForSqsMyQueue<TestData>({
    condition: (d) => d.body.id === id,
  })
).toMatchObject(...);

(
  await (
    await serverlessSpyListener.waitForFunctionMyLambdaRequest<TestData>({
      condition: (d) => d.request.id === id,
    })
  ).followedByResponse();
).toMatchObject(...);

(
  await serverlessSpyListener.waitForDynamoDBMyTable<TestData>({
    condition: (d) => d.keys.pk === id,
  })
).toMatchObject({
  eventName: 'INSERT',
  newImage: ...,
});
```

**You can see all the events in the local web console:**
![Web console](./doc/web_console.gif)

# Key benefits
 - **Easy** to write tests that are strongly typed thanks to TypeScript ❤️.
 - **Tests are executed much FASTER** 🏎️💨 No need to write tests in a way to periodically check if the process has finished because all events are pushed to the testing library.
 - **Tests can run in parallel** if you use conditions and filter events specific to your test. This drastically reduces the execution time of the CI/CD process.
 - **Web console** enables you to see all events in real time. Debugging 🕵 has never been easier. Search is supported (with regular expression).

# What ServerlessSpy is not
 - ServerlessSpy can not be used if your infrastructure is not created with CDK. 
 - The solution is meant only for the development and (automatic) testing environment. You should **EXCLUDE** ServerlessSpy CDK construct in any other environment, especially a production or a high-load environment. ServerlessSpy is not meant for those; it just induces costs and could contribute to hitting AWS quotas (Lambda concurrent executions, ...).
 - Only Node.js stack is supported. There are no plans to support Python or any other. Use of TypeScript is deeply encouraged.
 - Web console only runs on your local computer. No cloud hosting of any kind (for now).

# Documentation
 - [Quick Start](doc/quick_start.md)
 - [CDK Construct](doc/CDK_construct.md)
 - [Writing tests](doc/writing_tests.md) 
   - [Lambda](doc/Lambda.md) 
   - [SQS](doc/SQS.md)
   - [SNS](doc/SNS.md)
   - [EventBridge](doc/EventBridge.md)
   - [DynamoDB](doc/DynamoDB.md)
   - [S3](doc/S3.md)   
   - Kinesis (work in progress)
   - Step Functions (work in progress)
 - [Web Console](doc/web_console.md)  
 - [Frequently Asked Questions (FAQ)](doc/FAQ.md)  
 - [Sample Application](https://github.com/ServerlessLife/serverless-spy-example){:target="_blank"}
 - [Roadmap](doc/roadmap.md)   
 - [Code of Conduct](doc/CODE_OF_CONDUCT.md) 
 - [Contributing Guide](doc/CONTRIBUTING.md) 
 - [Contributors](doc/Contributors.md)  
 - [License](./LICENSE.md)   