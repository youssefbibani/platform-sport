from django.contrib import admin

from .models import ContactMessage


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "role", "created_at")
    list_filter = ("role",)
    search_fields = ("name", "email")
