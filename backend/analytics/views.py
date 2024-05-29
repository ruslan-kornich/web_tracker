from rest_framework import viewsets, status
from .models import Campaign, Offer, Click, Lead, Photo
from .serializers import (
    CampaignSerializer,
    OfferSerializer,
    ClickSerializer,
    LeadSerializer,
    PhotoSerializer,
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
from rest_framework.permissions import IsAuthenticated, AllowAny

class CampaignViewSet(viewsets.ModelViewSet):
    queryset = Campaign.objects.all()
    serializer_class = CampaignSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ["name", "description"]
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=["get"])
    def offers(self, request, pk=None):
        campaign = self.get_object()
        offers = Offer.objects.filter(campaign=campaign)
        serializer = OfferSerializer(offers, many=True)
        return Response(serializer.data)


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

    @action(detail=True, methods=["get"])
    def clicks(self, request, pk=None):
        offer = self.get_object()
        clicks = (
            Click.objects.filter(offer=offer)
            .annotate(date=TruncDay("click_time"))
            .values("date")
            .annotate(count=Count("id"))
            .order_by("date")
        )
        return Response(clicks)

    @action(detail=True, methods=["get"])
    def detailed_clicks(self, request, pk=None):
        offer = self.get_object()
        clicks = Click.objects.filter(offer=offer)
        serializer = ClickSerializer(clicks, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["get"])
    def leads(self, request, pk=None):
        offer = self.get_object()
        leads = (
            Lead.objects.filter(click__offer=offer)
            .annotate(date=TruncDay("lead_time"))
            .values("date")
            .annotate(count=Count("id"))
            .order_by("date")
        )
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

    def create(self, request, *args, **kwargs):
        data = request.data
        offer_id = data.get("offer")
        full_name = data.get("full_name")
        email = data.get("email")
        phone = data.get("phone")
        notes = data.get("notes")

        if not offer_id:
            return Response(
                {"detail": "Offer is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            offer = Offer.objects.get(id=offer_id)
        except Offer.DoesNotExist:
            return Response(
                {"detail": "Invalid offer ID"}, status=status.HTTP_400_BAD_REQUEST
            )

        user_ip = request.META.get("REMOTE_ADDR")
        user_agent_string = request.META.get("HTTP_USER_AGENT", "")
        user_agent = user_agents.parse(user_agent_string)
        os = user_agent.os.family
        browser = user_agent.browser.family

        click_data = {
            "offer": offer.id,
            "user_ip": user_ip,
            "user_agent": user_agent_string,
            "os": os,
            "browser": browser,
            "landing_page_url": offer.url,
        }

        click_serializer = ClickSerializer(data=click_data)
        click_serializer.is_valid(raise_exception=True)
        click = click_serializer.save()

        lead_data = {
            "click": click.id,
            "full_name": full_name,
            "email": email,
            "phone": phone,
            "notes": notes,
        }

        lead_serializer = self.get_serializer(data=lead_data)
        lead_serializer.is_valid(raise_exception=True)
        self.perform_create(lead_serializer)
        headers = self.get_success_headers(lead_serializer.data)
        return Response(
            lead_serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )

    def perform_create(self, serializer):
        serializer.save()


class PublicOfferViewSet(viewsets.ReadOnlyModelViewSet):
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


class PhotoViewSet(viewsets.ModelViewSet):
    queryset = Photo.objects.all()
    serializer_class = PhotoSerializer
