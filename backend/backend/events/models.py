from django.conf import settings
from django.db import models
from django.utils.text import slugify


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


def _unique_slug(model_class, value, slug_field="slug", max_length=140, instance_id=None):
    base_slug = slugify(value)[:max_length] or "item"
    slug = base_slug
    counter = 1

    while model_class.objects.filter(**{slug_field: slug}).exclude(pk=instance_id).exists():
        counter += 1
        suffix = f"-{counter}"
        slug = f"{base_slug[: max_length - len(suffix)]}{suffix}"

    return slug


class Sport(TimeStampedModel):
    name = models.CharField(max_length=80, unique=True)
    slug = models.SlugField(max_length=80, unique=True, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = _unique_slug(Sport, self.name, max_length=80, instance_id=self.pk)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class EventCategory(TimeStampedModel):
    sport = models.ForeignKey(Sport, on_delete=models.PROTECT, related_name="categories")
    name = models.CharField(max_length=80)
    slug = models.SlugField(max_length=80, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["sport__name", "name"]
        constraints = [
            models.UniqueConstraint(fields=["sport", "slug"], name="unique_category_slug"),
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = _unique_slug(
                EventCategory,
                self.name,
                max_length=80,
                instance_id=self.pk,
            )
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.sport.name} - {self.name}"


class Location(TimeStampedModel):
    venue_name = models.CharField(max_length=120)
    address_line1 = models.CharField(max_length=150)
    address_line2 = models.CharField(max_length=150, blank=True)
    city = models.CharField(max_length=80)
    region = models.CharField(max_length=80, blank=True)
    country = models.CharField(max_length=80)
    postal_code = models.CharField(max_length=20, blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)

    class Meta:
        ordering = ["country", "city", "venue_name"]

    def __str__(self):
        return f"{self.venue_name} - {self.city}"


class Event(TimeStampedModel):
    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        PENDING = "pending", "Pending"
        PUBLISHED = "published", "Published"
        REJECTED = "rejected", "Rejected"
        CANCELLED = "cancelled", "Cancelled"
        COMPLETED = "completed", "Completed"

    class EventType(models.TextChoices):
        COURSE = "course", "Course"
        STAGE = "stage", "Stage"
        TOURNAMENT = "tournament", "Tournament"
        MATCH = "match", "Match"

    class Level(models.TextChoices):
        ALL = "all", "All"
        BEGINNER = "beginner", "Beginner"
        INTERMEDIATE = "intermediate", "Intermediate"
        ADVANCED = "advanced", "Advanced"

    organizer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="organized_events",
        limit_choices_to={"profile__role": "organizer"},
    )
    title = models.CharField(max_length=160)
    slug = models.SlugField(max_length=180, unique=True, blank=True)
    short_description = models.CharField(max_length=220, blank=True)
    description = models.TextField()
    sport = models.ForeignKey(Sport, on_delete=models.PROTECT, related_name="events")
    category = models.ForeignKey(EventCategory, on_delete=models.PROTECT, related_name="events")
    event_type = models.CharField(max_length=30, choices=EventType.choices)
    level_required = models.CharField(
        max_length=30, choices=Level.choices, default=Level.ALL
    )
    start_at = models.DateTimeField()
    end_at = models.DateTimeField()
    timezone = models.CharField(max_length=60, default="UTC")
    location = models.ForeignKey(Location, on_delete=models.PROTECT, related_name="events")
    capacity_total = models.PositiveIntegerField(default=0)
    capacity_reserved = models.PositiveIntegerField(default=0)
    is_free = models.BooleanField(default=False)
    currency = models.CharField(max_length=3, default="TND")
    cancellation_policy = models.TextField(blank=True)
    cancellation_public = models.BooleanField(default=False)
    cover_image_url = models.URLField(blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)
    published_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["start_at"]
        indexes = [
            models.Index(fields=["status", "start_at"]),
            models.Index(fields=["sport", "category"]),
        ]

    @property
    def capacity_available(self):
        return max(self.capacity_total - self.capacity_reserved, 0)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = _unique_slug(Event, self.title, max_length=180, instance_id=self.pk)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class EventMedia(TimeStampedModel):
    class MediaType(models.TextChoices):
        IMAGE = "image", "Image"
        VIDEO = "video", "Video"
        DOCUMENT = "document", "Document"

    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="media")
    media_type = models.CharField(max_length=20, choices=MediaType.choices)
    url = models.URLField()
    title = models.CharField(max_length=120, blank=True)
    is_cover = models.BooleanField(default=False)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["sort_order", "id"]

    def __str__(self):
        return f"{self.event.title} - {self.media_type}"


class TicketType(TimeStampedModel):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="ticket_types")
    name = models.CharField(max_length=80)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity_total = models.PositiveIntegerField(default=0)
    quantity_sold = models.PositiveIntegerField(default=0)
    sales_start = models.DateTimeField(null=True, blank=True)
    sales_end = models.DateTimeField(null=True, blank=True)
    is_refundable = models.BooleanField(default=False)

    class Meta:
        ordering = ["event", "price"]
        constraints = [
            models.UniqueConstraint(fields=["event", "name"], name="unique_ticket_name"),
        ]

    def __str__(self):
        return f"{self.event.title} - {self.name}"


class Favorite(TimeStampedModel):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="favorites")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="favorites")

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(fields=["event", "user"], name="unique_favorite"),
        ]

    def __str__(self):
        return f"{self.user_id} -> {self.event.title}"

class EventParticipant(TimeStampedModel):
    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        CANCELLED = "cancelled", "Cancelled"

    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="participants")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="participations")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE)

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(fields=["event", "user"], name="unique_participation"),
        ]

    def __str__(self):
        return f"{self.user_id} -> {self.event.title}"
