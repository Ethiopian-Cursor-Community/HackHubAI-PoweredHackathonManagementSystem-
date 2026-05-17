from rest_framework import serializers

from .models import Hackathon, HackathonParticipant


class HackathonSerializer(serializers.ModelSerializer):
    organizer_name = serializers.CharField(source="organizer.username", read_only=True)

    class Meta:
        model = Hackathon
        fields = (
            "id",
            "title",
            "slug",
            "organizer",
            "organizer_name",
            "status",
            "description",
            "registration_start",
            "registration_end",
            "start_date",
            "end_date",
            "submission_deadline",
            "team_settings",
            "prizes",
            "scoring_criteria",
            "stats",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("slug", "organizer", "stats", "created_at", "updated_at")


class HackathonParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = HackathonParticipant
        fields = ("id", "hackathon", "user", "status", "created_at")
        read_only_fields = ("user", "created_at")
