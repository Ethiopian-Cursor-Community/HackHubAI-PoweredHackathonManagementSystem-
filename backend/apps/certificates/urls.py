from rest_framework.routers import DefaultRouter

from .views import CertificateViewSet

router = DefaultRouter()
router.register("", CertificateViewSet, basename="certificates")

urlpatterns = router.urls
