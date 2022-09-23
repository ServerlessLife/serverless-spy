export const sampleData = [
  {
    timestamp: '2022-09-20T09:46:04.610Z',
    serviceKey: 'Function#ToSnsAndDynamoDb#Request',
    data: {
      request: { id: '057f544b-7f90-496c-8006-3043dec54620', message: 'Hello' },
      context: {
        functionName: 'ServerlessSpyE2e-ToSnsAndDynamoDb13696817-sagu3HTK25K6',
        awsRequestId: 'ba4d4569-416a-407b-9842-0ee38a83b97c',
      },
    },
  },
  {
    timestamp: '2022-09-20T09:46:04.674Z',
    serviceKey: 'Function#ToSnsAndDynamoDb#Response',
    data: {
      request: { id: '057f544b-7f90-496c-8006-3043dec54620', message: 'Hello' },
      response: {
        id: '057f544b-7f90-496c-8006-3043dec54620',
        message: 'Hello',
      },
      context: {
        functionName: 'ServerlessSpyE2e-ToSnsAndDynamoDb13696817-sagu3HTK25K6',
        awsRequestId: 'ba4d4569-416a-407b-9842-0ee38a83b97c',
      },
    },
  },
  {
    timestamp: '2022-09-20T09:46:04.751Z',
    serviceKey: 'Function#ReceiveSqs#Response',
    data: {
      request: {
        Records: [
          {
            messageId: 'b1dd1d88-0560-43de-a406-394ca4bb7cec',
            receiptHandle:
              'AQEBivlgjdhylhmB95VJL1K1OGeZpzOmbZAiaNUT/EnlDN/Bmlo7o/Aby9zveOanusGVdsBwF5VAbQEPc17y1sNa/mA3gN54I13/vm9K0rmLlmMG77yp4e/VhbK9qx8xG+w87JCDC1iw8alEea+zqiBqWFalEUL0SAT8lkkS/plq4AA1B40ytuVZm4HGnTc+4SltCFmmbxFMDblSZ5fzQ6jyQAnh8Hb5kDQTwbKu7eRI14XvNC39tlb1kGGYHQa7jOqC6KAjqozwTeZjcEgUzjNoqyqzNXL4lWpucxO/YgFEqi7aRiPQZZO2UY9mgWPgNp17P5LGOu4Kh48hFs6vvfQMkqAOskN3KWzj9o/N4QC3pvKRE3r9cFgYh6UdwQwBI/P7c+QBBqt1JG89DklJBobmzcLjI+agJaP5RWb6tBwhOzCC3CbOwqfr/myLfcPF3ZZj',
            body: '{\n  "Type" : "Notification",\n  "MessageId" : "f2a02b45-0ecb-566c-9616-70e680d73f8c",\n  "TopicArn" : "arn:aws:sns:eu-west-1:123456789012:ServerlessSpyE2e-MyTopicNo10D152776-7m3nZGQCdxUF",\n  "Message" : "{\\"id\\":\\"057f544b-7f90-496c-8006-3043dec54620\\",\\"message\\":\\"Hello\\"}",\n  "Timestamp" : "2022-09-20T09:46:04.607Z",\n  "SignatureVersion" : "1",\n  "Signature" : "dB6sX7MUHevj080Rr0k08FT2sVUbA/osH6AFznOb+sva3Z7xJ0vzQh2brpy2tiBsiuAliYeJGc1GZxjmL1HCN4QiytiBzfdX71KeiSgeC8p4gW5lbrNpcyzHTOJSxOrBDfdxoh5JRZK6DymFrlmbC8pc0Y7y+4a2cCMUwjk4MnxG4a6H0uqVvVfnl7l6T4GzGTFkLjdqKNU8DNg+b7TPgs2mmlMivPAP1oYsrlBgUgmBLmfKfgr5BwngA+c4cIAi3fT89aWqUStY4P/tT/xPVRb2vyykenwFcoEPuautieXFXjAFg64N9JtNyxqRKL5XxnYl8mMmZsc7assV342d/g==",\n  "SigningCertURL" : "https://sns.eu-west-1.amazonaws.com/SimpleNotificationService-56e67fcb41f6fec09b0196692625d385.pem",\n  "UnsubscribeURL" : "https://sns.eu-west-1.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:eu-west-1:123456789012:ServerlessSpyE2e-MyTopicNo10D152776-7m3nZGQCdxUF:ecf2a422-1e24-4a64-9f6d-715d91ae36d6",\n  "MessageAttributes" : {\n    "test" : {"Type":"String","Value":"test"}\n  }\n}',
            attributes: {
              ApproximateReceiveCount: '1',
              AWSTraceHeader:
                'Root=1-63298bdc-40943faf493e196b4e07459c;Parent=24c04ec26b26310a;Sampled=0',
              SentTimestamp: '1663667164636',
              SenderId: 'AIDAISMY7JYY5F7RTT6AO',
              ApproximateFirstReceiveTimestamp: '1663667164641',
            },
            messageAttributes: {},
            md5OfBody: 'af6bd3f6989ac11fa4a33798c0cf87cc',
            eventSource: 'aws:sqs',
            eventSourceARN:
              'arn:aws:sqs:eu-west-1:123456789012:ServerlessSpyE2e-MyQueueNo154EF6659-jvYNz1YlvYdQ',
            awsRegion: 'eu-west-1',
          },
        ],
      },
      response: {
        Records: [
          {
            messageId: 'b1dd1d88-0560-43de-a406-394ca4bb7cec',
            receiptHandle:
              'AQEBivlgjdhylhmB95VJL1K1OGeZpzOmbZAiaNUT/EnlDN/Bmlo7o/Aby9zveOanusGVdsBwF5VAbQEPc17y1sNa/mA3gN54I13/vm9K0rmLlmMG77yp4e/VhbK9qx8xG+w87JCDC1iw8alEea+zqiBqWFalEUL0SAT8lkkS/plq4AA1B40ytuVZm4HGnTc+4SltCFmmbxFMDblSZ5fzQ6jyQAnh8Hb5kDQTwbKu7eRI14XvNC39tlb1kGGYHQa7jOqC6KAjqozwTeZjcEgUzjNoqyqzNXL4lWpucxO/YgFEqi7aRiPQZZO2UY9mgWPgNp17P5LGOu4Kh48hFs6vvfQMkqAOskN3KWzj9o/N4QC3pvKRE3r9cFgYh6UdwQwBI/P7c+QBBqt1JG89DklJBobmzcLjI+agJaP5RWb6tBwhOzCC3CbOwqfr/myLfcPF3ZZj',
            body: '{\n  "Type" : "Notification",\n  "MessageId" : "f2a02b45-0ecb-566c-9616-70e680d73f8c",\n  "TopicArn" : "arn:aws:sns:eu-west-1:123456789012:ServerlessSpyE2e-MyTopicNo10D152776-7m3nZGQCdxUF",\n  "Message" : "{\\"id\\":\\"057f544b-7f90-496c-8006-3043dec54620\\",\\"message\\":\\"Hello\\"}",\n  "Timestamp" : "2022-09-20T09:46:04.607Z",\n  "SignatureVersion" : "1",\n  "Signature" : "dB6sX7MUHevj080Rr0k08FT2sVUbA/osH6AFznOb+sva3Z7xJ0vzQh2brpy2tiBsiuAliYeJGc1GZxjmL1HCN4QiytiBzfdX71KeiSgeC8p4gW5lbrNpcyzHTOJSxOrBDfdxoh5JRZK6DymFrlmbC8pc0Y7y+4a2cCMUwjk4MnxG4a6H0uqVvVfnl7l6T4GzGTFkLjdqKNU8DNg+b7TPgs2mmlMivPAP1oYsrlBgUgmBLmfKfgr5BwngA+c4cIAi3fT89aWqUStY4P/tT/xPVRb2vyykenwFcoEPuautieXFXjAFg64N9JtNyxqRKL5XxnYl8mMmZsc7assV342d/g==",\n  "SigningCertURL" : "https://sns.eu-west-1.amazonaws.com/SimpleNotificationService-56e67fcb41f6fec09b0196692625d385.pem",\n  "UnsubscribeURL" : "https://sns.eu-west-1.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:eu-west-1:123456789012:ServerlessSpyE2e-MyTopicNo10D152776-7m3nZGQCdxUF:ecf2a422-1e24-4a64-9f6d-715d91ae36d6",\n  "MessageAttributes" : {\n    "test" : {"Type":"String","Value":"test"}\n  }\n}',
            attributes: {
              ApproximateReceiveCount: '1',
              AWSTraceHeader:
                'Root=1-63298bdc-40943faf493e196b4e07459c;Parent=24c04ec26b26310a;Sampled=0',
              SentTimestamp: '1663667164636',
              SenderId: 'AIDAISMY7JYY5F7RTT6AO',
              ApproximateFirstReceiveTimestamp: '1663667164641',
            },
            messageAttributes: {},
            md5OfBody: 'af6bd3f6989ac11fa4a33798c0cf87cc',
            eventSource: 'aws:sqs',
            eventSourceARN:
              'arn:aws:sqs:eu-west-1:123456789012:ServerlessSpyE2e-MyQueueNo154EF6659-jvYNz1YlvYdQ',
            awsRegion: 'eu-west-1',
          },
        ],
      },
      context: {
        functionName: 'ServerlessSpyE2e-ReceiveSqs09F03F56-XeqiZ0cUjJl4',
        awsRequestId: '23672a4d-68be-5ad1-a139-71eee6b20c4c',
      },
    },
  },
  {
    timestamp: '2022-09-20T09:46:04.755Z',
    serviceKey: 'Function#ReceiveSqs#Request',
    data: {
      request: {
        Records: [
          {
            messageId: 'b1dd1d88-0560-43de-a406-394ca4bb7cec',
            receiptHandle:
              'AQEBivlgjdhylhmB95VJL1K1OGeZpzOmbZAiaNUT/EnlDN/Bmlo7o/Aby9zveOanusGVdsBwF5VAbQEPc17y1sNa/mA3gN54I13/vm9K0rmLlmMG77yp4e/VhbK9qx8xG+w87JCDC1iw8alEea+zqiBqWFalEUL0SAT8lkkS/plq4AA1B40ytuVZm4HGnTc+4SltCFmmbxFMDblSZ5fzQ6jyQAnh8Hb5kDQTwbKu7eRI14XvNC39tlb1kGGYHQa7jOqC6KAjqozwTeZjcEgUzjNoqyqzNXL4lWpucxO/YgFEqi7aRiPQZZO2UY9mgWPgNp17P5LGOu4Kh48hFs6vvfQMkqAOskN3KWzj9o/N4QC3pvKRE3r9cFgYh6UdwQwBI/P7c+QBBqt1JG89DklJBobmzcLjI+agJaP5RWb6tBwhOzCC3CbOwqfr/myLfcPF3ZZj',
            body: '{\n  "Type" : "Notification",\n  "MessageId" : "f2a02b45-0ecb-566c-9616-70e680d73f8c",\n  "TopicArn" : "arn:aws:sns:eu-west-1:123456789012:ServerlessSpyE2e-MyTopicNo10D152776-7m3nZGQCdxUF",\n  "Message" : "{\\"id\\":\\"057f544b-7f90-496c-8006-3043dec54620\\",\\"message\\":\\"Hello\\"}",\n  "Timestamp" : "2022-09-20T09:46:04.607Z",\n  "SignatureVersion" : "1",\n  "Signature" : "dB6sX7MUHevj080Rr0k08FT2sVUbA/osH6AFznOb+sva3Z7xJ0vzQh2brpy2tiBsiuAliYeJGc1GZxjmL1HCN4QiytiBzfdX71KeiSgeC8p4gW5lbrNpcyzHTOJSxOrBDfdxoh5JRZK6DymFrlmbC8pc0Y7y+4a2cCMUwjk4MnxG4a6H0uqVvVfnl7l6T4GzGTFkLjdqKNU8DNg+b7TPgs2mmlMivPAP1oYsrlBgUgmBLmfKfgr5BwngA+c4cIAi3fT89aWqUStY4P/tT/xPVRb2vyykenwFcoEPuautieXFXjAFg64N9JtNyxqRKL5XxnYl8mMmZsc7assV342d/g==",\n  "SigningCertURL" : "https://sns.eu-west-1.amazonaws.com/SimpleNotificationService-56e67fcb41f6fec09b0196692625d385.pem",\n  "UnsubscribeURL" : "https://sns.eu-west-1.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:eu-west-1:123456789012:ServerlessSpyE2e-MyTopicNo10D152776-7m3nZGQCdxUF:ecf2a422-1e24-4a64-9f6d-715d91ae36d6",\n  "MessageAttributes" : {\n    "test" : {"Type":"String","Value":"test"}\n  }\n}',
            attributes: {
              ApproximateReceiveCount: '1',
              AWSTraceHeader:
                'Root=1-63298bdc-40943faf493e196b4e07459c;Parent=24c04ec26b26310a;Sampled=0',
              SentTimestamp: '1663667164636',
              SenderId: 'AIDAISMY7JYY5F7RTT6AO',
              ApproximateFirstReceiveTimestamp: '1663667164641',
            },
            messageAttributes: {},
            md5OfBody: 'af6bd3f6989ac11fa4a33798c0cf87cc',
            eventSource: 'aws:sqs',
            eventSourceARN:
              'arn:aws:sqs:eu-west-1:123456789012:ServerlessSpyE2e-MyQueueNo154EF6659-jvYNz1YlvYdQ',
            awsRegion: 'eu-west-1',
          },
        ],
      },
      context: {
        functionName: 'ServerlessSpyE2e-ReceiveSqs09F03F56-XeqiZ0cUjJl4',
        awsRequestId: '23672a4d-68be-5ad1-a139-71eee6b20c4c',
      },
    },
  },
  {
    timestamp: '2022-09-20T09:46:04.800Z',
    serviceKey: 'SnsSubscription#MyTopicNo1#MyQueueNo1',
    data: {
      spyEventType: 'SnsSubscription',
      message: { id: '057f544b-7f90-496c-8006-3043dec54620', message: 'Hello' },
      subject: null,
      timestamp: '2022-09-20T09:46:04.607Z',
      topicArn:
        'arn:aws:sns:eu-west-1:123456789012:ServerlessSpyE2e-MyTopicNo10D152776-7m3nZGQCdxUF',
      messageId: 'f2a02b45-0ecb-566c-9616-70e680d73f8c',
      messageAttributes: { test: { Type: 'String', Value: 'test' } },
    },
  },
  {
    timestamp: '2022-09-20T09:46:04.802Z',
    serviceKey: 'SnsTopic#MyTopicNo1',
    data: {
      spyEventType: 'SnsTopic',
      message: { id: '057f544b-7f90-496c-8006-3043dec54620', message: 'Hello' },
      subject: null,
      timestamp: '2022-09-20T09:46:04.607Z',
      topicArn:
        'arn:aws:sns:eu-west-1:123456789012:ServerlessSpyE2e-MyTopicNo10D152776-7m3nZGQCdxUF',
      messageId: 'f2a02b45-0ecb-566c-9616-70e680d73f8c',
      messageAttributes: { test: { Type: 'String', Value: 'test' } },
    },
  },
  {
    timestamp: '2022-09-20T09:46:04.771Z',
    serviceKey: 'Sqs#MyQueueNo1',
    data: {
      spyEventType: 'Sqs',
      body: {
        Type: 'Notification',
        MessageId: 'f2a02b45-0ecb-566c-9616-70e680d73f8c',
        TopicArn:
          'arn:aws:sns:eu-west-1:123456789012:ServerlessSpyE2e-MyTopicNo10D152776-7m3nZGQCdxUF',
        Message:
          '{"id":"057f544b-7f90-496c-8006-3043dec54620","message":"Hello"}',
        Timestamp: '2022-09-20T09:46:04.607Z',
        SignatureVersion: '1',
        Signature:
          'dB6sX7MUHevj080Rr0k08FT2sVUbA/osH6AFznOb+sva3Z7xJ0vzQh2brpy2tiBsiuAliYeJGc1GZxjmL1HCN4QiytiBzfdX71KeiSgeC8p4gW5lbrNpcyzHTOJSxOrBDfdxoh5JRZK6DymFrlmbC8pc0Y7y+4a2cCMUwjk4MnxG4a6H0uqVvVfnl7l6T4GzGTFkLjdqKNU8DNg+b7TPgs2mmlMivPAP1oYsrlBgUgmBLmfKfgr5BwngA+c4cIAi3fT89aWqUStY4P/tT/xPVRb2vyykenwFcoEPuautieXFXjAFg64N9JtNyxqRKL5XxnYl8mMmZsc7assV342d/g==',
        SigningCertURL:
          'https://sns.eu-west-1.amazonaws.com/SimpleNotificationService-56e67fcb41f6fec09b0196692625d385.pem',
        UnsubscribeURL:
          'https://sns.eu-west-1.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:eu-west-1:123456789012:ServerlessSpyE2e-MyTopicNo10D152776-7m3nZGQCdxUF:ecf2a422-1e24-4a64-9f6d-715d91ae36d6',
        MessageAttributes: { test: { Type: 'String', Value: 'test' } },
      },
      messageAttributes: {},
    },
  },
  {
    timestamp: '2022-09-20T09:46:04.808Z',
    serviceKey: 'SnsSubscription#MyTopicNo1#FromSnsToSqsAndS3',
    data: {
      spyEventType: 'SnsSubscription',
      message: { id: '057f544b-7f90-496c-8006-3043dec54620', message: 'Hello' },
      subject: null,
      timestamp: '2022-09-20T09:46:04.607Z',
      topicArn:
        'arn:aws:sns:eu-west-1:123456789012:ServerlessSpyE2e-MyTopicNo10D152776-7m3nZGQCdxUF',
      messageId: 'f2a02b45-0ecb-566c-9616-70e680d73f8c',
      messageAttributes: { test: { Type: 'String', Value: 'test' } },
    },
  },
  {
    timestamp: '2022-09-20T09:46:04.903Z',
    serviceKey: 'Function#FromSnsToSqsAndS3#Request',
    data: {
      request: {
        Records: [
          {
            EventSource: 'aws:sns',
            EventVersion: '1.0',
            EventSubscriptionArn:
              'arn:aws:sns:eu-west-1:123456789012:ServerlessSpyE2e-MyTopicNo10D152776-7m3nZGQCdxUF:29430bee-0503-4b1f-8c7e-3a115b049679',
            Sns: {
              Type: 'Notification',
              MessageId: 'f2a02b45-0ecb-566c-9616-70e680d73f8c',
              TopicArn:
                'arn:aws:sns:eu-west-1:123456789012:ServerlessSpyE2e-MyTopicNo10D152776-7m3nZGQCdxUF',
              Subject: null,
              Message:
                '{"id":"057f544b-7f90-496c-8006-3043dec54620","message":"Hello"}',
              Timestamp: '2022-09-20T09:46:04.607Z',
              SignatureVersion: '1',
              Signature:
                'dB6sX7MUHevj080Rr0k08FT2sVUbA/osH6AFznOb+sva3Z7xJ0vzQh2brpy2tiBsiuAliYeJGc1GZxjmL1HCN4QiytiBzfdX71KeiSgeC8p4gW5lbrNpcyzHTOJSxOrBDfdxoh5JRZK6DymFrlmbC8pc0Y7y+4a2cCMUwjk4MnxG4a6H0uqVvVfnl7l6T4GzGTFkLjdqKNU8DNg+b7TPgs2mmlMivPAP1oYsrlBgUgmBLmfKfgr5BwngA+c4cIAi3fT89aWqUStY4P/tT/xPVRb2vyykenwFcoEPuautieXFXjAFg64N9JtNyxqRKL5XxnYl8mMmZsc7assV342d/g==',
              SigningCertUrl:
                'https://sns.eu-west-1.amazonaws.com/SimpleNotificationService-56e67fcb41f6fec09b0196692625d385.pem',
              UnsubscribeUrl:
                'https://sns.eu-west-1.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:eu-west-1:123456789012:ServerlessSpyE2e-MyTopicNo10D152776-7m3nZGQCdxUF:29430bee-0503-4b1f-8c7e-3a115b049679',
              MessageAttributes: { test: { Type: 'String', Value: 'test' } },
            },
          },
        ],
      },
      context: {
        functionName: 'ServerlessSpyE2e-FromSnsToSqsAndS3DD1CDB48-mT1kC5fqYXBj',
        awsRequestId: '9323981d-674b-427e-b639-4cc26158c69f',
      },
    },
  },
  {
    timestamp: '2022-09-20T09:46:04.942Z',
    serviceKey: 'Function#FromSnsToSqsAndS3#Response',
    data: {
      request: {
        Records: [
          {
            EventSource: 'aws:sns',
            EventVersion: '1.0',
            EventSubscriptionArn:
              'arn:aws:sns:eu-west-1:123456789012:ServerlessSpyE2e-MyTopicNo10D152776-7m3nZGQCdxUF:29430bee-0503-4b1f-8c7e-3a115b049679',
            Sns: {
              Type: 'Notification',
              MessageId: 'f2a02b45-0ecb-566c-9616-70e680d73f8c',
              TopicArn:
                'arn:aws:sns:eu-west-1:123456789012:ServerlessSpyE2e-MyTopicNo10D152776-7m3nZGQCdxUF',
              Subject: null,
              Message:
                '{"id":"057f544b-7f90-496c-8006-3043dec54620","message":"Hello"}',
              Timestamp: '2022-09-20T09:46:04.607Z',
              SignatureVersion: '1',
              Signature:
                'dB6sX7MUHevj080Rr0k08FT2sVUbA/osH6AFznOb+sva3Z7xJ0vzQh2brpy2tiBsiuAliYeJGc1GZxjmL1HCN4QiytiBzfdX71KeiSgeC8p4gW5lbrNpcyzHTOJSxOrBDfdxoh5JRZK6DymFrlmbC8pc0Y7y+4a2cCMUwjk4MnxG4a6H0uqVvVfnl7l6T4GzGTFkLjdqKNU8DNg+b7TPgs2mmlMivPAP1oYsrlBgUgmBLmfKfgr5BwngA+c4cIAi3fT89aWqUStY4P/tT/xPVRb2vyykenwFcoEPuautieXFXjAFg64N9JtNyxqRKL5XxnYl8mMmZsc7assV342d/g==',
              SigningCertUrl:
                'https://sns.eu-west-1.amazonaws.com/SimpleNotificationService-56e67fcb41f6fec09b0196692625d385.pem',
              UnsubscribeUrl:
                'https://sns.eu-west-1.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:eu-west-1:123456789012:ServerlessSpyE2e-MyTopicNo10D152776-7m3nZGQCdxUF:29430bee-0503-4b1f-8c7e-3a115b049679',
              MessageAttributes: { test: { Type: 'String', Value: 'test' } },
            },
          },
        ],
      },
      response: { message: 'Hello undefined' },
      context: {
        functionName: 'ServerlessSpyE2e-FromSnsToSqsAndS3DD1CDB48-mT1kC5fqYXBj',
        awsRequestId: '9323981d-674b-427e-b639-4cc26158c69f',
      },
    },
  },
  {
    timestamp: '2022-09-20T09:46:05.088Z',
    serviceKey: 'Sqs#MyQueueNo2',
    data: {
      spyEventType: 'Sqs',
      body: { id: '057f544b-7f90-496c-8006-3043dec54620', message: 'Hello' },
      messageAttributes: {
        WeeksOn: {
          stringValue: '6',
          stringListValues: [],
          binaryListValues: [],
          dataType: 'Number',
        },
        Author: {
          stringValue: 'John Grisham',
          stringListValues: [],
          binaryListValues: [],
          dataType: 'String',
        },
        Title: {
          stringValue: 'The Whistler',
          stringListValues: [],
          binaryListValues: [],
          dataType: 'String',
        },
      },
    },
  },
  {
    timestamp: '2022-09-20T09:46:05.107Z',
    serviceKey: 'Function#FromSqsToEventBridge#Request',
    data: {
      request: {
        Records: [
          {
            messageId: '6297232e-203b-4776-a811-c5816ee24404',
            receiptHandle:
              'AQEBNeroB8TFlND6RVnj+vUPAqep/xWY4u7EI4tJURkfPfQPFWmW3g7OtbxLbYXwPVie0ccukt7QP6VB8sFjwSA/oPc3W1pcydJn19GFfrNDeXtZJUPwolV6Ng6D/5Kq9YGBm4G5cnRPg8OXlVZTwjPp4atFRrNh2BSIe2dTURJNK7Okdz+gza5JWwZ/6Lbjw61NAJuMiqCw7ZjN1n3KYvD/cT0DcOWUCnZRoiovYw7mQ+hbm5Vas1WArdF31o6TukwYuA0begjbAbje+udaVjOW6ThjLyvOTWsoxg0CfbVZK4ZaWYWgd7xyd8WOGf1QOKVNMv9elCQi0olC5MAMv/f9B3Kudd6l1RIiQIKaj0LZjf7pn3wsv3TPc85Z+9p3k9hSc++zSsPxN9g8hymZW/rviQlRTzEqSPggJvBr9/nzKcAn3+w20zxquodAJnlobRCY',
            body: '{"id":"057f544b-7f90-496c-8006-3043dec54620","message":"Hello"}',
            attributes: {
              ApproximateReceiveCount: '1',
              AWSTraceHeader:
                'Root=1-63298bdc-40943faf493e196b4e07459c;Parent=34ad705e0750956d;Sampled=0',
              SentTimestamp: '1663667164855',
              SenderId:
                'AROARDVHBDXRVFXDSOJAT:ServerlessSpyE2e-FromSnsToSqsAndS3DD1CDB48-mT1kC5fqYXBj',
              ApproximateFirstReceiveTimestamp: '1663667164856',
            },
            messageAttributes: {
              WeeksOn: {
                stringValue: '6',
                stringListValues: [],
                binaryListValues: [],
                dataType: 'Number',
              },
              Author: {
                stringValue: 'John Grisham',
                stringListValues: [],
                binaryListValues: [],
                dataType: 'String',
              },
              Title: {
                stringValue: 'The Whistler',
                stringListValues: [],
                binaryListValues: [],
                dataType: 'String',
              },
            },
            md5OfMessageAttributes: 'd25a6aea97eb8f585bfa92d314504a92',
            md5OfBody: 'c64b00e6b5eb62c5f39cf4e7b1f4bbd7',
            eventSource: 'aws:sqs',
            eventSourceARN:
              'arn:aws:sqs:eu-west-1:123456789012:ServerlessSpyE2e-MyQueueNo27A959A93-MwJqK7Urit97',
            awsRegion: 'eu-west-1',
          },
        ],
      },
      context: {
        functionName:
          'ServerlessSpyE2e-FromSqsToEventBridgeE78842BE-VAz1SGd6qaR6',
        awsRequestId: 'e0868330-80ce-59a7-8d77-d8930ec34d78',
      },
    },
  },
  {
    timestamp: '2022-09-20T09:46:05.131Z',
    serviceKey: 'Function#FromSqsToEventBridge#Response',
    data: {
      request: {
        Records: [
          {
            messageId: '6297232e-203b-4776-a811-c5816ee24404',
            receiptHandle:
              'AQEBNeroB8TFlND6RVnj+vUPAqep/xWY4u7EI4tJURkfPfQPFWmW3g7OtbxLbYXwPVie0ccukt7QP6VB8sFjwSA/oPc3W1pcydJn19GFfrNDeXtZJUPwolV6Ng6D/5Kq9YGBm4G5cnRPg8OXlVZTwjPp4atFRrNh2BSIe2dTURJNK7Okdz+gza5JWwZ/6Lbjw61NAJuMiqCw7ZjN1n3KYvD/cT0DcOWUCnZRoiovYw7mQ+hbm5Vas1WArdF31o6TukwYuA0begjbAbje+udaVjOW6ThjLyvOTWsoxg0CfbVZK4ZaWYWgd7xyd8WOGf1QOKVNMv9elCQi0olC5MAMv/f9B3Kudd6l1RIiQIKaj0LZjf7pn3wsv3TPc85Z+9p3k9hSc++zSsPxN9g8hymZW/rviQlRTzEqSPggJvBr9/nzKcAn3+w20zxquodAJnlobRCY',
            body: '{"id":"057f544b-7f90-496c-8006-3043dec54620","message":"Hello"}',
            attributes: {
              ApproximateReceiveCount: '1',
              AWSTraceHeader:
                'Root=1-63298bdc-40943faf493e196b4e07459c;Parent=34ad705e0750956d;Sampled=0',
              SentTimestamp: '1663667164855',
              SenderId:
                'AROARDVHBDXRVFXDSOJAT:ServerlessSpyE2e-FromSnsToSqsAndS3DD1CDB48-mT1kC5fqYXBj',
              ApproximateFirstReceiveTimestamp: '1663667164856',
            },
            messageAttributes: {
              WeeksOn: {
                stringValue: '6',
                stringListValues: [],
                binaryListValues: [],
                dataType: 'Number',
              },
              Author: {
                stringValue: 'John Grisham',
                stringListValues: [],
                binaryListValues: [],
                dataType: 'String',
              },
              Title: {
                stringValue: 'The Whistler',
                stringListValues: [],
                binaryListValues: [],
                dataType: 'String',
              },
            },
            md5OfMessageAttributes: 'd25a6aea97eb8f585bfa92d314504a92',
            md5OfBody: 'c64b00e6b5eb62c5f39cf4e7b1f4bbd7',
            eventSource: 'aws:sqs',
            eventSourceARN:
              'arn:aws:sqs:eu-west-1:123456789012:ServerlessSpyE2e-MyQueueNo27A959A93-MwJqK7Urit97',
            awsRegion: 'eu-west-1',
          },
        ],
      },
      response: { message: 'Hello undefined' },
      context: {
        functionName:
          'ServerlessSpyE2e-FromSqsToEventBridgeE78842BE-VAz1SGd6qaR6',
        awsRequestId: 'e0868330-80ce-59a7-8d77-d8930ec34d78',
      },
    },
  },
  {
    timestamp: '2022-09-20T09:46:05.319Z',
    serviceKey: 'EventBridgeRule#MyEventBus#MyEventBridge',
    data: {
      spyEventType: 'EventBridgeRule',
      detail: { id: '057f544b-7f90-496c-8006-3043dec54620', message: 'Hello' },
      detailType: 'test',
      source: 'test-source',
      time: '2022-09-20T09:46:05Z',
      account: '123456789012',
    },
  },
  {
    timestamp: '2022-09-20T09:46:05.379Z',
    serviceKey: 'EventBridge#MyEventBus',
    data: {
      spyEventType: 'EventBridge',
      detail: { id: '057f544b-7f90-496c-8006-3043dec54620', message: 'Hello' },
      detailType: 'test',
      source: 'test-source',
      time: '2022-09-20T09:46:05Z',
      account: '123456789012',
    },
  },
  {
    timestamp: '2022-09-20T09:46:05.504Z',
    serviceKey: 'Function#ReceiveEventBridge#Request',
    data: {
      request: {
        version: '0',
        id: '33549074-e48f-2857-f67c-263c621cde5c',
        'detail-type': 'test',
        source: 'test-source',
        account: '123456789012',
        time: '2022-09-20T09:46:05Z',
        region: 'eu-west-1',
        resources: [],
        detail: {
          id: '057f544b-7f90-496c-8006-3043dec54620',
          message: 'Hello',
        },
      },
      context: {
        functionName:
          'ServerlessSpyE2e-ReceiveEventBridge1A8F9A7B-1x4KLKDymCCn',
        awsRequestId: '32814437-2efb-4384-9cb5-a04ac9639345',
      },
    },
  },
  {
    timestamp: '2022-09-20T09:46:05.543Z',
    serviceKey: 'DynamoDB#MyTable',
    data: {
      spyEventType: 'DynamoDB',
      eventName: 'INSERT',
      newImage: {
        id: '057f544b-7f90-496c-8006-3043dec54620',
        pk: '057f544b-7f90-496c-8006-3043dec54620',
        message: 'Hello',
      },
      keys: { pk: '057f544b-7f90-496c-8006-3043dec54620' },
    },
  },
  {
    timestamp: '2022-09-20T09:46:05.541Z',
    serviceKey: 'Function#ReceiveEventBridge#Response',
    data: {
      request: {
        version: '0',
        id: '33549074-e48f-2857-f67c-263c621cde5c',
        'detail-type': 'test',
        source: 'test-source',
        account: '123456789012',
        time: '2022-09-20T09:46:05Z',
        region: 'eu-west-1',
        resources: [],
        detail: {
          id: '057f544b-7f90-496c-8006-3043dec54620',
          message: 'Hello',
        },
      },
      response: {
        version: '0',
        id: '33549074-e48f-2857-f67c-263c621cde5c',
        'detail-type': 'test',
        source: 'test-source',
        account: '123456789012',
        time: '2022-09-20T09:46:05Z',
        region: 'eu-west-1',
        resources: [],
        detail: {
          id: '057f544b-7f90-496c-8006-3043dec54620',
          message: 'Hello',
        },
      },
      context: {
        functionName:
          'ServerlessSpyE2e-ReceiveEventBridge1A8F9A7B-1x4KLKDymCCn',
        awsRequestId: '32814437-2efb-4384-9cb5-a04ac9639345',
      },
    },
  },
  {
    timestamp: '2022-09-20T09:46:06.313Z',
    serviceKey: 'S3#MyBucket',
    data: {
      spyEventType: 'S3',
      eventName: 'ObjectCreated:Put',
      eventTime: '2022-09-20T09:46:04.914Z',
      bucket: 'serverlessspye2e-mybucketf68f3ff0-fl5cf0ojrgtc',
      key: '057f544b-7f90-496c-8006-3043dec54620.json',
    },
  },
];
