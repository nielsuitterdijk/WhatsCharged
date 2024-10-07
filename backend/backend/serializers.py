from rest_framework.serializers import ModelSerializer
from backend.models import ChargePoint, Session


class ChargerSerializer(ModelSerializer[ChargePoint]):
    class Meta:
        model = ChargePoint


class SessionSerializer(ModelSerializer[Session]):
    class Meta:
        model = ChargePoint
