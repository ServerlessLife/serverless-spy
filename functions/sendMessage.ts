import { publishSpyEvent } from '../common/publishSpyEvent';

export const handler = async (event: any) => {
  try {
    await publishSpyEvent(event);
  } catch (e) {
    console.error(e);
    return { statusCode: 500, body: (e as Error)?.stack };
  }

  return { statusCode: 200, body: 'Data sent.' };
};
