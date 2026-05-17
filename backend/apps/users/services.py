from django.contrib.auth import get_user_model
from django.core.signing import BadSignature, SignatureExpired, TimestampSigner

signer = TimestampSigner()
User = get_user_model()


def make_email_verification_token(user_id):
    return signer.sign(f"verify-email:{user_id}")


def verify_email_token(token, max_age=60 * 60 * 24):
    try:
        payload = signer.unsign(token, max_age=max_age)
    except (BadSignature, SignatureExpired):
        return None
    prefix, user_id = payload.split(":", 1)
    if prefix != "verify-email":
        return None
    return User.objects.filter(id=user_id).first()


def make_password_reset_token(user_id):
    return signer.sign(f"reset-password:{user_id}")


def verify_password_reset_token(token, max_age=60 * 60):
    try:
        payload = signer.unsign(token, max_age=max_age)
    except (BadSignature, SignatureExpired):
        return None
    prefix, user_id = payload.split(":", 1)
    if prefix != "reset-password":
        return None
    return User.objects.filter(id=user_id).first()
