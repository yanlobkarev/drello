from django.conf.urls import url, include
from django.contrib import admin
from views import board_index
from rest_framework import routers
from views import StatusesViewSet, TasksViewSet


router = routers.DefaultRouter()
router.register(r'statuses', StatusesViewSet)
router.register(r'tasks', TasksViewSet)


urlpatterns = [
    url(r'^$', board_index),
    url(r'^api/', include(router.urls)),
]

