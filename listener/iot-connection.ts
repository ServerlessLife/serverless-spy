import { iot, mqtt, auth } from 'aws-iot-device-sdk-v2';

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

export function getConnection(
  debugMode: boolean,
  iotEndpoint: string
): mqtt.MqttClientConnection {
  const log = createLog(debugMode);
  const logError = createErrorLog();
  log('Using IoT endpoint:', iotEndpoint);

  if (!iotEndpoint) {
    logError('No IoT endpoint could be found');
    throw new Error('IoT Endpoint address not found');
  }
  const region = process.env['AWS_REGION'];
  if (!region) {
    logError('AWS_REGION was not set in env');
    throw new Error('AWS_REGION was not set in env');
  }

  const configBuilder = iot.AwsIotMqttConnectionConfigBuilder.new_with_websockets({
    region,
    credentials_provider: auth.AwsCredentialsProvider.newDefault(),
  });
  configBuilder.with_endpoint(iotEndpoint);
  const client = new mqtt.MqttClient();
  const connection = client.new_connection(configBuilder.build());

  // const connection = new device({
  //   protocol: 'wss',
  //   host: iotEndpoint,
  //   region: process.env['AWS_REGION'],
  //   reconnectPeriod: 1,
  // });

  connection.on('connect', () => {
    log('IoT connected');
  });

  connection.on('error', (err) => {
    logError('IoT error', err);
  });

  connection.on('closed', () => {
    log('IoT closed');
  });

  connection.on('resume', () => {
    log('IoT reconnected');
  });

  return connection;
}
