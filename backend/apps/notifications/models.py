from django.conf import settings
from django.db import models

from apps.common.models import TimeStampedModel


class Notification(TimeStampedModel):
    TYPE_GENERIC = "notification"
    TYPE_TEAM_INVITE = "team:invite"
    TYPE_ANNOUNCEMENT = "hackathon:announcement"
    TYPE_RESULTS = "results:published"
    TYPE_CERT_READY = "certificate:ready"

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notifications")
    event_type = models.CharField(max_length=64, default=TYPE_GENERIC)
    title = models.CharField(max_length=120)
    body = models.TextField()
    is_read = models.BooleanField(default=False)
    metadata = models.JSONField(default=dict, blank=True)
