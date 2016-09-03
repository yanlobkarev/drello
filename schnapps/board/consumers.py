from channels import Group
from serializers import TaskSerializer
import json


def ws_connect(message):
    Group('subscribers').add(message.reply_channel)


def ws_disconnect(message):
    Group('subscribers').discard(message.reply_channel)


def ws_message(message):
    '''
    Just echo consumer from
    Django Channels tutorial.
    '''
    Group('subscribers').send({
        'text': message.content['text'],
    })


def ws_send_updates(task, action):
    '''
    Sends serialized `Task` models with
    extra field `action` which have one
    of the following values:
        `"deleted"`, `"created"`, `"updated"`.
    '''
    serializer = TaskSerializer(task)
    data = serializer.data
    data['action'] = action
    Group('subscribers').send({
        'text': json.dumps(data)
    })



