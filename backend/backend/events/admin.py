from django.contrib import admin, messages
from django.utils import timezone

from .models import (
    Event,
    EventCategory,
    EventMedia,    Favorite,
    Location,    Sport,    TicketType,
)


@admin.register(Sport)
class SportAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "is_active")
    search_fields = ("name",)
    list_filter = ("is_active",)


@admin.register(EventCategory)
class EventCategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "sport", "slug", "is_active")
    search_fields = ("name", "sport__name")
    list_filter = ("sport", "is_active")


@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    list_display = ("venue_name", "city", "country")
    search_fields = ("venue_name", "city", "country")


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ("title", "organizer", "status", "start_at", "capacity_total")
    list_filter = ("status", "sport", "category", "event_type", "level_required")
    search_fields = ("title", "description", "organizer__email")
    prepopulated_fields = {"slug": ("title",)}
    actions = ["approve_events", "reject_events"]


    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.exclude(status=Event.Status.DRAFT)

    @admin.action(description="Approuver les evenements selectionnes")
    def approve_events(self, request, queryset):
        pending = queryset.filter(status=Event.Status.PENDING)
        if not pending.exists():
            self.message_user(
                request,
                "Aucun evenement en attente a approuver.",
                level=messages.WARNING,
            )
            return
        updated = pending.update(
            status=Event.Status.PUBLISHED,
            published_at=timezone.now(),
        )
        self.message_user(request, f"{updated} evenement(s) publie(s).")

    @admin.action(description="Rejeter les evenements selectionnes")
    def reject_events(self, request, queryset):
        pending = queryset.filter(status=Event.Status.PENDING)
        if not pending.exists():
            self.message_user(
                request,
                "Aucun evenement en attente a rejeter.",
                level=messages.WARNING,
            )
            return
        updated = pending.update(
            status=Event.Status.REJECTED,
            published_at=None,
        )
        self.message_user(request, f"{updated} evenement(s) rejete(s).")


@admin.register(EventMedia)
class EventMediaAdmin(admin.ModelAdmin):
    list_display = ("event", "media_type", "title", "is_cover")
    list_filter = ("media_type", "is_cover")


@admin.register(TicketType)
class TicketTypeAdmin(admin.ModelAdmin):
    list_display = ("event", "name", "price", "quantity_total", "quantity_sold")
    list_filter = ("event",)







@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ("user", "event", "created_at")
