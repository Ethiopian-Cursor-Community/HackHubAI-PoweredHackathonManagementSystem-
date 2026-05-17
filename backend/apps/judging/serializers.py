from rest_framework import serializers

from .models import SubmissionScore


class SubmissionScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubmissionScore
        fields = (
            "id",
            "submission",
            "judge",
            "criteria_scores",
            "total_score",
            "feedback",
            "is_finalized",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("judge", "created_at", "updated_at")
