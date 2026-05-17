from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.hackathons.models import HackathonParticipant
from apps.notifications.services import create_notification

from .models import Certificate
from .serializers import CertificateSerializer
from .services import issue_certificate


class CertificateViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CertificateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == "admin":
            return Certificate.objects.all()
        return Certificate.objects.filter(user=self.request.user)

    @action(detail=False, methods=["get"], permission_classes=[permissions.AllowAny], url_path=r"verify/(?P<verification_id>[^/.]+)")
    def verify(self, request, verification_id=None):
        cert = Certificate.objects.filter(verification_id=verification_id).select_related("user", "hackathon").first()
        if not cert:
            return Response({"valid": False})
        return Response(
            {
                "valid": True,
                "certificate": {
                    "verification_id": str(cert.verification_id),
                    "holder": cert.user.username,
                    "hackathon": cert.hackathon.title,
                    "issued_at": cert.created_at,
                },
            }
        )

    @action(detail=False, methods=["post"], url_path="generate/hackathon/(?P<hackathon_id>[^/.]+)")
    def generate_for_hackathon(self, request, hackathon_id=None):
        if request.user.role not in ("organizer", "admin"):
            return Response({"detail": "only organizers can generate certificates"}, status=status.HTTP_403_FORBIDDEN)

        participant_ids = list(
            HackathonParticipant.objects.filter(hackathon_id=hackathon_id, status=HackathonParticipant.STATUS_REGISTERED).values_list(
                "user_id", flat=True
            )
        )
        generated = []
        for user_id in participant_ids:
            cert = issue_certificate(
                user_id=user_id,
                hackathon_id=hackathon_id,
                metadata={"generated_by": request.user.id},
            )
            create_notification(
                user_id=user_id,
                event_type="certificate:ready",
                title="Certificate ready",
                body="Your certificate is now available for verification and download.",
                metadata={"certificate_id": cert.id, "verification_id": str(cert.verification_id)},
            )
            generated.append(cert.id)
        return Response({"generated_count": len(generated), "certificate_ids": generated})
