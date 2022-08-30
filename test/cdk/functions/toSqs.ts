import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { SNSEvent } from 'aws-lambda';

const sqsClient = new SQSClient({});

export const handler = async (event: any) => {
  const sendMessageCommand = new SendMessageCommand({
    DelaySeconds: 10,
    MessageBody: JSON.stringify(event),
    QueueUrl: process.env.SQS_URL,
  });

  await sqsClient.send(sendMessageCommand);

  return event;
};
