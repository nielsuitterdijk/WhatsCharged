from django.db import models
from users.models import User


class ChargePoint(models.Model):
    owner = models.ForeignKey(User, blank=True, on_delete=models.CASCADE)
    address = models.TextField()

    active = models.BooleanField()

    vendor = models.TextField()
    model = models.TextField()
    serial = models.TextField()
    firmware_version = models.TextField()
    meter_type = models.TextField()
    meter_serial = models.TextField()
    imsi = models.TextField()
    iccid = models.TextField()

    created = models.DateTimeField(auto_now_add=True)
    last_seen = models.DateTimeField()


class Session(models.Model):

    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField()

    start_meter_value = models.FloatField()
    end_meter_value = models.FloatField()

    energy_consumption_in_kwh = models.FloatField()
    stop_reason = models.TextField()

    charger = models.ForeignKey(ChargePoint, blank=True, on_delete=models.PROTECT)
