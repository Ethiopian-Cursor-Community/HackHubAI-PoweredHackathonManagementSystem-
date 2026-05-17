from django.conf import settings
from django.db import models
from django.utils.text import slugify

from apps.common.models import TimeStampedModel


class Hackathon(TimeStampedModel):
    STATUS_DRAFT = "draft"
    STATUS_PUBLISHED = "published"
    STATUS_REGISTRATION_OPEN = "registration_open"
    STATUS_ONGOING = "ongoing"
    STATUS_JUDGING = "judging"
    STATUS_COMPLETED = "completed"
    STATUS_CANCELLED = "cancelled"
    STATUS_CHOICES = (
        (STATUS_DRAFT, "Draft"),
        (STATUS_PUBLISHED, "Published"),
        (STATUS_REGISTRATION_OPEN, "Registration Open"),
        (STATUS_ONGOING, "Ongoing"),
        (STATUS_JUDGING, "Judging"),
        (STATUS_COMPLETED, "Completed"),
        (STATUS_CANCELLED, "Cancelled"),
    )

    title = models.CharField(max_length=100)
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    organizer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="organized_hackathons")
    status = models.CharField(max_length=24, choices=STATUS_CHOICES, default=STATUS_DRAFT)
    description = models.TextField(blank=True)
    registration_start = models.DateTimeField()
    registration_end = models.DateTimeField()
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    submission_deadline = models.DateTimeField()
    team_settings = models.JSONField(default=dict, blank=True)
    prizes = models.JSONField(default=list, blank=True)
    scoring_criteria = models.JSONField(default=list, blank=True)
    stats = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ("-created_at",)

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)[:110]
            slug = base_slug
            idx = 1
            while Hackathon.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                idx += 1
                slug = f"{base_slug}-{idx}"[:120]
            self.slug = slug
        super().save(*args, **kwargs)


class HackathonParticipant(TimeStampedModel):
    STATUS_REGISTERED = "registered"
    STATUS_WITHDRAWN = "withdrawn"
    STATUS_CHOICES = ((STATUS_REGISTERED, "Registered"), (STATUS_WITHDRAWN, "Withdrawn"))

    hackathon = models.ForeignKey(Hackathon, on_delete=models.CASCADE, related_name="participants")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="hackathon_participations")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_REGISTERED)

    class Meta:
        unique_together = ("hackathon", "user")


class HackathonJudge(TimeStampedModel):
    hackathon = models.ForeignKey(Hackathon, on_delete=models.CASCADE, related_name="judges")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="judge_assignments")

    class Meta:
        unique_together = ("hackathon", "user")
