from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.submissions.models import Submission


class AIEvaluateSubmissionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, submission_id):
        if request.user.role not in ("organizer", "judge", "admin"):
            return Response({"detail": "only organizers and judges can trigger AI"}, status=status.HTTP_403_FORBIDDEN)
        submission = Submission.objects.filter(id=submission_id).first()
        if not submission:
            return Response({"detail": "submission not found"}, status=status.HTTP_404_NOT_FOUND)

        # Placeholder response until FastAPI AI microservice integration is connected.
        submission.ai_evaluation = {
            "innovationScore": 78,
            "documentationScore": 74,
            "complexityScore": 80,
            "summary": "Initial AI bridge placeholder result.",
            "suggestions": ["Connect AI microservice endpoint in apps.ai_bridge service layer."],
        }
        submission.save(update_fields=["ai_evaluation", "updated_at"])
        return Response({"detail": "ai evaluation stored", "aiEvaluation": submission.ai_evaluation})
