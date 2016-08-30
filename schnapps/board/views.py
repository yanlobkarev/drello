from django.shortcuts import render
from annoying.decorators import render_to
from rest_framework import viewsets
from serializers import TaskSerializer, StatusSerializer
from models import Status


@render_to('board.html')
def board_index(request):
    return {}


class StatusesViewSet(viewsets.ModelViewSet):
    serializer_class = StatusSerializer
    queryset = Status.objects.all()


