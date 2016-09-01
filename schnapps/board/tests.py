from django.test import TestCase
from rest_framework.test import APIClient 
from rest_framework import status


class BoardAPITest(TestCase):
    '''
    Tests agains simple post/delete Task
    requests.
    '''
    
    def setUp(self):
        self.client = APIClient()

    @property
    def data(self):
        return {'title': 'New Task', 'description': '', 'status': None}

    def test_CRUDTasks(self):
        #   Create
        response = self.client.post('/api/tasks/', self.data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        #   Read
        pk = response.data['pk']
        response = self.client.get('/api/tasks/%s/' % pk, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(set(self.data.items()).issubset(set(response.data.items())))

        #   TODO: Update

        #   Delete
        response = self.client.delete('/api/tasks/%s/' % pk, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)


