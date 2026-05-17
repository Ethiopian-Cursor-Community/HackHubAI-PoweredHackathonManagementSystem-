from datetime import timedelta

from django.utils import timezone

from apps.notifications.services import create_notification
from apps.submissions.models import Submission
from apps.teams.models import Team

from .models import Hackathon, HackathonParticipant


def update_hackathon_statuses(now=None):
    now = now or timezone.now()
    updated = 0

    for hackathon in Hackathon.objects.exclude(status=Hackathon.STATUS_CANCELLED):
        next_status = hackathon.status
        if now < hackathon.registration_start:
            next_status = Hackathon.STATUS_PUBLISHED
        elif hackathon.registration_start <= now < hackathon.registration_end:
            next_status = Hackathon.STATUS_REGISTRATION_OPEN
        elif hackathon.start_date <= now < hackathon.end_date:
            next_status = Hackathon.STATUS_ONGOING
        elif hackathon.end_date <= now < hackathon.submission_deadline:
            next_status = Hackathon.STATUS_ONGOING
        elif now >= hackathon.submission_deadline:
            has_submission = Submission.objects.filter(team__hackathon=hackathon).exists()
            next_status = Hackathon.STATUS_JUDGING if has_submission else Hackathon.STATUS_COMPLETED

        if next_status != hackathon.status:
            hackathon.status = next_status
            hackathon.save(update_fields=["status", "updated_at"])
            updated += 1

    return updated


def send_submission_deadline_warnings(now=None, warning_window_minutes=60):
    now = now or timezone.now()
    window_end = now + timedelta(minutes=warning_window_minutes)

    hackathons = Hackathon.objects.filter(
        status__in=[Hackathon.STATUS_ONGOING, Hackathon.STATUS_JUDGING],
        submission_deadline__gte=now,
        submission_deadline__lte=window_end,
    )

    sent = 0
    for hackathon in hackathons:
        unsubmitted_teams = Team.objects.filter(hackathon=hackathon).exclude(submission__status=Submission.STATUS_SUBMITTED)
        for team in unsubmitted_teams:
            member_ids = list(team.memberships.values_list("user_id", flat=True))
            for user_id in member_ids:
                create_notification(
                    user_id=user_id,
                    event_type="submission:deadline_warning",
                    title=f"Submission deadline approaching: {hackathon.title}",
                    body="Your team has less than one hour left to submit.",
                    metadata={"hackathon_id": hackathon.id, "team_id": team.id},
                )
                sent += 1

    return sent


def refresh_hackathon_stats(hackathon_id):
    participants = HackathonParticipant.objects.filter(
        hackathon_id=hackathon_id, status=HackathonParticipant.STATUS_REGISTERED
    ).count()
    teams = Team.objects.filter(hackathon_id=hackathon_id).count()
    submissions = Submission.objects.filter(team__hackathon_id=hackathon_id).count()
    Hackathon.objects.filter(id=hackathon_id).update(
        stats={
            "participants": participants,
            "teams": teams,
            "submissions": submissions,
        }
    )
