from django.shortcuts import render
from annoying.decorators import render_to
from rest_framework import viewsets, generics
from serializers import TaskSerializer, StatusSerializer
from models import Status, Task


@render_to('board.html')
def board_index(request):
    return {}


class StatusesViewSet(viewsets.ModelViewSet):
    serializer_class = StatusSerializer
    queryset = Status.objects.all()

    authentication_classes = []
    permission_classes = []


class TasksViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    authentication_classes = []
    permission_classes = []
