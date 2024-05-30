from rest_framework import viewsets, status
from .models import Campaign, Offer, Click, Lead, Photo
from .serializers import (
    CampaignSerializer,
    OfferSerializer,
    ClickSerializer,
    LeadSerializer,
    PhotoSerializer,
)
import json
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
from .permissions import AllowAnyPostAndAuthenticatedReadOnly, IsAdminOrReadOnly


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

    def create(self, request, *args, **kwargs):
        print(request.POST)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


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
    permission_classes = [IsAuthenticated]

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

    @action(detail=True, methods=["get"])
    def detailed_leads(self, request, pk=None):
        offer = self.get_object()
        leads = Lead.objects.filter(click__offer=offer)
        serializer = LeadSerializer(leads, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        print(request.POST)
        # Process photo files
        photo_files = request.FILES.getlist("photo_files")

        # Create new offer instance
        data = request.data.copy()
        instance = Offer(
            name=data.get("name"),
            description=data.get("description"),
            url=data.get("url"),
            price=data.get("price"),
            campaign_id=data.get("campaign"),
        )

        instance.save()

        for photo_file in photo_files:
            Photo.objects.create(offer=instance, image=photo_file)

        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        print(request.POST)
        partial = kwargs.pop("partial", False)
        instance = self.get_object()

        # Process photo files
        photo_files = request.FILES.getlist("photo_files")

        # Update existing fields
        data = request.data.copy()
        existing_photos_str = data.get("existing_photos", "[]")
        try:
            existing_photos = json.loads(existing_photos_str)
            existing_photos = [int(photo_id) for photo_id in existing_photos]
        except (ValueError, TypeError) as e:
            return Response({"error": "Invalid existing photos data"}, status=400)

        if existing_photos:
            Photo.objects.filter(offer=instance).exclude(
                id__in=existing_photos
            ).delete()

        for photo_file in photo_files:
            Photo.objects.create(offer=instance, image=photo_file)

        # Manually update each field in the instance
        instance.name = data.get("name", instance.name)
        instance.description = data.get("description", instance.description)
        instance.url = data.get("url", instance.url)
        instance.price = data.get("price", instance.price)
        instance.campaign_id = data.get("campaign", instance.campaign_id)

        instance.save()

        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)


class ClickViewSet(viewsets.ModelViewSet):
    queryset = Click.objects.all()
    serializer_class = ClickSerializer
    permission_classes = [AllowAnyPostAndAuthenticatedReadOnly]

    def perform_create(self, serializer):
        request = self.request
        print("Request POST data:", request.data)  # Логирование данных запроса
        user_ip = request.META.get("REMOTE_ADDR")
        user_agent_string = request.META.get("HTTP_USER_AGENT")
        user_agent = user_agents.parse(user_agent_string)
        os = user_agent.os.family
        browser = user_agent.browser.family
        print(
            f"IP: {user_ip}, User Agent: {user_agent_string}, OS: {os}, Browser: {browser}"
        )
        serializer.save(
            user_ip=user_ip, user_agent=user_agent_string, os=os, browser=browser
        )

    def create(self, request, *args, **kwargs):
        print("Incoming data:", request.data)  # Логирование данных запроса
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(
                serializer.data, status=status.HTTP_201_CREATED, headers=headers
            )
        else:
            print(
                "Serializer errors:", serializer.errors
            )  # Логирование ошибок сериализатора
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LeadViewSet(viewsets.ModelViewSet):
    queryset = Lead.objects.all()
    serializer_class = LeadSerializer
    permission_classes = [AllowAnyPostAndAuthenticatedReadOnly]

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
    permission_classes = [AllowAny]


class PhotoViewSet(viewsets.ModelViewSet):
    queryset = Photo.objects.all()
    serializer_class = PhotoSerializer
    permission_classes = [AllowAny]
