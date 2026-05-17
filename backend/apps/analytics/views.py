from django.db.models import Count
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.hackathons.models import HackathonParticipant
from apps.submissions.models import Submission
from apps.teams.models import Team


class HackathonAnalyticsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, hackathon_id):
        registrations = HackathonParticipant.objects.filter(hackathon_id=hackathon_id, status=HackathonParticipant.STATUS_REGISTERED).count()
        teams = Team.objects.filter(hackathon_id=hackathon_id).count()
        submissions = Submission.objects.filter(team__hackathon_id=hackathon_id).count()
        tech_stack_distribution = (
            Submission.objects.filter(team__hackathon_id=hackathon_id)
            .values("tech_stack")
            .annotate(count=Count("id"))
            .order_by("-count")
        )
        return Response(
            {
                "funnel": {
                    "registrations": registrations,
                    "teams": teams,
                    "submissions": submissions,
                },
                "tech_stack_distribution": list(tech_stack_distribution),
            }
        )
