# OCPP Hands Off Backend

## OCPP 1.6

### Provisioning

Chargers will be provisioned with a UUID & an endpoint.
We get a list of UUIDs that we accept.
Charger is installed.
Charger comes online and sends OCPP Boot notification, which we respond.
At this point we set the charger operational.

## Charging

- Transaction Start
- Transaction Stop

## Billing

The Session has a consumed energy.

> Where does the energy price come from? End of the month we look what we pay & then add marging?

# TODOs

- Implement layers
- Receive Boot Notification
- Transaction Start
- Transaciton Stop

### LATER FEATURES

- Firmware updates
- Load balancing through charge profiles

# Questions for Manufacturer

- WSS authentication
- Provisioning
- Heartbeat
- Authorization Caching
- Offline Authorization
