import { IoTClient, DescribeEndpointCommand } from '@aws-sdk/client-iot';
import { device } from 'aws-iot-device-sdk';

export const SSPY_TOPIC = 'sspy';

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

export async function getConnection(debugMode: boolean): Promise<device> {
  const log = createLog(debugMode);
  const logError = createErrorLog();
  log('Getting IoT endpoint');
  let response: any;
  try {
    const iotClient = new IoTClient({});
    response = await iotClient.send(
      new DescribeEndpointCommand({
        endpointType: 'iot:Data-ATS',
      })
    );
  } catch (e) {
    logError('failed to get endpoint', e);
    throw e;
  }
  log('Using IoT endpoint:', response.endpointAddress);

  if (!response.endpointAddress) {
    logError('No IoT endpoint could be found');
    throw new Error('IoT Endpoint address not found');
  }

  const connection = new device({
    protocol: 'wss',
    host: response.endpointAddress,
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
