from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

from .models import Notification


def create_notification(user_id, event_type, title, body, metadata=None):
    notification = Notification.objects.create(
        user_id=user_id,
        event_type=event_type,
        title=title,
        body=body,
        metadata=metadata or {},
    )
    channel_layer = get_channel_layer()
    if channel_layer is not None:
        async_to_sync(channel_layer.group_send)(
            f"user_{user_id}",
            {
                "type": "notify",
                "payload": {
                    "id": notification.id,
                    "event_type": notification.event_type,
                    "title": notification.title,
                    "body": notification.body,
                    "metadata": notification.metadata,
                    "created_at": notification.created_at.isoformat(),
                },
            },
        )
    return notification
