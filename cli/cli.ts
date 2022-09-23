import * as fs from 'fs';
import * as http from 'http';
import * as path from 'path';
import { program } from 'commander';
import open from 'open';
import { getWebSocketUrl as getSignedWebSocketUrl } from '../common/getWebSocketUrl';

async function run() {
  program
    .option('--ws <ws>', 'Websocket link')
    .option(
      '--cdkoutput <cdkoutput>',
      'CDK output file that contains Websocket link in a property ServerlessSpyWsUrl'
    )
    .option(
      '--cdkstack <cdkstack>',
      'CDK stack in cdk output file. If not specified the first one is picked.'
    )
    .option('--open', 'Open browser', true)
    .option(
      '--port <p>',
      `CDK stack in cdk output file. If not specified the first one is picked.`,
      '3456'
    );
  program.parse();

  const options = program.opts();

  let serverlessSpyWsUrl: string | undefined;

  if (options.ws) {
    serverlessSpyWsUrl = options.ws;
  } else if (options.cdkoutput) {
    const rawdata = fs.readFileSync(path.join(__dirname, options.cdkoutput));
    const config = JSON.parse(rawdata.toString());

    if (config && config[Object.keys(config)[0]]) {
      serverlessSpyWsUrl = config[Object.keys(config)[0]].ServerlessSpyWsUrl;
    }

    if (options.cdkstack) {
      serverlessSpyWsUrl = config[options.cdkstack].ServerlessSpyWsUrl;
    } else {
      if (config && config[Object.keys(config)[0]]) {
        serverlessSpyWsUrl = config[Object.keys(config)[0]].ServerlessSpyWsUrl;
      }
    }
  }

  if (!serverlessSpyWsUrl) {
    throw new Error('Missing websocket url');
  }

  console.log(`Websocket URL: ${serverlessSpyWsUrl}`);

  const wsUrl = await getSignedWebSocketUrl(serverlessSpyWsUrl);

  // source https://developer.mozilla.org/en-US/docs/Learn/Server-side/Node_server_without_framework
  http
    .createServer((request, response) => {
      console.log('request ', request.url);

      let filePath = `.${request.url}`;
      if (filePath === './') {
        filePath = './index.html';
      }

      filePath = path.join(__dirname, filePath);

      const extname = String(path.extname(filePath)).toLowerCase();
      const mimeTypes: any = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.wasm': 'application/wasm',
      };

      const contentType = mimeTypes[extname] || 'application/octet-stream';

      fs.readFile(filePath, (error, content) => {
        if (error) {
          if (error.code === 'ENOENT') {
            fs.readFile('./404.html', (_err, cont) => {
              response.writeHead(404, { 'Content-Type': 'text/html' });
              response.end(cont, 'utf-8');
            });
          } else {
            response.writeHead(500);
            response.end(
              `Sorry, check with the site admin for error: ${error.code} ..\n`
            );
          }
        } else {
          response.writeHead(200, { 'Content-Type': contentType });
          if (request.url === '/webServerlessSpy.js') {
            const contentNew = content
              .toString()
              .replace('SERVERLESS_SPY_WS_URL', wsUrl);
            response.end(contentNew, 'utf-8');
          } else {
            response.end(content, 'utf-8');
          }
        }
      });
    })
    .listen(options.port);

  await open(`http://localhost:${options.port}`);
}

run().catch(console.error);
