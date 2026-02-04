from django.urls import path

from .views import PageContentDetailView

urlpatterns = [
    path("<slug:slug>/", PageContentDetailView.as_view(), name="page-content"),
]
