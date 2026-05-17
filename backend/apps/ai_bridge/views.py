from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.hackathons.models import HackathonParticipant
from apps.submissions.models import Submission

from .services import evaluate_submission, similarity_check, team_match


class AIEvaluateSubmissionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, submission_id):
        if request.user.role not in ("organizer", "judge", "admin"):
            return Response({"detail": "only organizers and judges can trigger AI"}, status=status.HTTP_403_FORBIDDEN)
        submission = Submission.objects.filter(id=submission_id).first()
        if not submission:
            return Response({"detail": "submission not found"}, status=status.HTTP_404_NOT_FOUND)

        payload = {
            "projectTitle": submission.project_title,
            "description": submission.description,
            "githubUrl": submission.github_url,
            "techStack": submission.tech_stack,
        }
        result, err = evaluate_submission(payload)
        if err:
            return Response({"detail": "ai service unavailable", "error": err}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        submission.ai_evaluation = result
        submission.save(update_fields=["ai_evaluation", "updated_at"])
        return Response({"detail": "ai evaluation stored", "aiEvaluation": submission.ai_evaluation})


class AITeamMatchView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, hackathon_id):
        if request.user.role not in ("participant", "admin"):
            return Response({"detail": "only participants can request matches"}, status=status.HTTP_403_FORBIDDEN)
        skills = request.data.get("skills") or request.user.skills or []
        participant_ids = list(
            HackathonParticipant.objects.filter(hackathon_id=hackathon_id, status=HackathonParticipant.STATUS_REGISTERED).values_list(
                "user_id", flat=True
            )
        )
        payload = {
            "hackathonId": hackathon_id,
            "requestingUserId": request.user.id,
            "skills": skills,
            "participantIds": participant_ids,
        }
        result, err = team_match(payload)
        if err:
            return Response({"detail": "ai service unavailable", "error": err}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        return Response({"suggestions": result})


class AISimilarityCheckView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, hackathon_id):
        if request.user.role not in ("organizer", "admin"):
            return Response({"detail": "only organizers can run similarity checks"}, status=status.HTTP_403_FORBIDDEN)
        submissions = Submission.objects.filter(team__hackathon_id=hackathon_id).values("id", "project_title", "description")
        payload = {"hackathonId": hackathon_id, "submissions": list(submissions)}
        result, err = similarity_check(payload)
        if err:
            return Response({"detail": "ai service unavailable", "error": err}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        return Response({"pairs": result})
