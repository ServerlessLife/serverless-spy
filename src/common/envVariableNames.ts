//this file is not under root -> common folder because jsii does not allow
//changing tsconfing.json to remove rootDir property

export enum envVariableNames {
  /**
   * Note that the function is subscribed to SQS, so we need to send spy events as it comes from SQS.
   */
  SSPY_SUBSCRIBED_TO_SQS = 'SSPY_SUBSCRIBED_TO_SQS',

  /**
   * Mapping of resource ARNs to service keys
   */
  SSPY_INFRA_MAPPING = 'SSPY_INFRA_MAPPING',

  /**
   * Web socket endpoint for sending and receiving spy events.
   */
  SSPY_WS_ENDPOINT = 'SSPY_WS_ENDPOINT',

  SSPY_FUNCTION_NAME = 'SSPY_FUNCTION_NAME',

  /**
   * DynamoDB table name that stores active websocket connections.
   */
  SSPY_WS_TABLE_NAME = 'SSPY_WS_TABLE_NAME',

  /**
   * Log debugging details.
   */
  SSPY_DEBUG = 'SSPY_DEBUG',

  /**
   * The root stack
   */
  SSPY_ROOT_STACK = 'SSPY_ROOT_STACK',
}
