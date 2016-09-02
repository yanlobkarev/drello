from rest_framework import routers, serializers, viewsets
from models import Task, Status


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ('title', 'description', 'status', 'pk', )


class StatusSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True)
    class Meta:
        model = Status
        fields = ('title', 'tasks', 'pk', )





