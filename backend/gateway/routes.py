from django.urls import re_path
from gateway.consumer import OCPPConsumer


websocket_urlpatterns = [
    re_path(r"^ocpp/(?P<charger_id>\w+)/$", OCPPConsumer.as_asgi()),
]
