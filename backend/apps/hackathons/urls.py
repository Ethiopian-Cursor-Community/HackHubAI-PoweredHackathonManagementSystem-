from rest_framework.routers import DefaultRouter

from .views import HackathonViewSet

router = DefaultRouter()
router.register("", HackathonViewSet, basename="hackathons")

urlpatterns = router.urls
