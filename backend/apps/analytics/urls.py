from django.urls import path

from .views import HackathonAnalyticsView

urlpatterns = [
    path("hackathons/<int:hackathon_id>/", HackathonAnalyticsView.as_view(), name="hackathon-analytics"),
]
