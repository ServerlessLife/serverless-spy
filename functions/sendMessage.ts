import { SpyEventSender } from '../common/SpyEventSender';

const spyEventSender = new SpyEventSender();

export const handler = async (event: any) => {
  try {
    await spyEventSender.publishSpyEvent(event);
  } catch (e) {
    console.error(e);
    return { statusCode: 500, body: (e as Error)?.stack };
  }

  return { statusCode: 200, body: 'Data sent.' };
};
