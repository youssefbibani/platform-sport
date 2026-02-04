from rest_framework import permissions


class IsOrganizer(permissions.BasePermission):
    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        profile = getattr(user, "profile", None)
        return bool(profile and profile.role == "organizer")


class IsOrganizerOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return getattr(obj, "organizer_id", None) == request.user.id
