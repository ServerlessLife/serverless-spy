def handler(event, _):
    print('My console log message', event)
    return {**event, 'message': f'{event["message"]} ServerlessSpy'}
