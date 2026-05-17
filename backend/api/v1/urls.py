from django.urls import include, path
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView


class HealthView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({"status": "ok", "service": "hackhub-backend"})


urlpatterns = [
    path("health/", HealthView.as_view(), name="health"),
    path("auth/", include("apps.users.urls")),
    path("hackathons/", include("apps.hackathons.urls")),
    path("teams/", include("apps.teams.urls")),
    path("submissions/", include("apps.submissions.urls")),
    path("judging/", include("apps.judging.urls")),
    path("notifications/", include("apps.notifications.urls")),
    path("certificates/", include("apps.certificates.urls")),
    path("analytics/", include("apps.analytics.urls")),
    path("ai/", include("apps.ai_bridge.urls")),
]
