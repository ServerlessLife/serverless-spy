#!/usr/bin/env node
import * as fs from 'fs';
import * as http from 'http';
import * as path from 'path';
import { promisify } from 'util';
import * as progam from 'caporal';
import * as open from 'open';
import { getSignedWebSocketUrl } from '../common/getWebSocketUrl';

const readFileAsync = promisify(fs.readFile);

//resolve issue with module import
let opener = open;
if ((open as any).default) {
  opener = (open as any).default;
}

async function run() {
  let stackList: string[] | undefined;
  let cdkOutput: Record<string, Record<string, string>>;

  let options: any;

  progam
    .description('ServerlessSpy web console')
    .option('--ws <ws>', 'Websocket link')
    .option(
      '--cdkoutput <cdkoutput>',
      'CDK output file that contains Websocket link in a property ServerlessSpyWsUrl'
    )
    .option(
      '--cdkstack <cdkstack>',
      'CDK stack in cdk output file. If not specified the first one is picked.'
    )
    .option('--open <open>', 'Open browser', progam.BOOL, true)
    .option(
      '--port <p>',
      `A port on localhost where ServerlessSpy web console is accessible.`,
      progam.INT,
      '3456'
    )
    .action((_args, opt, _logger) => {
      options = opt;
    });

  progam.parse(process.argv);

  if (!options.ws && !options.cdkoutput) {
    throw new Error('--ws or --cdkstack parameter not specified');
  }

  if (options.cdkoutput) {
    const rawdata = fs.readFileSync(options.cdkoutput);
    cdkOutput = JSON.parse(rawdata.toString());
    stackList = Object.keys(cdkOutput);
  }

  http
    .createServer((request, response) => {
      void (async () => {
        try {
          //console.log('request ', request.url);
          let filePath: string = `.${request.url}`;
          //remove query parameters
          filePath = filePath.split('?')[0];
          let rootFolder = __dirname;

          if (request.url?.startsWith('/webServerlessSpy.js')) {
            //get transpiled TS to JS files
            rootFolder = getCompiledJsPath();
          } else if (request.url?.startsWith('/bootstrap/')) {
            filePath = filePath.substring('/bootstrap/'.length);
            const bootstrapFolder = await getNpmModuleInstalledPath(
              'bootstrap'
            );

            rootFolder = bootstrapFolder;
          } else if (request.url?.startsWith('/bootstrap-icons/')) {
            filePath = filePath.substring('/bootstrap-icons/'.length);
            const bootstrapFolder = await getNpmModuleInstalledPath(
              'bootstrap-icons'
            );

            rootFolder = bootstrapFolder;
          } else {
            if (filePath === './') {
              filePath = './index.html';
            }
          }

          filePath = path.join(rootFolder, filePath);
          //console.log(`${request.url} --> ${filePath}`);

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

              if (stack) {
                wsUrl = cdkOutput[stack].ServerlessSpyWsUrl;
              } else {
                if (cdkOutput && cdkOutput[Object.keys(cdkOutput)[0]]) {
                  wsUrl =
                    cdkOutput[Object.keys(cdkOutput)[0]].ServerlessSpyWsUrl;
                }
              }
            }

            if (!wsUrl) {
              throw new Error('Missing websocket url');
            }

            //console.log(`WS URL: ${wsUrl}`);
            const signedWSUrl = await getSignedWebSocketUrl(wsUrl);
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.end(signedWSUrl, 'utf-8');
          } else {
            try {
              const content = await readFileAsync(filePath);

              response.writeHead(200, { 'Content-Type': contentType });
              response.end(content, 'utf-8');
            } catch (error: any) {
              if (error.code === 'ENOENT') {
                response.writeHead(404, { 'Content-Type': 'text/html' });
                response.end(
                  `No such file or directory ${request.url}`,
                  'utf-8'
                );
              } else {
                response.writeHead(500);
                response.end(`Error: ${error.code} ..\n`);
              }
            }
          }
        } catch (err: any) {
          response.writeHead(500, { 'Content-Type': 'text/html' });
          response.end(err.message, 'utf-8');
        }
      })();
    })
    .listen(options.port);

  console.log(
    `ServerlessSoy console runing at http://localhost:${options.port}`
  );
  if (options.open) {
    await opener(`http://localhost:${options.port}`);
  }
}

run().catch(console.error);

function getNpmModuleInstalledPath(npm: string) {
  let folder = path.join(__dirname, '../', 'node_modules', npm);
  if (fs.existsSync(folder)) {
    return folder;
  }

  let folderAsPackage = path.join(__dirname, '../../', 'node_modules', npm);

  if (fs.existsSync(folderAsPackage)) {
    return folderAsPackage;
  }

  throw new Error(
    `Can not find package in folder ${folder} and ${folderAsPackage}`
  );
}

function getCompiledJsPath() {
  let folder = path.join(__dirname, '../', 'lib/cli');
  if (fs.existsSync(folder)) {
    return folder;
  }

  let folderAsPackage = path.join(__dirname, '../../', 'lib/cli');

  if (fs.existsSync(folderAsPackage)) {
    return folderAsPackage;
  }

  throw new Error(
    `Can not find compiled files in folder ${folder} and ${folderAsPackage}`
  );
}
