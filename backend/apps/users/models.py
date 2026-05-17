from django.contrib.auth.models import AbstractUser
from django.db import models

from apps.common.models import TimeStampedModel


class User(AbstractUser, TimeStampedModel):
    ROLE_PARTICIPANT = "participant"
    ROLE_ORGANIZER = "organizer"
    ROLE_JUDGE = "judge"
    ROLE_MENTOR = "mentor"
    ROLE_ADMIN = "admin"

    ROLE_CHOICES = (
        (ROLE_PARTICIPANT, "Participant"),
        (ROLE_ORGANIZER, "Organizer"),
        (ROLE_JUDGE, "Judge"),
        (ROLE_MENTOR, "Mentor"),
        (ROLE_ADMIN, "Admin"),
    )

    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=ROLE_PARTICIPANT)
    skills = models.JSONField(default=list, blank=True)
    is_email_verified = models.BooleanField(default=False)
    is_banned = models.BooleanField(default=False)
    avatar_url = models.URLField(blank=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return f"{self.email} ({self.role})"
