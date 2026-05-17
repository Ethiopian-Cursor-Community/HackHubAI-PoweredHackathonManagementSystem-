from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Certificate
from .serializers import CertificateSerializer


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
