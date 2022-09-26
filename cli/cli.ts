import * as fs from 'fs';
import * as http from 'http';
import * as path from 'path';
import { program } from 'commander';
import open from 'open';
import { getWebSocketUrl as getSignedWebSocketUrl } from '../common/getWebSocketUrl';

async function run() {
  let stackList: string[] | undefined;

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

  if (!options.ws && !options.cdkoutput) {
    throw new Error('--ws or --cdkstack parameter not specified');
  }

  // source https://developer.mozilla.org/en-US/docs/Learn/Server-side/Node_server_without_framework
  http
    .createServer((request, response) => {
      //console.log('request ', request.url);

      let filePath: string;

      if (request.url?.startsWith('/webServerlessSpy.js')) {
        //get transpiled TS to JS files
        filePath = `../lib/cli${request.url}`;
      } else {
        filePath = `.${request.url}`;
        if (filePath === './') {
          filePath = './index.html';
        }
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

      if (request.url === '/stackList') {
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(stackList), 'utf-8');
      } else if (request.url?.match('^/wsUrl')) {
        let wsUrl: string | undefined;
        if (options.ws) {
          wsUrl = options.ws;
        } else {
          // options.cdkoutput
          const urlPaths = request.url.split('/');
          let stack = urlPaths[2];

          if (!stack) {
            stack = options.cdkstack;
          }

          const rawdata = fs.readFileSync(
            path.join(__dirname, options.cdkoutput)
          );
          const config = JSON.parse(rawdata.toString());

          if (stack) {
            wsUrl = config[stack].ServerlessSpyWsUrl;
          } else {
            if (config && config[Object.keys(config)[0]]) {
              wsUrl = config[Object.keys(config)[0]].ServerlessSpyWsUrl;
            }
          }
        }

        if (!wsUrl) {
          throw new Error('Missing websocket url');
        }

        console.log(`WS URL: ${wsUrl}`);
        void getSignedWebSocketUrl(wsUrl).then((wsUrl) => {
          response.writeHead(200, { 'Content-Type': 'text/html' });
          response.end(wsUrl, 'utf-8');
        });
      } else {
        fs.readFile(filePath, (error, content) => {
          if (error) {
            if (error.code === 'ENOENT') {
              fs.readFile('./404.html', (_err, cont) => {
                response.writeHead(404, { 'Content-Type': 'text/html' });
                response.end(cont, 'utf-8');
              });
            } else {
              response.writeHead(500);
              response.end(`Error: ${error.code} ..\n`);
            }
          } else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
          }
        });
      }
    })
    .listen(options.port);

  await open(`http://localhost:${options.port}`);
}

run().catch(console.error);
