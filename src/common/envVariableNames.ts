//this file is not under root -> common folder because jsii does not allow
//changing tsconfing.json to remove rootDir property

export enum envVariableNames {
  FLUENT_TEST_SUBSCRIBED_TO_SQS = 'FLUENT_TEST_SUBSCRIBED_TO_SQS',
  INFRA_MAPPING = 'INFRA_MAPPING',
  WS_ENDPOINT = 'WS_ENDPOINT',
  FUNCTION_NAME = 'FUNCTION_NAME',
  FLUENT_TEST_SEND_FUNCTION_NAME = 'FLUENT_TEST_SEND_FUNCTION_NAME',
}
