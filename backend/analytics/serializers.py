from rest_framework import serializers
from .models import Campaign, Offer, Click, Lead, Photo


class CampaignSerializer(serializers.ModelSerializer):
    class Meta:
        model = Campaign
        fields = "__all__"


class PhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Photo
        fields = "__all__"


class OfferSerializer(serializers.ModelSerializer):
    photos = PhotoSerializer(many=True, read_only=True)
    existing_photos = serializers.ListField(
        child=serializers.IntegerField(), write_only=True, required=False
    )
    photo_files = serializers.ListField(
        child=serializers.FileField(write_only=True, required=False),
        write_only=True,
    )

    class Meta:
        model = Offer
        fields = '__all__'

    def validate(self, data):
        if not data.get('name'):
            raise serializers.ValidationError("Name is required")
        if not data.get('description'):
            raise serializers.ValidationError("Description is required")
        if not data.get('price'):
            raise serializers.ValidationError("Price is required")
        if 'photos' in data and len(data['photos']) == 0:
            raise serializers.ValidationError("At least one photo is required")
        return data
class ClickSerializer(serializers.ModelSerializer):
    class Meta:
        model = Click
        fields = "__all__"


class LeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lead
        fields = "__all__"
