from __future__ import unicode_literals
from django.db import models


class Task(models.Model):
    title = models.CharField(max_length=150)
    description = models.TextField(blank=True, max_length=500)
    status = models.ForeignKey('Status', on_delete=models.SET_NULL, blank=True, null=True,
                related_name='tasks')

    def __unicode__(self):
        return self.title


class Status(models.Model):
    class Meta:
        verbose_name_plural = 'Statuses'

    title = models.CharField(max_length=150)    

    def __unicode__(self):
        return self.title


