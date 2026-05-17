from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.common.permissions import IsParticipant
from apps.teams.models import TeamMembership

from .models import Submission
from .serializers import SubmissionSerializer


class SubmissionViewSet(viewsets.ModelViewSet):
    queryset = Submission.objects.select_related("team", "team__hackathon").all()
    serializer_class = SubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ("create", "update", "partial_update", "submit"):
            return [IsParticipant()]
        return [permissions.IsAuthenticated()]

    def _ensure_team_member(self, team):
        return TeamMembership.objects.filter(team=team, user=self.request.user).exists() or self.request.user.role == "admin"

    def create(self, request, *args, **kwargs):
        team_id = request.data.get("team")
        if not team_id:
            return Response({"detail": "team is required"}, status=status.HTTP_400_BAD_REQUEST)
        from apps.teams.models import Team

        team = Team.objects.filter(id=team_id).first()
        if not team:
            return Response({"detail": "team not found"}, status=status.HTTP_404_NOT_FOUND)
        if not self._ensure_team_member(team):
            return Response({"detail": "only team members can submit"}, status=status.HTTP_403_FORBIDDEN)
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        submission = self.get_object()
        if not self._ensure_team_member(submission.team):
            return Response({"detail": "only team members can update"}, status=status.HTTP_403_FORBIDDEN)
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        submission = self.get_object()
        if not self._ensure_team_member(submission.team):
            return Response({"detail": "only team members can update"}, status=status.HTTP_403_FORBIDDEN)
        return super().partial_update(request, *args, **kwargs)

    @action(detail=True, methods=["post"])
    def submit(self, request, pk=None):
        submission = self.get_object()
        if not self._ensure_team_member(submission.team):
            return Response({"detail": "only team members can submit"}, status=status.HTTP_403_FORBIDDEN)
        submission.status = Submission.STATUS_SUBMITTED
        submission.save(update_fields=["status", "updated_at"])
        return Response(self.get_serializer(submission).data)
