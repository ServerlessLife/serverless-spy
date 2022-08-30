import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';

const snsClient = new SNSClient({});

export const handler = async (event: any) => {
  const params = new PublishCommand({
    Message: JSON.stringify(event),
    TopicArn: process.env.SNS_TOPIC_ARN,
  });

  await snsClient.send(params);

  return event;
};
