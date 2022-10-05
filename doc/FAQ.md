# Frequently asked questions (FAQ)

## In which environment should ServerlessSpy be used?
 - Development environment: So you can write tests. The web console helps you gain insight into what is happening in the system.
 - Automatic test environment: You execute written tests in CI/CD.

## Can ServerlessSpy be used as distributer tracing like XRay, Lumigo, Epsagon...
No. ServerlessSpy can be useful as a developer tool to see events that are occurring in the development environment. The main benefit compared to mentioned tools is that you can see events in real time. But ServerlessSpy does not have near capabilities of those tools, especially not tracing an event through services, which is the main point of distributed tracing.

## What kind of costs does ServerlessSpy induce?
If you are using ServerlessSpy in a low-traffic environment like dev and test usually are, the costs are negligible. For high-load environments, like production, you should exclude ServerlessSpy. It has no use there, and it will just induce costs and could contribute to hitting AWS quotas & limits like Lambda concurrent executions.

## Does ServerlessSpy increase response time?
Negligible, and that's only when hitting Lambda. You should exclude the ServerlessSpy construct in the production environment anyway.

## I do not want a new resource created by ServerlessSpy in my stack.
Additional resources do not harm and do not cause any noticeable costs (in a dev or test environment). But if you still do not want them, you can add them just for the period of executing the test. Some similar testing libraries do that out of the box. Just redeploy before executing the tests with ServerlessSpy construct included via parameter and then again redeploy afterward with ServerlessSpy construct excluded.

## I want to use ServerlessSpy in a developer environment that is used by many developers.
The recommended way to develop serverless systems is to have a separate environment for each developer or/and each feature. You can still use ServerlessSpy if you share an environment, although discouraged. In the web console, you will see events that other developers triggered. And those events could also interfere with your tests if you do not use conditions that filter events by some unique attribute.

## Why are API Gateway and AppSync not supported?
They are, but not directly. API Gateway and AppSync services do not support intercepting events, except via CloudWatch, which is slooooow 🐌🐌🐌. ServerlessSpy needs to be fast. You can intercept those events when they hit other supported services like Lambda.
