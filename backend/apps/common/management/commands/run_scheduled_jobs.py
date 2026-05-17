from django.core.management.base import BaseCommand

from apps.hackathons.services import (
    send_submission_deadline_warnings,
    update_hackathon_statuses,
)
from apps.teams.services import expire_old_invitations


class Command(BaseCommand):
    help = "Runs scheduled maintenance jobs for HackHub"

    def handle(self, *args, **options):
        statuses_updated = update_hackathon_statuses()
        warnings_sent = send_submission_deadline_warnings()
        invitations_expired = expire_old_invitations()

        self.stdout.write(
            self.style.SUCCESS(
                "Scheduled jobs complete: "
                f"statuses_updated={statuses_updated}, "
                f"warnings_sent={warnings_sent}, "
                f"invitations_expired={invitations_expired}"
            )
        )
