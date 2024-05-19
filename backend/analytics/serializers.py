from rest_framework import serializers
from .models import Campaign, Offer, Click, Lead
import user_agents


class CampaignSerializer(serializers.ModelSerializer):
    class Meta:
        model = Campaign
        fields = "__all__"


class OfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = Offer
        fields = "__all__"


class ClickSerializer(serializers.ModelSerializer):
    class Meta:
        model = Click
        fields = "__all__"

    def create(self, validated_data):
        request = self.context.get("request", None)
        if request:
            validated_data["user_ip"] = request.META.get("REMOTE_ADDR")
            user_agent_string = request.META.get("HTTP_USER_AGENT")
            validated_data["user_agent"] = user_agent_string
            user_agent = user_agents.parse(user_agent_string)
            validated_data["os"] = user_agent.os.family
            validated_data["browser"] = user_agent.browser.family
        return super().create(validated_data)


class LeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lead
        fields = "__all__"
