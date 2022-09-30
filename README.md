![ServerlessSpy](/logo/full_logo.svg)

# **DECLAREMENT: THE PROJECT IS IN THE DEEP  DEVELOPMENT PHASE AND NOT JET MENT FOR USE.**

CDK-based library for writing integration tests on AWS serverless architecture and web console to monitor events in real-time.

# How it works

**Add ServerlessSpy construct to your CDK stack, which creates infrastructure to intercept events in Lambda, SNS, SQS, EventBridge, DynamoDB... and send it to a testing library or your local web console via API Gateway websocket. The testing library subscribes to events so tests can be executed fast without checking/retrying if the event has been received. The testing library is integrated with Jest but can also be used with another library. The web console can be used to see and inspect events in real-time.**

![Concept](/doc/concept.svg)


# What is not
 - ServerlessSpy can not be used if your infrastructure is not created with CDK. 
 - The solution is meant for development and (automatic) testing environment only. You should **EXCLUDE**  ServerlessSpy CDK construct in any other environment, especially production or high load. ServerlessSpy is not meant for those environments; it just induces costs and could contribute to hitting AWS quotas (Lambda concurrent executions, ...).

# Documentation
 - [Quick start](doc/quick_start.md)
 - [Writing tests](doc/writing_tests.md)
 - Integrations
   - [Lambda](doc/lambda.md) 
   - [SQS](doc/SQS.md)
   - [SNS](doc/SNS.md)
   - [EventBridge](doc/eventBridge.md)
   - [DynamoDB](doc/DynamoDB.md)
 - [Using web console](doc/web_console.md) 
 - [Code of Conduct](doc/CODE_OF_CONDUCT.md) 
 - [Contributing Guide](doc/CONTRIBUTING.md) 