from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CampaignViewSet, OfferViewSet, ClickViewSet, LeadViewSet

router = DefaultRouter()
router.register(r"campaigns", CampaignViewSet)
router.register(r"offers", OfferViewSet)
router.register(r"clicks", ClickViewSet)
router.register(r"leads", LeadViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
