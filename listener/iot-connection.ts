import { device } from 'aws-iot-device-sdk';

export type fragment = { id: string; index: number; count: number; data: any };

function createLog(debugMode: boolean) {
  return (message: string, ...optionalParams: any[]) => {
    if (debugMode) {
      console.debug('SSPY', message, ...optionalParams);
    }
  };
}

function createErrorLog() {
  return (message: string, ...optionalParams: any[]) => {
    console.error('SSPY', message, ...optionalParams);
  };
}

export async function getConnection(
  debugMode: boolean,
  iotEndpoint: string
): Promise<device> {
  const log = createLog(debugMode);
  const logError = createErrorLog();
  log('Using IoT endpoint:', iotEndpoint);

  if (!iotEndpoint) {
    logError('No IoT endpoint could be found');
    throw new Error('IoT Endpoint address not found');
  }

  const connection = new device({
    protocol: 'wss',
    host: iotEndpoint,
    region: process.env['AWS_REGION'],
    reconnectPeriod: 1,
  });

  connection.on('connect', () => {
    log('IoT connected');
  });

  connection.on('error', (err) => {
    logError('IoT error', err);
  });

  connection.on('close', () => {
    log('IoT closed');
  });

  connection.on('reconnect', () => {
    log('IoT reconnected');
  });

  return connection;
}
