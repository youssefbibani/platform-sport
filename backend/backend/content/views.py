from rest_framework import generics
from rest_framework.permissions import AllowAny

from .models import PageContent
from .serializers import PageContentSerializer


class PageContentDetailView(generics.RetrieveAPIView):
    serializer_class = PageContentSerializer
    permission_classes = [AllowAny]
    lookup_field = "slug"

    def get_queryset(self):
        return PageContent.objects.filter(is_active=True)
