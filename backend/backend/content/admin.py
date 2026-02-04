from django.contrib import admin
from django.db import models
from django.forms import Textarea

from .models import PageContent


@admin.register(PageContent)
class PageContentAdmin(admin.ModelAdmin):
    list_display = ("slug", "title", "is_active", "updated_at")
    list_filter = ("is_active",)
    search_fields = ("slug", "title")
    formfield_overrides = {
        models.JSONField: {"widget": Textarea(attrs={"rows": 18, "style": "font-family: monospace;"})},
    }
