from rest_framework.routers import DefaultRouter

from .views import SubmissionScoreViewSet

router = DefaultRouter()
router.register("", SubmissionScoreViewSet, basename="judging")

urlpatterns = router.urls
