from django.urls import path
from rest_framework.response import Response
from rest_framework.views import APIView


class HealthView(APIView):
    permission_classes = []

    def get(self, request):
        return Response({"status": "ok", "service": "hackhub-backend"})


urlpatterns = [
    path("health/", HealthView.as_view(), name="health"),
]
