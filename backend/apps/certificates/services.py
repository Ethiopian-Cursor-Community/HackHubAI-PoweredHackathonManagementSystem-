from .models import Certificate


def issue_certificate(user_id, hackathon_id, metadata=None):
    certificate, _ = Certificate.objects.get_or_create(
        user_id=user_id,
        hackathon_id=hackathon_id,
        defaults={"metadata": metadata or {}},
    )
    if metadata:
        certificate.metadata = metadata
        certificate.save(update_fields=["metadata", "updated_at"])
    return certificate
