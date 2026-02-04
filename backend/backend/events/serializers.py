from django.utils import timezone
from rest_framework import serializers

from .models import (
    Event,
    EventCategory,
    EventMedia,
    EventParticipant,
    Favorite,
    Location,
    Sport,
    TicketType,
)


class SportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sport
        fields = ["id", "name", "slug"]
        read_only_fields = ["slug"]


class EventCategorySerializer(serializers.ModelSerializer):
    sport_name = serializers.CharField(source="sport.name", read_only=True)

    class Meta:
        model = EventCategory
        fields = ["id", "sport", "sport_name", "name", "slug"]
        read_only_fields = ["slug"]


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = [
            "venue_name",
            "address_line1",
            "address_line2",
            "city",
            "region",
            "country",
            "postal_code",
            "latitude",
            "longitude",
        ]


class EventMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventMedia
        fields = [
            "id",
            "media_type",
            "url",
            "title",
            "is_cover",
            "sort_order",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class TicketTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketType
        fields = [
            "id",
            "name",
            "price",
            "quantity_total",
            "quantity_sold",
            "sales_start",
            "sales_end",
            "is_refundable",
        ]
        read_only_fields = ["id", "quantity_sold"]


class EventListSerializer(serializers.ModelSerializer):
    sport_name = serializers.CharField(source="sport.name", read_only=True)
    category_name = serializers.CharField(source="category.name", read_only=True)
    organizer_name = serializers.SerializerMethodField()
    city = serializers.CharField(source="location.city", read_only=True)
    country = serializers.CharField(source="location.country", read_only=True)
    capacity_available = serializers.IntegerField(read_only=True)

    class Meta:
        model = Event
        fields = [
            "id",
            "title",
            "slug",
            "short_description",
            "sport",
            "sport_name",
            "category",
            "category_name",
            "event_type",
            "level_required",
            "start_at",
            "end_at",
            "timezone",
            "city",
            "country",
            "capacity_total",
            "capacity_reserved",
            "capacity_available",
            "is_free",
            "currency",
            "cancellation_policy",
            "cancellation_public",
            "cover_image_url",
            "status",
            "organizer_name",
        ]

    def get_organizer_name(self, obj):
        profile = getattr(obj.organizer, "profile", None)
        org_name = ""
        if profile:
            org_name = (profile.organization_name or "").strip()
        full_name = f"{obj.organizer.first_name} {obj.organizer.last_name}".strip()
        return org_name or full_name or obj.organizer.email


class EventDetailSerializer(serializers.ModelSerializer):
    sport = SportSerializer(read_only=True)
    category = EventCategorySerializer(read_only=True)
    location = LocationSerializer(read_only=True)
    ticket_types = TicketTypeSerializer(many=True, read_only=True)
    media = EventMediaSerializer(many=True, read_only=True)
    organizer_name = serializers.SerializerMethodField()
    capacity_available = serializers.IntegerField(read_only=True)

    class Meta:
        model = Event
        fields = [
            "id",
            "title",
            "slug",
            "short_description",
            "description",
            "sport",
            "category",
            "event_type",
            "level_required",
            "start_at",
            "end_at",
            "timezone",
            "location",
            "capacity_total",
            "capacity_reserved",
            "capacity_available",
            "is_free",
            "currency",
            "cancellation_policy",
            "cancellation_public",
            "cover_image_url",
            "status",
            "published_at",
            "organizer_name",
            "ticket_types",
            "media",
        ]

    def get_organizer_name(self, obj):
        profile = getattr(obj.organizer, "profile", None)
        org_name = ""
        if profile:
            org_name = (profile.organization_name or "").strip()
        full_name = f"{obj.organizer.first_name} {obj.organizer.last_name}".strip()
        return org_name or full_name or obj.organizer.email


class EventCreateUpdateSerializer(serializers.ModelSerializer):
    location = LocationSerializer()

    class Meta:
        model = Event
        fields = [
            "id",
            "title",
            "short_description",
            "description",
            "sport",
            "category",
            "event_type",
            "level_required",
            "start_at",
            "end_at",
            "timezone",
            "location",
            "capacity_total",
            "is_free",
            "currency",
            "cancellation_policy",
            "cancellation_public",
            "cover_image_url",
            "status",
        ]
        read_only_fields = ["id"]

    def validate(self, attrs):
        start_at = attrs.get("start_at") or (self.instance.start_at if self.instance else None)
        end_at = attrs.get("end_at") or (self.instance.end_at if self.instance else None)
        if start_at and end_at and end_at <= start_at:
            raise serializers.ValidationError({"end_at": "End time must be after start time"})

        if self.instance and "capacity_total" in attrs:
            if attrs["capacity_total"] < self.instance.capacity_reserved:
                raise serializers.ValidationError({
                    "capacity_total": "Capacity cannot be lower than reserved seats"
                })
        return attrs

    def _apply_status(self, instance, validated_data):
        status_value = validated_data.get("status")
        if status_value is None:
            return

        request = self.context.get("request")
        is_staff = bool(request and request.user and request.user.is_staff)

        if not is_staff:
            if status_value == Event.Status.PUBLISHED:
                status_value = Event.Status.PENDING
                validated_data["status"] = status_value
            elif status_value == Event.Status.REJECTED:
                raise serializers.ValidationError({"status": "Only admins can reject events."})

        if status_value == Event.Status.PUBLISHED:
            if not instance or instance.status != Event.Status.PUBLISHED:
                validated_data["published_at"] = timezone.now()
        else:
            validated_data["published_at"] = None

    def create(self, validated_data):
        location_data = validated_data.pop("location")
        organizer = validated_data.pop("organizer", None)
        if organizer is None:
            request = self.context.get("request")
            organizer = getattr(request, "user", None)
        self._apply_status(None, validated_data)
        location = Location.objects.create(**location_data)
        return Event.objects.create(organizer=organizer, location=location, **validated_data)

    def update(self, instance, validated_data):
        location_data = validated_data.pop("location", None)
        if location_data:
            for attr, value in location_data.items():
                setattr(instance.location, attr, value)
            instance.location.save()

        self._apply_status(instance, validated_data)

        return super().update(instance, validated_data)


class EventModerationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ["status"]

    def validate_status(self, value):
        if value not in (Event.Status.PUBLISHED, Event.Status.REJECTED):
            raise serializers.ValidationError("Status must be published or rejected.")
        return value

    def update(self, instance, validated_data):
        status_value = validated_data["status"]
        if status_value == Event.Status.PUBLISHED and instance.status != Event.Status.PUBLISHED:
            instance.published_at = timezone.now()
        if status_value != Event.Status.PUBLISHED:
            instance.published_at = None
        instance.status = status_value
        instance.save()
        return instance


class FavoriteSerializer(serializers.ModelSerializer):
    event = EventListSerializer(read_only=True)
    event_id = serializers.PrimaryKeyRelatedField(
        queryset=Event.objects.filter(status=Event.Status.PUBLISHED),
        source="event",
        write_only=True,
    )

    class Meta:
        model = Favorite
        fields = ["id", "event", "event_id", "created_at"]
        read_only_fields = ["id", "created_at"]


class ParticipationSerializer(serializers.ModelSerializer):
    event = EventListSerializer(read_only=True)

    class Meta:
        model = EventParticipant
        fields = ["id", "event", "created_at", "status"]
        read_only_fields = ["id", "created_at", "status"]
