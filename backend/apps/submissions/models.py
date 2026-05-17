from django.db import models

from apps.common.models import TimeStampedModel


class Submission(TimeStampedModel):
    STATUS_DRAFT = "draft"
    STATUS_SUBMITTED = "submitted"
    STATUS_UNDER_REVIEW = "under_review"
    STATUS_ACCEPTED = "accepted"
    STATUS_REJECTED = "rejected"
    STATUS_DISQUALIFIED = "disqualified"
    STATUS_CHOICES = (
        (STATUS_DRAFT, "Draft"),
        (STATUS_SUBMITTED, "Submitted"),
        (STATUS_UNDER_REVIEW, "Under Review"),
        (STATUS_ACCEPTED, "Accepted"),
        (STATUS_REJECTED, "Rejected"),
        (STATUS_DISQUALIFIED, "Disqualified"),
    )

    team = models.OneToOneField("teams.Team", on_delete=models.CASCADE, related_name="submission")
    project_title = models.CharField(max_length=100)
    description = models.TextField()
    github_url = models.URLField()
    demo_url = models.URLField(blank=True)
    video_url = models.URLField(blank=True)
    tech_stack = models.JSONField(default=list, blank=True)
    status = models.CharField(max_length=24, choices=STATUS_CHOICES, default=STATUS_DRAFT)
    final_score = models.FloatField(default=0)
    rank = models.PositiveIntegerField(null=True, blank=True)
    ai_evaluation = models.JSONField(default=dict, blank=True)
