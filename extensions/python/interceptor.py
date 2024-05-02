from __future__ import print_function

import json
import os
import uuid
from io import StringIO
import datetime

from awscrt import auth, mqtt5
from awsiot import mqtt_connection_builder
from awslambdaric import bootstrap

try:
    import __builtin__ as builtins  # Python 2
except ImportError:
    import builtins  # Python 3

subscribed_to_sqs = os.environ.get('SSPY_SUBSCRIBED_TO_SQS', False) == 'true'
debug_mode = os.environ.get('SSPY_DEBUG', None) == 'true'
scope = os.environ['SSPY_ROOT_STACK']
original_handler_name = os.environ['ORIGINAL_HANDLER']
spied_function_name = os.environ['SSPY_FUNCTION_NAME']
iot_endpoint = os.environ['SSPY_IOT_ENDPOINT']

_print = print   # keep a local copy of the original print

credentials_provider = auth.AwsCredentialsProvider.new_default_chain()


def new_print(*args, **kwargs):
    if current_context is None:
        return
    buf = StringIO()
    mod_kwargs = {
        **kwargs,
        'file': buf,
    }
    _print(*args, **mod_kwargs)
    buf.seek(0)
    message = buf.read()

    key = f'Function#{spied_function_name}#Console'
    publish(
        mqtt_connection,
        [
            {
                'serviceKey': key,
                'timestamp': get_timestamp(),
                'data': {
                    'request': current_event,
                    'context': prepare_lambda_context(current_context),
                    'console': {
                        'type': 'log',
                        'formattedMessage': message,
                        'message': args[0],
                        'optionalParams': list(args)[1:],
                    },
                },
            }
        ],
    )
    _print(list(args)[1:])
    _print(*args, **kwargs)


builtins.print = new_print


def log(*args, **kwargs):
    if debug_mode:
        _print('SSPY EXTENSION', *args, **kwargs)


def get_spy_event_type(service_key: str) -> str:
    if service_key is None:
        raise Exception('Missing service_key')
    return service_key[0 : service_key.index('#')]


def get_timestamp():
    return datetime.datetime.now(tz=datetime.timezone.utc).isoformat()


def unmarshall(data):
    deserializer = boto3.dynamodb.types.TypeDeserializer()
    python_data = {k: deserializer.deserialize(v) for k, v in data.items()}
    return python_data


class CustomEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, (list, dict, str, int, float, bool, type(None))):
            return json.JSONEncoder.default(self, obj)
        elif hasattr(obj, '__repr__'):
            return obj.__repr__()
        else:
            return json.JSONEncoder.default(self, obj.__repr__())


def encode(payload):
    payload_as_string = json.dumps(payload, cls=CustomEncoder)
    n = 50000
    parts = [
        payload_as_string[i : i + n]
        for i in range(0, len(payload_as_string), n)
    ]
    log(f'parts: {json.dumps(parts)}')
    count = len(parts)
    if count == 0:
        return []
    payload_id = str(uuid.uuid4())
    return [
        {'id': payload_id, 'index': i, 'count': count, 'data': part}
        for i, part in enumerate(parts)
    ]


def publish(mqtt_connection, payloads):
    try:
        futures = []
        for payload in payloads:
            log(f'handling payload {json.dumps(payload, cls=CustomEncoder)}')
            for fragment in encode(payload):
                future, _ = mqtt_connection.publish(
                    topic=f'sspy/{scope}',
                    payload=json.dumps(fragment, cls=CustomEncoder),
                    qos=mqtt5.QoS.AT_LEAST_ONCE,
                )
                futures.append(future)
        log(f'Publishing {len(futures)} messages')
        for future in futures:
            future.result()
        log('Publishing complete')
    except Exception as e:
        log(f'Failed to publish payload: {e}')


def publish_spy_event(mqtt_connection, event):
    log('Event', json.dumps(event))
    mapping = json.loads(os.environ['SSPY_INFRA_MAPPING'])
    log('ARN to names mapping', json.dumps(mapping))

    has_records = event.get('Records') is not None

    payloads = []

    if has_records and event['Records'].get('Sns'):
        for record in event.get('Records'):
            subscription_arn = record.get('EventSubscriptionArn')
            sns_record = record['Sns']
            if mapping.get(subscription_arn):
                service_key = mapping[subscription_arn]
            else:
                service_key = mapping[sns_record['TopicArn']]

            try:
                message = json.loads(sns_record['Message'])
            except json.JSONDecodeError:
                message = sns_record['Message']

            spy_event_type = get_spy_event_type(service_key)

            payloads.append(
                {
                    'data': {
                        'spyEventType': spy_event_type,
                        'message': message,
                        'subject': sns_record['Subject'],
                        'timestamp': sns_record['Timestamp'],
                        'topicArn': sns_record['TopicArn'],
                        'messageId': sns_record['MessageId'],
                        'messageAttributes': sns_record['MessageAttributes'],
                    },
                    'serviceKey': service_key,
                    'timestamp': get_timestamp(),
                }
            )
    elif has_records and event['Records'].get('eventSource') == 'aws:sqs':
        for record in event['Records']:
            subscription_arn = record.get('eventSourceARN')
            service_key = mapping[subscription_arn]

            try:
                body = json.loads(record['body'])
            except json.JSONDecodeError:
                body = record['body']

            payloads.append(
                {
                    'serviceKey': service_key,
                    'timestamp': get_timestamp(),
                    'data': {
                        'spyEventType': 'Sqs',
                        'body': body,
                        'messageAttributes': record['messageAttributes'],
                    },
                }
            )
    elif has_records and event['Records'][0].get('s3') is not None:
        for record in event['Records']:
            bucket_arn = record['s3']['bucket']['arn']
            payloads.append(
                {
                    'service_key': mapping[bucket_arn],
                    'data': {
                        'spyEventType': 'S3',
                        'eventName': record['eventName'],
                        'eventTime': record['eventTime'],
                        'bucket': record['s3']['bucket']['name'],
                        'key': record['s3']['object']['key'],
                    },
                }
            )
    elif has_records and event['Records'][0].get('dynamodb'):
        for record in event['Records']:
            arn = record['eventSourceARN']
            arn = arn[0 : arn.index('/stream/')]
            payloads.append(
                {
                    'service_key': mapping[arn],
                    'data': {
                        'spyEventType': 'DynamoDB',
                        'eventName': record['eventName'],
                        'newImage': unmarshall(
                            record.get('dynamodb', {}).get('NewImage')
                        ),
                        'oldImage': unmarshall(
                            record.get('dynamodb', {}).get('OldImage')
                        )
                        if record.get('dynamodb', {}).get('OldImage')
                        is not None
                        else None,
                    },
                }
            )
    elif (
        event.get('detail')
        and event.get('detail-type')
        and event.get('version')
        and event.get('source')
    ):
        service_key = mapping['eventBridge']
        spy_event_type = get_spy_event_type(service_key)
        payloads.append(
            {
                'service_key': service_key,
                'data': {
                    'spyEventType': spy_event_type,
                    'detail': event['detail'],
                    'detailType': event['detail-type'],
                    'eventBridgeId': event['id'],
                    'source': event['source'],
                    'time': event['time'],
                    'account': event['account'],
                },
            }
        )
    else:
        payloads.append(event)
    publish(mqtt_connection, payloads)


def prepare_lambda_context(context):
    return {
        'awsRequestId': context.aws_request_id,
        'functionName': context.function_name,
        'functionVersion': context.function_version,
        'invokedFunctionArn': context.invoked_function_arn,
    }


def on_connection_interrupted(connection, error, **kwargs):
    log('Connection interrupted. error: {}'.format(error))


# Callback when an interrupted connection is re-established.
def on_connection_resumed(connection, return_code, session_present, **kwargs):
    log(
        'Connection resumed. return_code: {} session_present: {}'.format(
            return_code, session_present
        )
    )


def handler(event, context):
    global current_context
    global current_event
    global mqtt_connection

    mqtt_connection = (
        mqtt_connection_builder.websockets_with_default_aws_signing(
            endpoint=iot_endpoint,
            region=iot_endpoint.split('.')[2],
            credentials_provider=credentials_provider,
            on_connection_interrupted=on_connection_interrupted,
            on_connection_resumed=on_connection_resumed,
            client_id=str(uuid.uuid4()),
            clean_session=False,
            keep_alive_secs=30,
        )
    )
    connect_future = mqtt_connection.connect()

    # Future.result() waits until a result is available
    connect_future.result()
    _print('IoT Connected')

    current_context = context
    current_event = event
    original_handler = bootstrap._get_handler(original_handler_name)

    publish(
        mqtt_connection,
        [
            {
                'serviceKey': f'Function#{spied_function_name}#Request',
                'timestamp': get_timestamp(),
                'data': {
                    'request': event,
                    'context': prepare_lambda_context(context),
                },
            }
        ],
    )
    try:
        response = original_handler(event, context)
        publish(
            mqtt_connection,
            [
                {
                    'serviceKey': f'Function#{spied_function_name}#Response',
                    'timestamp': get_timestamp(),
                    'data': {
                        'request': event,
                        'response': response,
                        'context': prepare_lambda_context(context),
                    },
                }
            ],
        )
    except Exception as e:
        import traceback

        log(f'Error: {e}')
        publish(
            mqtt_connection,
            [
                {
                    'serviceKey': f'Function#{spied_function_name}#Error',
                    'timestamp': get_timestamp(),
                    'data': {
                        'request': event,
                        'error': {
                            'message': str(e),
                            'name': 'Error',
                            'stack': str(traceback.format_exc()),
                        },
                        'context': prepare_lambda_context(context),
                    },
                }
            ],
        )
        raise e
    mqtt_connection.disconnect().result()
    return response
