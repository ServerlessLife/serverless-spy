import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

const s3Client = new S3Client({});

export const handler = async (event: any) => {
  const bucketParams = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `${event.id}.json`,
    Body: JSON.stringify(event),
  };

  await s3Client.send(new PutObjectCommand(bucketParams));

  return event;
};
