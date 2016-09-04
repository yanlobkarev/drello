from channels import Group
from channels.tests import ChannelTestCase
from schnapps.board.models import Task
from schnapps.board.serializers import TaskSerializer
import json


class BroadcastsTest(ChannelTestCase):
    '''
    Tests that each `Task` action (create/
    update/delete) broadcasted via django 
    channels `Group("subscribers")`.
    '''

    def setUp(self):
        Group('subscribers').add(u'ch1')

    @property
    def message_data(self):
        message = self.get_next_message(u'ch1', require=True)
        return json.loads(message['text'])

    def test_modelChangesSent(self):
        #   Create
        task = Task.objects.create(
            title='Buy',
            description='Cheese, broat, butter',
        )

        serialized_data = TaskSerializer(task).data
        serialized_data.update({'action': 'created'})

        self.assertEqual(serialized_data, self.message_data)

        #   Update
        task.title = 'Buy shit'
        task.description = 'Weed, cheese'
        task.save()
       
        serialized_data = TaskSerializer(task).data
        serialized_data.update({'action': 'updated'})

        self.assertEqual(serialized_data, self.message_data)

        #   Delete
        task.delete()
        serialized_data.update({'action': 'deleted'})

        self.assertEqual(serialized_data, self.message_data)


