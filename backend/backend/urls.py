from backend.views import (
    ChargerListCreateAPIView,
    ChargerRetrieveUpdateDestroyAPIView,
    SessionListCreateAPIView,
    SessionRetrieveUpdateDestroyAPIView,
)
from django.urls import path

urlpatterns = [
    path("charger/", ChargerListCreateAPIView.as_view()),
    path("charger/<uuid:id>/", ChargerRetrieveUpdateDestroyAPIView.as_view()),
    path("session/", SessionListCreateAPIView.as_view()),
    path("session/<uuid:id>/", SessionRetrieveUpdateDestroyAPIView.as_view()),
]
