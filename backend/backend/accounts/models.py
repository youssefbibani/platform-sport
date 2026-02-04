from django.conf import settings
from django.db import models


class Profile(models.Model):
    ROLE_ATHLETE = "athlete"
    ROLE_ORGANIZER = "organizer"

    ROLE_CHOICES = [
        (ROLE_ATHLETE, "Athlete"),
        (ROLE_ORGANIZER, "Organizer"),
    ]

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile",
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=ROLE_ATHLETE)
    handle = models.CharField(max_length=60, blank=True)
    bio = models.TextField(blank=True)
    phone = models.CharField(max_length=30, blank=True)
    website = models.URLField(blank=True)
    address_line = models.CharField(max_length=150, blank=True)
    postal_code = models.CharField(max_length=20, blank=True)
    city = models.CharField(max_length=80, blank=True)
    country = models.CharField(max_length=80, blank=True)
    organization_name = models.CharField(max_length=150, blank=True)
    organization_website = models.URLField(blank=True)
    organization_type = models.CharField(max_length=120, blank=True)
    organization_description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} ({self.role})"
