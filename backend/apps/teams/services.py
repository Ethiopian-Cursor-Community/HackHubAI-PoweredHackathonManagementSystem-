from django.utils import timezone

from .models import TeamInvitation


def expire_old_invitations(now=None):
    now = now or timezone.now()
    updated = TeamInvitation.objects.filter(
        status=TeamInvitation.STATUS_PENDING,
        expires_at__isnull=False,
        expires_at__lt=now,
    ).update(status=TeamInvitation.STATUS_EXPIRED)
    return updated
