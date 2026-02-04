from django.db import models


class PageContent(models.Model):
    class Slug(models.TextChoices):
        HOME = "home", "Home"
        ABOUT = "about", "About"

    slug = models.CharField(max_length=40, choices=Slug.choices, unique=True)
    title = models.CharField(max_length=160, blank=True)
    payload = models.JSONField(default=dict, blank=True)
    is_active = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["slug"]

    def __str__(self):
        return self.slug
