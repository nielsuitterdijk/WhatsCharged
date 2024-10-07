from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from backend.serializers import ChargerSerializer, SessionSerializer


class ChargerListCreateAPIView(ListCreateAPIView):
    serializer_class = ChargerSerializer


class ChargerRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    serializer_class = ChargerSerializer


class SessionListCreateAPIView(ListCreateAPIView):
    serializer_class = SessionSerializer


class SessionRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    serializer_class = SessionSerializer
