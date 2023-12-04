import { SpyEventSender } from '../common/SpyEventSender';

export const handler = async (event: any) => {
  const spyEventSender = new SpyEventSender({
    scope: process.env['SSPY_ROOT_STACK']!,
  });
  try {
    await spyEventSender.connect();
    await spyEventSender.publishSpyEvent(event);
  } catch (e) {
    console.error(e);
    return { statusCode: 500, body: (e as Error)?.stack };
  } finally {
    await spyEventSender.close();
  }

  return { statusCode: 200, body: 'Data sent.' };
};
