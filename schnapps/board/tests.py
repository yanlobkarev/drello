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

    def test_CRUDTasks(self):
        data = {'title': 'New Task', 'description': '', 'status': None}

        #   Create
        response = self.client.post('/api/tasks/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        #   Read
        pk = response.data['pk']
        response = self.client.get('/api/tasks/%s/' % pk, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(set(data.items()).issubset(set(response.data.items())))

        #   Update
        data.update({'title': 'Buy shit', 'description': 'Milf, bread, butter, sugar..'})
        response = self.client.put('/api/tasks/%s/' % pk, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(set(data.items()).issubset(set(response.data.items())))

        #   Partial update
        partial = {'title': 'Buy'}
        data.update(partial)
        response = self.client.put('/api/tasks/%s/' % pk, partial, format='json')

        #   (checks all 'description', 'status' had been persisted after 'title' update)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(set(data.items()).issubset(set(response.data.items())))                
        
        #   Delete
        response = self.client.delete('/api/tasks/%s/' % pk, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)


