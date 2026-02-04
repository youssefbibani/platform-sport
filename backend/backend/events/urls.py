from django.urls import path

from . import views

urlpatterns = [
    path("sports/", views.SportListView.as_view(), name="sports-list"),
    path("categories/", views.CategoryListView.as_view(), name="categories-list"),
    path("events/", views.EventListView.as_view(), name="events-list"),
    path("events/<slug:slug>/", views.EventDetailView.as_view(), name="events-detail"),
    path("events/<slug:slug>/join/", views.EventJoinView.as_view(), name="events-join"),
    path(
        "organizer/events/",
        views.OrganizerEventListCreateView.as_view(),
        name="organizer-events",
    ),
    path(
        "organizer/events/<int:pk>/",
        views.OrganizerEventDetailView.as_view(),
        name="organizer-events-detail",
    ),
    path(
        "organizer/events/<int:event_id>/tickets/",
        views.OrganizerTicketTypeListCreateView.as_view(),
        name="organizer-event-tickets",
    ),
    path(
        "organizer/events/<int:event_id>/tickets/<int:pk>/",
        views.OrganizerTicketTypeDetailView.as_view(),
        name="organizer-event-ticket-detail",
    ),
    path(
        "organizer/events/<int:event_id>/media/",
        views.OrganizerEventMediaListCreateView.as_view(),
        name="organizer-event-media",
    ),
    path(
        "organizer/events/<int:event_id>/media/<int:pk>/",
        views.OrganizerEventMediaDetailView.as_view(),
        name="organizer-event-media-detail",
    ),
    path("admin/events/", views.AdminEventListView.as_view(), name="admin-events"),
    path("admin/events/<int:pk>/", views.AdminEventDetailView.as_view(), name="admin-event-detail"),
    path("admin/events/<int:pk>/moderate/", views.AdminEventModerationView.as_view(), name="admin-event-moderate"),

    path("me/participations/", views.MyParticipationListView.as_view(), name="my-participations"),
    path("favorites/", views.FavoriteListCreateView.as_view(), name="favorites"),
    path("favorites/<int:pk>/", views.FavoriteDetailView.as_view(), name="favorites-detail"),
]
