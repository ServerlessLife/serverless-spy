export interface SpyEvents {
  // DynamoDBDDBTable = "DynamoDB#DDBTable";
  // EventBridgebus = "EventBridge#bus";
  // EventBridgeRulebusbusRule = "EventBridgeRule#bus#busRule";
  // FunctionTestARequest = "Function#TestA#Request";
  // FunctionTestAResponse = "Function#TestA#Response";
  // FunctionTestBRequest = "Function#TestB#Request";
  // FunctionTestBResponse = "Function#TestB#Response";
  // FunctionTestCRequest = "Function#TestC#Request";
  // FunctionTestCResponse = "Function#TestC#Response";
  // FunctionTestDRequest = "Function#TestD#Request";
  // FunctionTestDResponse = "Function#TestD#Response";
  // FunctionTestERequest = "Function#TestE#Request";
  // FunctionTestEResponse = "Function#TestE#Response";
  // S3logs = "S3#logs";
  // SnsSubscriptionTopicNo1QueueNo1 = "SnsSubscription#TopicNo1#QueueNo1";
  // SnsSubscriptionTopicNo1TestB = "SnsSubscription#TopicNo1#TestB";
  // SnsTopicTopicNo1 = "SnsTopic#TopicNo1";
  // SqsQueueNo1 = "Sqs#QueueNo1";
  // SqsQueueNo2 = "Sqs#QueueNo2";

  DynamoDBDDBTable: 'DynamoDB';
  EventBridgebus: 'EventBridge';
  EventBridgeRulebusbusRule: 'EventBridgeRule';
  FunctionTestARequest: 'FunctionRequest';
  FunctionTestAResponse: 'FunctionResponse';
  FunctionTestBRequest: 'FunctionRequest';
  FunctionTestBResponse: 'FunctionResponse';
  FunctionTestCRequest: 'FunctionRequest';
  FunctionTestCResponse: 'FunctionResponse';
  FunctionTestDRequest: 'FunctionRequest';
  FunctionTestDResponse: 'FunctionResponse';
  FunctionTestERequest: 'FunctionRequest';
  FunctionTestEResponse: 'FunctionResponse';
  S3logs: 'S3';
  SnsSubscriptionTopicNo1QueueNo1: 'SnsSubscription';
  SnsSubscriptionTopicNo1TestB: 'SnsSubscription';
  SnsTopicTopicNo1: 'SnsTopic';
  SqsQueueNo1: 'Sqs';
  SqsQueueNo2: 'Sqs';
}

/*
//export const SpyEvents: SpyEventsType = {
//export type SpyEvents = {
export interface SpyEvents extends SpyEventsType {
  DynamoDB: {
    DDBTable: "DynamoDB_DDBTable";
  };
  EventBridgeRule: {
    bus: {
      busRule: "EventBridgeRule_bus_busRule";
    };
  };
  EventBridge: {
    bus: "EventBridge_bus";
  };
  Function: {
    TestA: {
      Request: "Function_TestA_Request";
      Error: "Function_TestA_Error";
      Response: "Function_TestA_Response";
    };
    TestB: {
      Request: "Function_TestB_Request";
      Error: "Function_TestB_Error";
      Response: "Function_TestB_Response";
    };
    TestC: {
      Request: "Function_TestC_Request";
      Error: "Function_TestC_Error";
      Response: "Function_TestC_Response";
    };
    TestD: {
      Request: "Function_TestD_Request";
      Error: "Function_TestD_Error";
      Response: "Function_TestD_Response";
    };
    TestE: {
      Request: "Function_TestE_Request";
      Error: "Function_TestE_Error";
      Response: "Function_TestE_Response";
    };
  };
  S3: {
    logs: "S3_logs";
  };
  SnsSubscription: {
    TopicNo1: {
      QueueNo1: "SnsSubscription_TopicNo1_QueueNo1";
      TestB: "SnsSubscription_TopicNo1_TestB";
    };
  };
  SnsTopic: {
    TopicNo1: "SnsTopic_TopicNo1";
  };
  Sqs: {
    QueueNo1: "Sqs_QueueNo1";
    QueueNo2: "Sqs_QueueNo2";
  };
}
*/
