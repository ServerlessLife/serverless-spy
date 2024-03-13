import { ServerlessSpyListenerParams } from './ServerlessSpyListenerParams';
import { WsListener } from './WsListener';

export async function createServerlessSpyListener<TSpyEvents>(
  params: Omit<ServerlessSpyListenerParams, 'scope'>
) {
  const wsListener = new WsListener<TSpyEvents>();
  let resolve, reject: ((value: void | PromiseLike<void>) => void) | undefined;
  const promise = new Promise<void>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  const [serverlessSpyWsUrl, scope] = params.serverlessSpyWsUrl.split('/');
  if (!scope) {
    throw Error(
      `ServerlessSpyWsUrl was missing rootStack: ${params.serverlessSpyWsUrl}`
    );
  }
  await wsListener.start({
    ...params,
    serverlessSpyWsUrl,
    scope,
    connectionOpenResolve: params.connectionOpenResolve || resolve,
    connectionOpenReject: params.connectionOpenReject || reject,
  });

  const proxy = wsListener.createProxy();
  await promise;
  return proxy;
}
