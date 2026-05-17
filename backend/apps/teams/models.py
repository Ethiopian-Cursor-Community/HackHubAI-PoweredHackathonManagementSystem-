from django.conf import settings
from django.db import models

from apps.common.models import TimeStampedModel


class Team(TimeStampedModel):
    STATUS_FORMING = "forming"
    STATUS_ACTIVE = "active"
    STATUS_SUBMITTED = "submitted"
    STATUS_DISQUALIFIED = "disqualified"
    STATUS_WITHDREW = "withdrew"
    STATUS_CHOICES = (
        (STATUS_FORMING, "Forming"),
        (STATUS_ACTIVE, "Active"),
        (STATUS_SUBMITTED, "Submitted"),
        (STATUS_DISQUALIFIED, "Disqualified"),
        (STATUS_WITHDREW, "Withdrew"),
    )

    name = models.CharField(max_length=100)
    hackathon = models.ForeignKey("hackathons.Hackathon", on_delete=models.CASCADE, related_name="teams")
    leader = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="led_teams")
    looking_for_skills = models.JSONField(default=list, blank=True)
    final_score = models.FloatField(default=0)
    rank = models.PositiveIntegerField(null=True, blank=True)
    status = models.CharField(max_length=24, choices=STATUS_CHOICES, default=STATUS_FORMING)

    class Meta:
        unique_together = ("name", "hackathon")


class TeamMembership(TimeStampedModel):
    ROLE_MEMBER = "member"
    ROLE_LEADER = "leader"
    ROLE_CHOICES = ((ROLE_MEMBER, "Member"), (ROLE_LEADER, "Leader"))

    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name="memberships")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="team_memberships")
    role = models.CharField(max_length=16, choices=ROLE_CHOICES, default=ROLE_MEMBER)

    class Meta:
        unique_together = ("team", "user")


class TeamInvitation(TimeStampedModel):
    STATUS_PENDING = "pending"
    STATUS_ACCEPTED = "accepted"
    STATUS_REJECTED = "rejected"
    STATUS_EXPIRED = "expired"
    STATUS_CHOICES = (
        (STATUS_PENDING, "Pending"),
        (STATUS_ACCEPTED, "Accepted"),
        (STATUS_REJECTED, "Rejected"),
        (STATUS_EXPIRED, "Expired"),
    )

    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name="invitations")
    invited_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="team_invitations")
    invited_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="sent_team_invitations")
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default=STATUS_PENDING)
    expires_at = models.DateTimeField(null=True, blank=True)


class TeamJoinRequest(TimeStampedModel):
    STATUS_PENDING = "pending"
    STATUS_ACCEPTED = "accepted"
    STATUS_REJECTED = "rejected"
    STATUS_CHOICES = (
        (STATUS_PENDING, "Pending"),
        (STATUS_ACCEPTED, "Accepted"),
        (STATUS_REJECTED, "Rejected"),
    )

    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name="join_requests")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="team_join_requests")
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default=STATUS_PENDING)

    class Meta:
        unique_together = ("team", "user")
