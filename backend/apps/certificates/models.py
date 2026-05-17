import uuid

from django.conf import settings
from django.db import models

from apps.common.models import TimeStampedModel


class Certificate(TimeStampedModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="certificates")
    hackathon = models.ForeignKey("hackathons.Hackathon", on_delete=models.CASCADE, related_name="certificates")
    verification_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    pdf_url = models.URLField(blank=True)
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        unique_together = ("user", "hackathon")
