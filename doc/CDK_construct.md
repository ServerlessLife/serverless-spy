# CDK Construct

Adding ServerlessSpy construct is super simple.

# Step 1: Create object:
```typescript
const serverlessSpy = new ServerlessSpy(this, 'ServerlessSpy', {
  generateSpyEventsFileLocation: 'serverlessSpyEvents/ServerlessSpyEvents.ts'              
});
```

Parameters:
 - `generateSpyEventsFileLocation: serverlessSpyEvents/ServerlessSpyEvents.ts`  
is a TypeScript file that makes your tests strongly typed 💪. It just contains an interface with a list of possible events, but with the magic of TypeScript, every test becomes strongly typed thanks to this file.

 - `debugMode: true`  
You can enable the debug mode with this parameter.

 - `spySqsWithNoSubscriptionAndDropAllMessages`.   
If no Lambda is subscribed to SQS, the ServerlessSpy can not intercept events. With this flag on, additional Lambda will be created that will just consume messages and throw them away (= lost forever ⛔). Of course, that is undesirable in most cases, but for some tests could be useful.


# Step 2: Star spying

You can spy on everything:
```typescript
serverlessSpy.spy();
```

or you can limit what to spy on:
```typescript
serverlessSpy.spy({
  spyLambda: true,
  spySqs: true,
  spySnsTopic: true,
  spySnsSubsription: true,
  spyEventBridge: true,
  spyEventBridgeRule: true,
  spyS3: true,
  spyDynamoDB: true,
});
```

You can also specify just some nodes
```typescript
serverlessSpy.spyNodes([...]);
```
All child nodes are also included in the spying.

You can mix&match both methods.

**Why would you exclude some of the notes***
For DynamoDB, there could be only two Lambdas subscribed to DynamoDB Streams, and S3 can have only one. If you reach the quotas with your primary stack, you can use ServerlessSpy on those resources. 

There could also be other reasons to exclude some of the nodes specific to your use case.

 
