from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.common.permissions import IsOrganizer, IsParticipant

from .models import Hackathon, HackathonParticipant
from .serializers import HackathonParticipantSerializer, HackathonSerializer


class HackathonViewSet(viewsets.ModelViewSet):
    queryset = Hackathon.objects.select_related("organizer").all()
    serializer_class = HackathonSerializer

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [permissions.AllowAny()]
        if self.action in ("create", "update", "partial_update", "destroy", "publish", "announce"):
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
        if hackathon.organizer_id != request.user.id and request.user.role != "admin":
            return Response({"detail": "only organizer can publish"}, status=status.HTTP_403_FORBIDDEN)
        hackathon.status = Hackathon.STATUS_PUBLISHED
        hackathon.save(update_fields=["status", "updated_at"])
        return Response(self.get_serializer(hackathon).data)

    @action(detail=True, methods=["post"])
    def announce(self, request, pk=None):
        hackathon = self.get_object()
        if hackathon.organizer_id != request.user.id and request.user.role != "admin":
            return Response({"detail": "only organizer can announce"}, status=status.HTTP_403_FORBIDDEN)
        message = request.data.get("message")
        if not message:
            return Response({"detail": "message is required"}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"detail": "announcement queued", "message": message})
