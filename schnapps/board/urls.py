from django.conf.urls import url
from django.contrib import admin
from views import board_index


urlpatterns = [
    url(r'^$', board_index),
]

