from django.conf import settings
from django.db import models

from apps.common.models import TimeStampedModel


class SubmissionScore(TimeStampedModel):
    submission = models.ForeignKey("submissions.Submission", on_delete=models.CASCADE, related_name="scores")
    judge = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="given_scores")
    criteria_scores = models.JSONField(default=list)
    total_score = models.FloatField(default=0)
    feedback = models.TextField(blank=True)
    is_finalized = models.BooleanField(default=False)

    class Meta:
        unique_together = ("submission", "judge")
