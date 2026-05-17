from django.urls import path

from .views import AIEvaluateSubmissionView, AISimilarityCheckView, AITeamMatchView

urlpatterns = [
    path("evaluate/submissions/<int:submission_id>/", AIEvaluateSubmissionView.as_view(), name="ai-evaluate-submission"),
    path("team-match/<int:hackathon_id>/", AITeamMatchView.as_view(), name="ai-team-match"),
    path("similarity/<int:hackathon_id>/", AISimilarityCheckView.as_view(), name="ai-similarity"),
]
