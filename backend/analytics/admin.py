from django.contrib import admin
from .models import Campaign, Offer, Click, Lead, Photo


@admin.register(Campaign)
class CampaignAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "start_date",
        "end_date",
        "budget",
        "created_at",
        "updated_at",
    )
    search_fields = ("name", "description")
    list_filter = ("start_date", "end_date")


class PhotoInline(admin.TabularInline):
    model = Photo
    extra = 1


@admin.register(Offer)
class OfferAdmin(admin.ModelAdmin):
    list_display = ("name", "campaign", "url", "price", "created_at", "updated_at")
    search_fields = ("name", "description")
    list_filter = ("campaign",)
    inlines = [PhotoInline]


@admin.register(Click)
class ClickAdmin(admin.ModelAdmin):
    list_display = (
        "offer",
        "user_ip",
        "user_agent",
        "os",
        "browser",
        "click_time",
        "landing_page_url",
        "created_at",
        "updated_at",
    )
    search_fields = ("user_ip", "user_agent", "os", "browser")
    list_filter = ("offer", "click_time")
    fields = (
        "offer",
        "user_ip",
        "user_agent",
        "os",
        "browser",
        "click_time",
        "landing_page_url",
    )


@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = ("click", "lead_time", "created_at", "updated_at")
    list_filter = ("click", "lead_time")


@admin.register(Photo)
class PhotoAdmin(admin.ModelAdmin):
    list_display = ("offer", "image", "uploaded_at")
    search_fields = ("offer__name",)
    list_filter = ("offer", "uploaded_at")
