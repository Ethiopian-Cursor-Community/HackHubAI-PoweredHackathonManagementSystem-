from django.db import transaction
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.common.permissions import IsParticipant
from apps.notifications.services import create_notification

from .models import Team, TeamInvitation, TeamJoinRequest, TeamMembership
from .serializers import TeamInvitationSerializer, TeamJoinRequestSerializer, TeamSerializer


class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.select_related("leader", "hackathon").prefetch_related("memberships__user")
    serializer_class = TeamSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ("create", "request_join", "leave"):
            return [IsParticipant()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if user.role in ("admin", "organizer", "judge", "mentor"):
            return self.queryset
        return self.queryset.filter(memberships__user=user).distinct()

    @transaction.atomic
    def perform_create(self, serializer):
        team = serializer.save(leader=self.request.user)
        TeamMembership.objects.create(team=team, user=self.request.user, role=TeamMembership.ROLE_LEADER)

    @action(detail=True, methods=["post"], url_path="invite")
    def invite(self, request, pk=None):
        team = self.get_object()
        if team.leader_id != request.user.id and request.user.role != "admin":
            return Response({"detail": "only team leader can invite"}, status=status.HTTP_403_FORBIDDEN)
        serializer = TeamInvitationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        invitation = serializer.save(team=team, invited_by=request.user)
        create_notification(
            user_id=invitation.invited_user_id,
            event_type="team:invite",
            title=f"Team invite to {team.name}",
            body=f"{request.user.username} invited you to join {team.name}.",
            metadata={"team_id": team.id, "invitation_id": invitation.id},
        )
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["post"], url_path="request")
    def request_join(self, request, pk=None):
        team = self.get_object()
        obj, created = TeamJoinRequest.objects.get_or_create(team=team, user=request.user)
        if not created and obj.status == TeamJoinRequest.STATUS_PENDING:
            return Response({"detail": "request already pending"}, status=status.HTTP_400_BAD_REQUEST)
        obj.status = TeamJoinRequest.STATUS_PENDING
        obj.save(update_fields=["status", "updated_at"])
        create_notification(
            user_id=team.leader_id,
            event_type="team:join_request",
            title=f"Join request for {team.name}",
            body=f"{request.user.username} requested to join your team.",
            metadata={"team_id": team.id, "request_id": obj.id},
        )
        return Response(TeamJoinRequestSerializer(obj).data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

    @action(detail=True, methods=["patch"], url_path=r"requests/(?P<request_id>[^/.]+)")
    @transaction.atomic
    def resolve_request(self, request, pk=None, request_id=None):
        team = self.get_object()
        if team.leader_id != request.user.id and request.user.role != "admin":
            return Response({"detail": "only team leader can resolve requests"}, status=status.HTTP_403_FORBIDDEN)
        decision = request.data.get("decision")
        if decision not in ("accepted", "rejected"):
            return Response({"detail": "decision must be accepted or rejected"}, status=status.HTTP_400_BAD_REQUEST)
        join_request = TeamJoinRequest.objects.filter(team=team, id=request_id).first()
        if not join_request:
            return Response({"detail": "request not found"}, status=status.HTTP_404_NOT_FOUND)
        join_request.status = decision
        join_request.save(update_fields=["status", "updated_at"])
        if decision == "accepted":
            TeamMembership.objects.get_or_create(team=team, user=join_request.user, defaults={"role": TeamMembership.ROLE_MEMBER})
        create_notification(
            user_id=join_request.user_id,
            event_type="team:request_resolved",
            title=f"Join request {decision}",
            body=f"Your join request to {team.name} was {decision}.",
            metadata={"team_id": team.id, "request_id": join_request.id},
        )
        return Response(TeamJoinRequestSerializer(join_request).data)

    @action(detail=False, methods=["patch"], url_path=r"invitations/(?P<invite_id>[^/.]+)")
    @transaction.atomic
    def resolve_invitation(self, request, invite_id=None):
        decision = request.data.get("decision")
        if decision not in ("accepted", "rejected"):
            return Response({"detail": "decision must be accepted or rejected"}, status=status.HTTP_400_BAD_REQUEST)
        invite = TeamInvitation.objects.filter(
            id=invite_id, invited_user=request.user, status=TeamInvitation.STATUS_PENDING
        ).first()
        if not invite:
            return Response({"detail": "invitation not found"}, status=status.HTTP_404_NOT_FOUND)
        invite.status = decision
        invite.save(update_fields=["status", "updated_at"])
        if decision == "accepted":
            TeamMembership.objects.get_or_create(team=invite.team, user=request.user, defaults={"role": TeamMembership.ROLE_MEMBER})
        create_notification(
            user_id=invite.invited_by_id,
            event_type="team:invite_response",
            title=f"Invitation {decision}",
            body=f"{request.user.username} {decision} your invitation for {invite.team.name}.",
            metadata={"team_id": invite.team_id, "invite_id": invite.id},
        )
        return Response(TeamInvitationSerializer(invite).data)

    @action(detail=True, methods=["delete"], url_path=r"members/(?P<user_id>[^/.]+)")
    def remove_member(self, request, pk=None, user_id=None):
        team = self.get_object()
        if team.leader_id != request.user.id and request.user.role != "admin":
            return Response({"detail": "only team leader can remove members"}, status=status.HTTP_403_FORBIDDEN)
        membership = TeamMembership.objects.filter(team=team, user_id=user_id).exclude(role=TeamMembership.ROLE_LEADER).first()
        if not membership:
            return Response({"detail": "member not found"}, status=status.HTTP_404_NOT_FOUND)
        membership.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=["delete"], url_path="leave")
    def leave(self, request, pk=None):
        team = self.get_object()
        membership = TeamMembership.objects.filter(team=team, user=request.user).exclude(role=TeamMembership.ROLE_LEADER).first()
        if not membership:
            return Response({"detail": "leader cannot leave without transfer"}, status=status.HTTP_400_BAD_REQUEST)
        membership.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
