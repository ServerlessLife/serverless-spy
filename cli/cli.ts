import * as fs from 'fs';
import * as http from 'http';
import * as path from 'path';
import { getWebSocketUrl } from '../common/getWebSocketUrl';

async function run() {
  const cdkExportFileName = '../.spy/cdkExports.json';

  let serverlessSpyWsUrl: string | undefined;
  if (fs.existsSync(cdkExportFileName)) {
    const rawdata = fs.readFileSync(cdkExportFileName);
    const config = JSON.parse(rawdata.toString());

    if (config && config[Object.keys(config)[0]]) {
      // get first ServerlessSpyWsUrl
      // {
      //   "my-stack": {
      //     "ServerlessSpyWsUrl": "xxx"
      //   }
      // }

      serverlessSpyWsUrl = config[Object.keys(config)[0]].ServerlessSpyWsUrl;
    }
  }

  serverlessSpyWsUrl =
    'wss://preh1xo1xh.execute-api.eu-west-1.amazonaws.com/prod';

  if (!serverlessSpyWsUrl) {
    throw new Error('Missing WS url');
  }

  console.log('serverlessSpyWsUrl', serverlessSpyWsUrl);

  const wsUrl = await getWebSocketUrl(serverlessSpyWsUrl);

  // source https://developer.mozilla.org/en-US/docs/Learn/Server-side/Node_server_without_framework
  http
    .createServer((request, response) => {
      console.log('request ', request.url);

      let filePath = `.${request.url}`;
      if (filePath === './') {
        filePath = './index.html';
      }

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
            fs.readFile('./404.html', (err, cont) => {
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
          if (request.url === '/serverlessSpy.js') {
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
    .listen(8125);
}

run().catch(console.error);
