from django.db.models import Avg
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.common.permissions import IsJudge
from apps.submissions.models import Submission

from .models import SubmissionScore
from .serializers import SubmissionScoreSerializer


class SubmissionScoreViewSet(viewsets.ModelViewSet):
    queryset = SubmissionScore.objects.select_related("submission", "judge").all()
    serializer_class = SubmissionScoreSerializer
    permission_classes = [IsJudge]

    def perform_create(self, serializer):
        serializer.save(judge=self.request.user)

    @action(detail=True, methods=["post"])
    def finalize(self, request, pk=None):
        score = self.get_object()
        if score.judge_id != request.user.id and request.user.role != "admin":
            return Response({"detail": "only author can finalize"}, status=status.HTTP_403_FORBIDDEN)
        score.is_finalized = True
        score.save(update_fields=["is_finalized", "updated_at"])

        submission = score.submission
        avg_score = submission.scores.filter(is_finalized=True).aggregate(v=Avg("total_score")).get("v") or 0
        submission.final_score = avg_score
        submission.save(update_fields=["final_score", "updated_at"])

        return Response(self.get_serializer(score).data)

    @action(detail=False, methods=["get"], url_path="leaderboard/(?P<hackathon_id>[^/.]+)")
    def leaderboard(self, request, hackathon_id=None):
        rows = (
            Submission.objects.filter(team__hackathon_id=hackathon_id)
            .select_related("team")
            .order_by("-final_score")
            .values("id", "project_title", "team__name", "final_score")
        )
        return Response(list(rows))
