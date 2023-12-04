import { ServerlessSpyListenerParams } from './ServerlessSpyListenerParams';
import { WsListener } from './WsListener';

export async function createServerlessSpyListener<TSpyEvents>(
  params: ServerlessSpyListenerParams
) {
  const wsListener = new WsListener<TSpyEvents>();
  let resolve, reject: ((value: void | PromiseLike<void>) => void) | undefined;
  const promise = new Promise<void>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  await wsListener.start({
    ...params,
    connectionOpenResolve: params.connectionOpenResolve || resolve,
    connectionOpenReject: params.connectionOpenReject || reject,
  });

  const proxy = wsListener.createProxy();
  await promise;
  return proxy;
}
