from datetime import datetime, time

from django.db import transaction

from django.db.models import F, Q
from django.shortcuts import get_object_or_404
from django.utils import dateparse, timezone
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError

from .models import Event, EventCategory, EventMedia, EventParticipant, Favorite, Sport, TicketType
from .permissions import IsOrganizer, IsOrganizerOwner
from .serializers import (
    EventCategorySerializer,
    EventCreateUpdateSerializer,
    EventDetailSerializer,
    EventListSerializer,
    EventMediaSerializer,
    EventModerationSerializer,
    FavoriteSerializer,
    ParticipationSerializer,
    SportSerializer,
    TicketTypeSerializer,
)


def _parse_datetime(value):
    if not value:
        return None
    parsed = dateparse.parse_datetime(value)
    if parsed:
        if timezone.is_naive(parsed):
            return timezone.make_aware(parsed, timezone.get_current_timezone())
        return parsed
    parsed_date = dateparse.parse_date(value)
    if parsed_date:
        parsed = datetime.combine(parsed_date, time.min)
        return timezone.make_aware(parsed, timezone.get_current_timezone())
    return None


class SportListView(generics.ListAPIView):
    serializer_class = SportSerializer
    queryset = Sport.objects.filter(is_active=True).order_by("name")


class CategoryListView(generics.ListAPIView):
    serializer_class = EventCategorySerializer

    def get_queryset(self):
        queryset = EventCategory.objects.filter(is_active=True, sport__is_active=True)
        queryset = queryset.select_related("sport").order_by("sport__name", "name")
        sport_param = self.request.query_params.get("sport")
        if sport_param:
            if sport_param.isdigit():
                queryset = queryset.filter(sport_id=int(sport_param))
            else:
                queryset = queryset.filter(sport__slug=sport_param)
        return queryset


class EventListView(generics.ListAPIView):
    serializer_class = EventListSerializer

    def get_queryset(self):
        queryset = Event.objects.filter(status=Event.Status.PUBLISHED)
        queryset = queryset.select_related(
            "sport", "category", "location", "organizer", "organizer__profile"
        )

        params = self.request.query_params
        sport_param = params.get("sport")
        if sport_param:
            if sport_param.isdigit():
                queryset = queryset.filter(sport_id=int(sport_param))
            else:
                queryset = queryset.filter(sport__slug=sport_param)

        category_param = params.get("category")
        if category_param:
            if category_param.isdigit():
                queryset = queryset.filter(category_id=int(category_param))
            else:
                queryset = queryset.filter(category__slug=category_param)

        search = params.get("search")
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search)
                | Q(description__icontains=search)
                | Q(short_description__icontains=search)
            )

        city = params.get("city")
        if city:
            queryset = queryset.filter(location__city__icontains=city)

        start_after = _parse_datetime(params.get("start_after"))
        if start_after:
            queryset = queryset.filter(start_at__gte=start_after)

        start_before = _parse_datetime(params.get("start_before"))
        if start_before:
            queryset = queryset.filter(start_at__lte=start_before)

        return queryset.order_by("start_at")


class EventDetailView(generics.RetrieveAPIView):
    serializer_class = EventDetailSerializer
    lookup_field = "slug"

    def get_queryset(self):
        return Event.objects.filter(status=Event.Status.PUBLISHED).select_related(
            "sport", "category", "location", "organizer", "organizer__profile"
        )


class OrganizerEventListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated, IsOrganizer]

    def get_queryset(self):
        return Event.objects.filter(organizer=self.request.user).select_related(
            "sport", "category", "location"
        )

    def get_serializer_class(self):
        if self.request.method == "POST":
            return EventCreateUpdateSerializer
        return EventListSerializer

    def perform_create(self, serializer):
        serializer.save(organizer=self.request.user)


class OrganizerEventDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated, IsOrganizer, IsOrganizerOwner]

    def get_queryset(self):
        return Event.objects.filter(organizer=self.request.user).select_related(
            "sport", "category", "location"
        )

    def get_serializer_class(self):
        if self.request.method == "GET":
            return EventDetailSerializer
        return EventCreateUpdateSerializer


class AdminEventListView(generics.ListAPIView):
    serializer_class = EventListSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        status_param = self.request.query_params.get("status")
        queryset = Event.objects.select_related(
            "sport", "category", "location", "organizer", "organizer__profile"
        )
        if status_param:
            queryset = queryset.filter(status=status_param)
        else:
            queryset = queryset.filter(status=Event.Status.PENDING)
        return queryset.order_by("-created_at")


class AdminEventDetailView(generics.RetrieveAPIView):
    serializer_class = EventDetailSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        return Event.objects.select_related(
            "sport", "category", "location", "organizer", "organizer__profile"
        )


class AdminEventModerationView(generics.UpdateAPIView):
    serializer_class = EventModerationSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = Event.objects.all()


class OrganizerTicketTypeListCreateView(generics.ListCreateAPIView):
    serializer_class = TicketTypeSerializer
    permission_classes = [permissions.IsAuthenticated, IsOrganizer]

    def get_queryset(self):
        return TicketType.objects.filter(
            event__organizer=self.request.user,
            event_id=self.kwargs["event_id"],
        )

    def perform_create(self, serializer):
        event = get_object_or_404(
            Event,
            id=self.kwargs["event_id"],
            organizer=self.request.user,
        )
        price = serializer.validated_data.get("price")
        if event.is_free and price and price > 0:
            raise ValidationError({"price": "Free event must have zero price"})
        serializer.save(event=event)


class OrganizerTicketTypeDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TicketTypeSerializer
    permission_classes = [permissions.IsAuthenticated, IsOrganizer]

    def get_queryset(self):
        return TicketType.objects.filter(
            event__organizer=self.request.user,
            event_id=self.kwargs["event_id"],
        )

    def perform_update(self, serializer):
        ticket = serializer.instance
        price = serializer.validated_data.get("price", ticket.price)
        if ticket.event.is_free and price and price > 0:
            raise ValidationError({"price": "Free event must have zero price"})
        serializer.save()


class OrganizerEventMediaListCreateView(generics.ListCreateAPIView):
    serializer_class = EventMediaSerializer
    permission_classes = [permissions.IsAuthenticated, IsOrganizer]

    def get_queryset(self):
        return EventMedia.objects.filter(
            event__organizer=self.request.user,
            event_id=self.kwargs["event_id"],
        )

    def perform_create(self, serializer):
        event = get_object_or_404(
            Event,
            id=self.kwargs["event_id"],
            organizer=self.request.user,
        )
        serializer.save(event=event)


class OrganizerEventMediaDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = EventMediaSerializer
    permission_classes = [permissions.IsAuthenticated, IsOrganizer]

    def get_queryset(self):
        return EventMedia.objects.filter(
            event__organizer=self.request.user,
            event_id=self.kwargs["event_id"],
        )


class FavoriteListCreateView(generics.ListCreateAPIView):
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user).select_related(
            "event",
            "event__sport",
            "event__category",
            "event__location",
            "event__organizer",
            "event__organizer__profile",
        )

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class FavoriteDetailView(generics.DestroyAPIView):
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)

class MyParticipationListView(generics.ListAPIView):
    serializer_class = ParticipationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return EventParticipant.objects.filter(user=self.request.user).select_related(
            "event",
            "event__sport",
            "event__category",
            "event__location",
            "event__organizer",
            "event__organizer__profile",
        )


class EventJoinView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_event(self):
        return get_object_or_404(Event, slug=self.kwargs["slug"], status=Event.Status.PUBLISHED)

    def get(self, request, *args, **kwargs):
        event = self.get_event()
        joined = EventParticipant.objects.filter(event=event, user=request.user).exists()
        return Response({
            "joined": joined,
            "capacity_available": event.capacity_available,
        })

    def post(self, request, *args, **kwargs):
        event = self.get_event()
        profile = getattr(request.user, "profile", None)
        if profile and profile.role != "athlete":
            raise ValidationError({"detail": "Seuls les athletes peuvent participer."})

        if not event.is_free:
            raise ValidationError({"detail": "Paiement requis. Disponible bientot."})

        if event.capacity_available <= 0:
            raise ValidationError({"detail": "Evenement complet."})

        with transaction.atomic():
            participation, created = EventParticipant.objects.get_or_create(
                event=event,
                user=request.user,
                defaults={"status": EventParticipant.Status.ACTIVE},
            )
            if not created:
                raise ValidationError({"detail": "Vous etes deja inscrit."})

            Event.objects.filter(id=event.id).update(
                capacity_reserved=F("capacity_reserved") + 1
            )

        return Response({"joined": True}, status=status.HTTP_201_CREATED)

    def delete(self, request, *args, **kwargs):
        event = self.get_event()
        deleted = False
        with transaction.atomic():
            qs = EventParticipant.objects.filter(event=event, user=request.user)
            if qs.exists():
                qs.delete()
                deleted = True
                Event.objects.filter(id=event.id, capacity_reserved__gt=0).update(
                    capacity_reserved=F("capacity_reserved") - 1
                )
        return Response({"joined": not deleted}, status=status.HTTP_200_OK)
