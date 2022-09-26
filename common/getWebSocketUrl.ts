import { fromNodeProviderChain } from '@aws-sdk/credential-providers';
import { Credentials } from '@aws-sdk/types';
import * as aws4 from 'aws4';

// ""wss://m6g3w6ttdh.execute-api.eu-west-1.amazonaws.com/prod";"

export async function getSignedWebSocketUrl(
  url: string,
  credentials?: Credentials
) {
  let hostParts: string[];
  let pathname: string;

  if (!url) {
    throw new Error(`Missing websocket URL`);
  }

  try {
    new URL(url); //validate URL

    const urlParsed = parseUrl(url);
    pathname = urlParsed!.pathname!;
    hostParts = urlParsed!.host.split('.');
  } catch {
    throw new Error(`Invalid websocket URL ${url}`);
  }

  if (!credentials) {
    const credentialsProvider = fromNodeProviderChain();
    credentials = await credentialsProvider();
  }

  const AWS_REGION = hostParts[2]; // The region of your API-gateway
  const SOCKET_HOST = hostParts[0]; // Your API-gateway ID
  const ENV = pathname.replace(/^\//, ''); // The stage of your target deployment
  const WEBSOCKET_URL = `${SOCKET_HOST}.execute-api.${AWS_REGION}.amazonaws.com`; // Don't prepend with wss!
  // const AWS_REGION = "eu-west-1"; // The region of your API-gateway
  // const SOCKET_HOST = "m6g3w6ttdh"; // Your API-gateway ID
  // const ENV = "prod"; // The stage of your target deployment
  // const WEBSOCKET_URL = `${SOCKET_HOST}.execute-api.${AWS_REGION}.amazonaws.com`; // Don't prepend with wss!

  // Get a signed path
  const { path } = aws4.sign(
    {
      method: 'GET',
      host: WEBSOCKET_URL,
      // path: `/${ENV}?X-Amz-Security-Token=${encodeURIComponent(
      //   credentials!.SessionToken!
      // )}`,
      path: `/${ENV}`,
      service: 'execute-api',
      region: AWS_REGION,
      signQuery: true,
    },
    {
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
      sessionToken: credentials.sessionToken,
    }
  );

  const url2 = `wss://${WEBSOCKET_URL}${path}`;
  return url2;
}

function parseUrl(href: string) {
  const match = href.match(
    /^(wss?:)\/\/(([^:/?#]*)(?::([0-9]+))?)([/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/
  );
  return (
    match && {
      href,
      protocol: match[1],
      host: match[2],
      hostname: match[3],
      port: match[4],
      pathname: match[5],
      search: match[6],
      hash: match[7],
    }
  );
}
