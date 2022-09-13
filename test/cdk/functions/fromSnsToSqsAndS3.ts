import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { SNSEvent } from 'aws-lambda';

const s3Client = new S3Client({});
const sqsClient = new SQSClient({});

export const handler = async (event: SNSEvent) => {
  const message = JSON.parse(event.Records[0].Sns.Message);

  try {
    const sendMessageCommand = new SendMessageCommand({
      MessageAttributes: {
        Title: {
          DataType: 'String',
          StringValue: 'The Whistler',
        },
        Author: {
          DataType: 'String',
          StringValue: 'John Grisham',
        },
        WeeksOn: {
          DataType: 'Number',
          StringValue: '6',
        },
      },
      MessageBody: JSON.stringify(message),
      QueueUrl: process.env.SQS_URL,
    });

    await sqsClient.send(sendMessageCommand);
  } catch (err) {
    console.error(err);
  }
  console.log('sqs message send');

  const bucketParams = {
    Bucket: process.env.S3_BUCKET_NAME,
    // Specify the name of the new object. For example, 'index.html'.
    // To create a directory for the object, use '/'. For example, 'myApp/package.json'.
    Key: `${message.id}.json`,
    // Content of the new object.
    Body: JSON.stringify(message),
  };

  await s3Client.send(new PutObjectCommand(bucketParams));
  console.log('s3 file stored');

  return { message: 'Hello ' + message.key1 };
};
