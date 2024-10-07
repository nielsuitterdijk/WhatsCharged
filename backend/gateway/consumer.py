from channels.generic.websocket import WebsocketConsumer
from backend.models import ChargePoint
from datetime import datetime
from gateway.call import BaseCall
import json
from typing import Any
from gateway.config import BaseConfig
from django.utils.module_loading import import_string
from gateway.receiver import BaseReceiver
from gateway.calls import __all__ as all_calls
from core.settings import OCPP_RECEIVER_CLASSES


class OCPPConsumer(WebsocketConsumer):
    config: BaseConfig

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.config = BaseConfig(
            call_types=all_calls, receiver_classes=OCPP_RECEIVER_CLASSES
        )

    def connect(self):
        print(self.scope)
        self.accept()
        charger_id = self.scope["url_route"]["kwargs"]["charger_id"]
        charge_point = ChargePoint.objects.filter(id=charger_id).first()
        ocpp_version = self.scope["headers"].get("Sec-WebSocket-Protocol")

        if not charge_point or not ocpp_version:
            return

        if ocpp_version not in ["v1.6", "v2.0.1"]:
            return

        self.update_charger(charge_point)

    def receive(self, text_data: str):
        try:
            data = BaseCall(data=json.loads(text_data))
            call = self.get_call_class(data.type)(data=data.payload)

            for receiver_class in self.get_receiver_classes(data.type):
                receiver_class(call).receive()

        except Exception as e:
            self.handle_error(e)

    def validate_payload(self, data: dict[str, Any]) -> None:
        if "payload" not in data:
            raise ValueError("'payload' must be present in the message.")
        if "type" not in data:
            raise ValueError("'type' must be present in the message.")

    def get_call_class(self, call_type: str) -> type[BaseCall[Any]]:
        if call_type not in self.config.call_types:
            raise ValueError(f"Unknown call_type: {call_type}")
        return import_string(f"gateway.calls.{call_type}")

    def get_receiver_classes(self, call_type: str) -> list[type[BaseReceiver[Any]]]:
        if call_type not in self.config.receiver_classes:
            raise ValueError("No receivers configured for call type.")

        return [
            import_string(f"gateway.receivers.{receiver}")
            for receiver in self.config.receiver_classes[call_type]
        ]

    def update_charger(self, charge_point: ChargePoint) -> ChargePoint:
        if not charge_point.active:
            charge_point.active = True
        charge_point.last_seen = datetime.now()
        charge_point.save()
        return charge_point

    def handle_error(self, error: Exception):
        pass
