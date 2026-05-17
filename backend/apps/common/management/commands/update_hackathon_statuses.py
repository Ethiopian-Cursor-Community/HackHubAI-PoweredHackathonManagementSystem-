from django.core.management.base import BaseCommand
from apps.hackathons.services import update_hackathon_statuses, send_submission_deadline_warnings


class Command(BaseCommand):
    help = "Update hackathon statuses based on dates and send deadline warnings"

    def handle(self, *args, **options):
        updated = update_hackathon_statuses()
        warnings = send_submission_deadline_warnings()
        self.stdout.write(f"Updated {updated} hackathon statuses")
        self.stdout.write(f"Sent {warnings} deadline warnings")