# Frequently asked questions (FAQ)

## In which environment should ServerlessSpy be used?
 - Development environment: so you can write tests. Web console also helps you with insight into what is happening in the system.
 - Automatic test environment: You execute written tests via CI.

 ## Can ServerlessSpy be used as distributer tracing like XRay, Lumigo, Epsagon...
No. ServerlessSpy can be useful as a developer tool to see events that are happening in the development environment. The main benefit compared to mentioned tools is that you can see events in real-time. But ServerlessSpy does not have near capabilities of those tools, especially not tracing an event through services, which is the main point of distributed tracing.

## What kind of costs does ServerlessSpy induce?
If you are using ServerlessSpy in low traffic environment like dev and test usually are, the const are negligible. For high load environments, like production, you should exclude the ServerlessSpy. It has no use there, and it will just induce costs and could contribute to hitting AWS quotas & limits like Lambda concurrent executions.

## Does ServerlessSpy increase response time?
Negligible, and that's only when hitting Lambda. You should exclude the ServerlessSpy construct in the production environment anyway.

## I do not want a new resource created by ServerlessSpy in my stack.
Additional resources do not harm and do not cause any noticeable costs (in a dev or test environment). But if you still do not want them, you can add them just for the period of executing the test, as some similar libraries do. Just redeploy before executing the tests with SperverlessSpy construct included via parameter and then again redeploy afterward with SperverlessSpy construct excluded.

## I want to use ServerlessSpy in a developer environment that is used by many developers.
The recommended way to develop serverless systems is to have a separate environment for each developer or/and each feature. You can still use ServerlessSpy if you share an environment, but when using the web console, you will see events that other developers trigger. And test events of other tests could interfere with your tests if you do not use conditions that filters events by some unique attribute.

## Why API Gateway and AppSync are not supported
They are, but not directly. API Gateway and AppSync services do not support intercepting events, except via CloudWatch, which is slooooow 🐌🐌🐌. ServerlessSpy needs to be fast. You can intercept those events when they hit other supported services like Lambda.
