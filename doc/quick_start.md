# Quick Start

You should use ServerlessSpy in the following environments:
 - Development environment: so you can write tests. Web console helps you with insight into what is happening in the system.
 - Automatic test environment: You execute written tests via CI.

## Step 1: Install
```bash
npm install serverless-spy
```

## Step 2: Include ServerlessSpy in the CDK stack 
```typescript
const serverlessSpy = new ServerlessSpy(this, 'ServerlessSpy', {
  generateSpyEventsFileLocation: 'serverlessSpyEvents/ServerlessSpyEvents.ts'              
});
serverlessSpy.spy();
```
[more](CDK_construct.md)

## Step 3: Deploy CDK stack with exporting CloudFormation outputs
```bash
cdk deploy --outputs-file cdkOutput.json
```

The key part of the output is `ServerlessSpyWsUrl`, which is the URL to the websocket where the testing library and web console receive events. Exclude the `cdkOutput.json` file from `git` (like you always do), especially if it has secrets.

Apart from CF output, the ServerlessSpy generates the TypeScript file `serverlessSpyEvents/ServerlessSpyEvents.ts` specified in the first step. This makes your test strongly typed 💪.

## Step 4: Write tests 🔨
Initialize the `ServerlessSpyListener`
```typescript
import { ServerlessSpyEvents } from '../serverlessSpyEvents/ServerlessSpyEvents';

let serverlessSpyListener: ServerlessSpyListener<ServerlessSpyEvents>;
beforeEach(async () => {
  serverlessSpyListener =
    await createServerlessSpyListener<ServerlessSpyEvents>({
      serverlessSpyWsUrl: output.ServerlessSpyWsUrl, // ServerlessSpy WebSocket URL from CloudFormation output
    });
});
```  

Write test:
```typescript
(
  await serverlessSpyListener.waitForSnsTopicMyTopic<TestData>()
).toMatchObject({ message: data });
```
Close the `ServerlessSpyListener`
```typescript
afterEach(async () => {
  serverlessSpyListener.stop();
});
```
[more](writing_tests.md)

## Step 5: Start local web console to gain more insights 🕵
```bash
npx sspy --cdkoutput cdkOutput.json
```
[more](web_console.md)