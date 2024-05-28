from rest_framework import viewsets
from .models import Campaign, Offer, Click, Lead
from .serializers import (
    CampaignSerializer,
    OfferSerializer,
    ClickSerializer,
    LeadSerializer,
)
from rest_framework.permissions import IsAuthenticated
import user_agents
from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Offer
from .serializers import OfferSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count
from django.utils import timezone
from django.db.models.functions import TruncDay

class CampaignViewSet(viewsets.ModelViewSet):
    queryset = Campaign.objects.all()
    serializer_class = CampaignSerializer

    @action(detail=True, methods=['get'])
    def clicks(self, request, pk=None):
        campaign = self.get_object()
        clicks = Click.objects.filter(offer__campaign=campaign).values('click_time').annotate(count=Count('id'))
        return Response(clicks)

    @action(detail=True, methods=['get'])
    def leads(self, request, pk=None):
        campaign = self.get_object()
        leads = Lead.objects.filter(click__offer__campaign=campaign).values('lead_time').annotate(count=Count('id'))
        return Response(leads)


class OfferViewSet(viewsets.ModelViewSet):
    queryset = Offer.objects.all()
    serializer_class = OfferSerializer
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_fields = ["campaign", "name"]
    search_fields = ["name", "description"]
    ordering_fields = ["created_at", "updated_at"]

    @action(detail=True, methods=['get'])
    def clicks(self, request, pk=None):
        offer = self.get_object()
        clicks = Click.objects.filter(offer=offer).annotate(date=TruncDay('click_time')).values('date').annotate(count=Count('id')).order_by('date')
        return Response(clicks)

    @action(detail=True, methods=['get'])
    def leads(self, request, pk=None):
        offer = self.get_object()
        leads = Lead.objects.filter(click__offer=offer).annotate(date=TruncDay('lead_time')).values('date').annotate(count=Count('id')).order_by('date')
        return Response(leads)


class ClickViewSet(viewsets.ModelViewSet):
    queryset = Click.objects.all()
    serializer_class = ClickSerializer

    def perform_create(self, serializer):
        request = self.request
        user_ip = request.META.get("REMOTE_ADDR")
        user_agent_string = request.META.get("HTTP_USER_AGENT")
        user_agent = user_agents.parse(user_agent_string)
        os = user_agent.os.family
        browser = user_agent.browser.family
        serializer.save(
            user_ip=user_ip, user_agent=user_agent_string, os=os, browser=browser
        )


class LeadViewSet(viewsets.ModelViewSet):
    queryset = Lead.objects.all()
    serializer_class = LeadSerializer


