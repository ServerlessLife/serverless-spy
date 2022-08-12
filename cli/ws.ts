import * as fs from 'fs';
import * as readline from 'readline';
import WebSocket from 'ws';
import { getWebSocketUrl } from '../common/getWebSocketUrl';

async function run() {
  // var credentialsProvider = awsCp.fromTemporaryCredentials();
  // const credentials = await credentialsProvider();

  // const client = new STSClient({});
  // client.send()

  // const command = new GetSessionTokenCommand({});
  // const { Credentials: credentials } = await client.send(command);
  // //const credentials = s.Credentials;

  // console.log("credentials", credentials);

  // const url = process.argv[2];
  const url = 'wss://preh1xo1xh.execute-api.eu-west-1.amazonaws.com/prod';

  // https://medium.com/@o.bredenberg/iam-sign-your-api-gateway-websocket-connection-request-no-custom-auth-from-your-frontend-65451166757d
  const url2 = await getWebSocketUrl(url);

  const ws = new WebSocket(url2);

  const fileDescriptor = fs.openSync('spy_log.json', 'w');
  // 📢📁⚡️💾 💽 💾 💿 📀🛢🪣📑🔊

  ws.on('open', () => console.log(`connected ${new Date().toISOString()}`));
  ws.on('message', (data: any) => {
    // console.log(`From server: ${data}`);

    let parsed;
    try {
      parsed = JSON.parse(data);
    } catch (err) {
      console.error(`Can not parse ${data}`);
    }

    if (parsed) {
      console.log(
        `\x1b[47m\x1b[34m${parsed.timestamp} \x1b[31m🍕 ${
          parsed.serviceKey
        }\x1b[0m\x1b[32m\n${JSON.stringify(parsed.data, null, 2)}\x1b[0m`
      );
    }

    fs.write(fileDescriptor, data, (error) => {
      if (!error) {
        // fs.close(fileDescriptor);
      } else {
        console.error(error);
      }
    });
    fs.write(fileDescriptor, '\n', (error) => {
      if (!error) {
        // fs.close(fileDescriptor);
      } else {
        console.error(error);
      }
    });
  });
  ws.on('close', () => {
    console.log(`disconnected ${new Date().toISOString()}`);
    fs.close(fileDescriptor);
    process.exit();
  });

  readline
    .createInterface({
      input: process.stdin,
      output: process.stdout,
    })
    .on('line', (data) => {
      ws.send(data);
    });
}
run().catch(console.error);
