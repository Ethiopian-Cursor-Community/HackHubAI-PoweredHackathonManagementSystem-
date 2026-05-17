from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.common.permissions import IsOrganizer, IsParticipant
from apps.notifications.services import create_notification

from .models import Hackathon, HackathonJudge, HackathonParticipant
from .serializers import HackathonJudgeSerializer, HackathonParticipantSerializer, HackathonSerializer


class HackathonViewSet(viewsets.ModelViewSet):
    queryset = Hackathon.objects.select_related("organizer").all()
    serializer_class = HackathonSerializer

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [permissions.AllowAny()]
        if self.action in ("create", "update", "partial_update", "destroy", "publish", "announce", "assign_judge", "remove_judge"):
            return [IsOrganizer()]
        if self.action == "register":
            return [IsParticipant()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(organizer=self.request.user)

    def get_queryset(self):
        queryset = super().get_queryset()
        status_filter = self.request.query_params.get("status")
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        return queryset

    def _is_owner_or_admin(self, hackathon):
        return hackathon.organizer_id == self.request.user.id or self.request.user.role == "admin"

    def update(self, request, *args, **kwargs):
        hackathon = self.get_object()
        if not self._is_owner_or_admin(hackathon):
            return Response({"detail": "only organizer can update"}, status=status.HTTP_403_FORBIDDEN)
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        hackathon = self.get_object()
        if not self._is_owner_or_admin(hackathon):
            return Response({"detail": "only organizer can update"}, status=status.HTTP_403_FORBIDDEN)
        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        hackathon = self.get_object()
        if not self._is_owner_or_admin(hackathon):
            return Response({"detail": "only organizer can delete"}, status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)

    @action(detail=True, methods=["post"])
    def register(self, request, pk=None):
        hackathon = self.get_object()
        participation, created = HackathonParticipant.objects.get_or_create(
            hackathon=hackathon, user=request.user, defaults={"status": HackathonParticipant.STATUS_REGISTERED}
        )
        if not created and participation.status == HackathonParticipant.STATUS_REGISTERED:
            return Response({"detail": "already registered"}, status=status.HTTP_400_BAD_REQUEST)
        participation.status = HackathonParticipant.STATUS_REGISTERED
        participation.save(update_fields=["status", "updated_at"])
        serializer = HackathonParticipantSerializer(participation)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

    @action(detail=True, methods=["post"])
    def publish(self, request, pk=None):
        hackathon = self.get_object()
        if not self._is_owner_or_admin(hackathon):
            return Response({"detail": "only organizer can publish"}, status=status.HTTP_403_FORBIDDEN)
        hackathon.status = Hackathon.STATUS_PUBLISHED
        hackathon.save(update_fields=["status", "updated_at"])
        return Response(self.get_serializer(hackathon).data)

    @action(detail=True, methods=["post"])
    def announce(self, request, pk=None):
        hackathon = self.get_object()
        if not self._is_owner_or_admin(hackathon):
            return Response({"detail": "only organizer can announce"}, status=status.HTTP_403_FORBIDDEN)
        message = request.data.get("message")
        if not message:
            return Response({"detail": "message is required"}, status=status.HTTP_400_BAD_REQUEST)
        recipient_ids = list(HackathonParticipant.objects.filter(hackathon=hackathon, status=HackathonParticipant.STATUS_REGISTERED).values_list("user_id", flat=True))
        for user_id in recipient_ids:
            create_notification(
                user_id=user_id,
                event_type="hackathon:announcement",
                title=f"Announcement: {hackathon.title}",
                body=message,
                metadata={"hackathon_id": hackathon.id},
            )
        return Response({"detail": "announcement queued", "message": message})

    @action(detail=True, methods=["post"], url_path="judges")
    def assign_judge(self, request, pk=None):
        hackathon = self.get_object()
        if not self._is_owner_or_admin(hackathon):
            return Response({"detail": "only organizer can assign judges"}, status=status.HTTP_403_FORBIDDEN)
        judge_user_id = request.data.get("user_id")
        if not judge_user_id:
            return Response({"detail": "user_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        assignment, _ = HackathonJudge.objects.get_or_create(hackathon=hackathon, user_id=judge_user_id)
        return Response(HackathonJudgeSerializer(assignment).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["delete"], url_path=r"judges/(?P<user_id>[^/.]+)")
    def remove_judge(self, request, pk=None, user_id=None):
        hackathon = self.get_object()
        if not self._is_owner_or_admin(hackathon):
            return Response({"detail": "only organizer can remove judges"}, status=status.HTTP_403_FORBIDDEN)
        deleted, _ = HackathonJudge.objects.filter(hackathon=hackathon, user_id=user_id).delete()
        if not deleted:
            return Response({"detail": "assignment not found"}, status=status.HTTP_404_NOT_FOUND)
        return Response(status=status.HTTP_204_NO_CONTENT)
