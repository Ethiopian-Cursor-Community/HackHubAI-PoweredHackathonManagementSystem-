from rest_framework import serializers

from .models import Certificate


class CertificateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certificate
        fields = ("id", "user", "hackathon", "verification_id", "pdf_url", "metadata", "created_at")
        read_only_fields = ("verification_id", "created_at")
