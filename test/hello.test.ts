import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { ServerlessSpy } from '..';

const mockApp = new App();
const stack = new Stack(mockApp);
new ServerlessSpy(stack, 'testing-stack');
const template = Template.fromStack(stack);

test('hello', () => {
  console.log('OK');
  template.hasResourceProperties('AWS::Lambda::Function', {
    Runtime: 'nodejs16.x',
  });

  // template.hasResourceProperties('AWS::IAM::Role', {
  //   AssumeRolePolicyDocument: {
  //     Statement: [
  //       {
  //         Action: 'sts:AssumeRole',
  //         Effect: 'Allow',
  //         Principal: {
  //           Service: 'lambda.amazonaws.com',
  //         },
  //       },
  //     ],
  //     Version: '2012-10-17',
  //   },
  // });
});
