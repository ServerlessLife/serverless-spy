import { ServerlessSpyListenerParams } from './ServerlessSpyListenerParams';
import { WsListener } from './WsListener';

export async function createServerlessSpyListener<TSpyEvents>(
  params: ServerlessSpyListenerParams
) {
  const wsListener = new WsListener<TSpyEvents>();
  await wsListener.start(params);

  return wsListener.createProxy();
}
