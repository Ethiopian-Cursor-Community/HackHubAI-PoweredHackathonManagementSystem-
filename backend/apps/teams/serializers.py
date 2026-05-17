from rest_framework import serializers

from .models import Team, TeamInvitation, TeamJoinRequest, TeamMembership


class TeamMembershipSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = TeamMembership
        fields = ("id", "user", "username", "role", "created_at")


class TeamSerializer(serializers.ModelSerializer):
    memberships = TeamMembershipSerializer(many=True, read_only=True)

    class Meta:
        model = Team
        fields = (
            "id",
            "name",
            "hackathon",
            "leader",
            "looking_for_skills",
            "final_score",
            "rank",
            "status",
            "memberships",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("leader", "final_score", "rank", "created_at", "updated_at")


class TeamInvitationSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamInvitation
        fields = ("id", "team", "invited_user", "invited_by", "status", "expires_at", "created_at")
        read_only_fields = ("invited_by", "status", "created_at")


class TeamJoinRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamJoinRequest
        fields = ("id", "team", "user", "status", "created_at")
        read_only_fields = ("user", "status", "created_at")
