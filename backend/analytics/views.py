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

class CampaignViewSet(viewsets.ModelViewSet):
    queryset = Campaign.objects.all()
    serializer_class = CampaignSerializer


class OfferViewSet(viewsets.ModelViewSet):
    queryset = Offer.objects.all()
    serializer_class = OfferSerializer




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
        serializer.save(user_ip=user_ip, user_agent=user_agent_string, os=os, browser=browser)






class LeadViewSet(viewsets.ModelViewSet):
    queryset = Lead.objects.all()
    serializer_class = LeadSerializer
