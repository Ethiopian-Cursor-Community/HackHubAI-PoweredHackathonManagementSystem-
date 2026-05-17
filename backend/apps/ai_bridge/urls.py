from django.urls import path

from .views import AIEvaluateSubmissionView

urlpatterns = [
    path("evaluate/submissions/<int:submission_id>/", AIEvaluateSubmissionView.as_view(), name="ai-evaluate-submission"),
]
