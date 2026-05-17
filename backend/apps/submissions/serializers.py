from rest_framework import serializers

from .models import Submission


class SubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = (
            "id",
            "team",
            "project_title",
            "description",
            "github_url",
            "demo_url",
            "video_url",
            "tech_stack",
            "status",
            "final_score",
            "rank",
            "ai_evaluation",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("final_score", "rank", "ai_evaluation", "created_at", "updated_at")
