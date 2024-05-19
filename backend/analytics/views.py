from rest_framework import viewsets
from .models import Campaign, Offer, Click, Lead
from .serializers import (
    CampaignSerializer,
    OfferSerializer,
    ClickSerializer,
    LeadSerializer,
)


class CampaignViewSet(viewsets.ModelViewSet):
    queryset = Campaign.objects.all()
    serializer_class = CampaignSerializer


class OfferViewSet(viewsets.ModelViewSet):
    queryset = Offer.objects.all()
    serializer_class = OfferSerializer


class ClickViewSet(viewsets.ModelViewSet):
    queryset = Click.objects.all()
    serializer_class = ClickSerializer


class LeadViewSet(viewsets.ModelViewSet):
    queryset = Lead.objects.all()
    serializer_class = LeadSerializer
