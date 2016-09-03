from django.dispatch import receiver
from django.db.models.signals import post_save, post_delete
from models import Task
from consumers import ws_send_updates


@receiver(post_save, sender=Task)
def on_task_saved(sender, **kwargs):
    instance = kwargs.get('instance')
    new = kwargs.get('created')
    action = 'created' if new else 'updated'
    ws_send_updates(instance, action)
    print 'Post Saved new=', new, instance.pk


@receiver(post_delete, sender=Task)
def on_task_deleted(sender, **kwargs):
    ws_send_updates(kwargs.get('instance'), 'deleted')
    print 'Post Deleted pk=', kwargs.get('instance').pk

