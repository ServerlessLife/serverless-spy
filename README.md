![ServerlessSpy](/logo/full_logo.svg)

# **DECLAREMENT: THE PROJECT IS IN THE DEEP  DEVELOPMENT PHASE AND NOT JET MENT FOR USE.**

CDK-based library for writing elegant, fast executing integration tests on AWS serverless architecture and additional web console to monitor events in real-time. 

# How it works

**Add ServerlessSpy construct to your CDK stack, which creates infrastructure to intercept events in Lambda, SNS, SQS, EventBridge, DynamoDB, S3... and send it to a testing library or your local web console via API Gateway websocket. The testing library subscribes to events so tests can be executed fast without checking/retrying if the event has been received. The testing library is integrated with Jest but can also be used with another library. The web console can be used to see and inspect events in real-time.**

![Concept](/doc/concept.svg)

# Main benefits
 - Easy to write tests that are strongly typed thanks to TypesScript ❤️.
 - No need to write tests in a way to periodically check if the process has finished because all events are pushed to the testing library. Tests are executed much FASTER 🏎️💨.
 - Tests can run in parallel if you use conditions and filter events you are specific to your test. This can dramatically drop the time of the CI/CD process.
 - During development, you can see all events in real-time with a web console. Debugging has never been so easy 🕵. You can even use a filter (regular expression supported).


# What ServerlessSpy is not
 - ServerlessSpy can not be used if your infrastructure is not created with CDK. 
 - The solution is meant for development and (automatic) testing environment only. You should **EXCLUDE** ServerlessSpy CDK construct in any other environment, especially production or environment with high load. ServerlessSpy is not meant for those; it just induces costs and could contribute to hitting AWS quotas (Lambda concurrent executions, ...).
 - Only Node.js stack is supported. There are no plans to support Python or any other. Use of TypeScript is deeply encouraged.

# Documentation
 - [Quick Start](doc/quick_start.md)
 - [CDK Construct](doc/CDK_construct.md)
 - [Writing tests](doc/writing_tests.md) 
 - Integrations
   - [Lambda](doc/Lambda.md) 
   - [SQS](doc/SQS.md)
   - [SNS](doc/SNS.md)
   - [EventBridge](doc/EventBridge.md)
   - [DynamoDB](doc/DynamoDB.md)
   - [S3](doc/S3.md)   
   - Kinesis (work in progress)
   - Step Functions (work in progress)
 - [Using Local Web Console](doc/web_console.md)  
 - [Frequently Asked Questions (FAQ)](doc/FAQ.md)  
 - [Sample Application](doc/sample_app.md)   
 - [Roadmap](doc/roadmap.md)   
 - [Code of Conduct](doc/CODE_OF_CONDUCT.md) 
 - [Contributing Guide](doc/CONTRIBUTING.md) 