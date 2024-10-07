from django.utils.module_loading import import_string
from gateway.call import BaseCall
from gateway.receiver import BaseReceiver
from pydantic import BaseModel


class BaseConfig(BaseModel):
    class Config:
        arbitrary_types_allowed = True

    call_types: list[str]
    receiver_classes: dict[str, list[str]]

    def validate_config(self):
        """
        This function checks the existence of the classes defined in `event_classes`
        and `receiver_classes`. If any of the defined classes can not be invoked, an
        `ImportError` exception is raised.

        Raises:
            ImportError
        """
        for call_type in self.call_types:
            call_class = import_string(f"gateway.calls.{call_type}")
            if not issubclass(call_class, BaseCall):
                raise ImportError(
                    f"event class {call_class.__module__}.{call_class.__name__} does not extend BaseEvent class"
                )

        for receiver_class_list in self.receiver_classes.values():
            for receiver_class_str in receiver_class_list:
                receiver_class = import_string(receiver_class_str)
                if not issubclass(receiver_class, BaseReceiver):
                    raise ImportError(
                        f"receiver class {receiver_class.__module__}.{receiver_class.__name__} does not extend BaseReceiver class"  # noqa: E501
                    )

    def __str__(self) -> str:
        return f"""
------------------------------------------------
Loaded Config
------------------------------------------------
{self.get_config_as_string()}
------------------------------------------------
"""

    def get_config_as_string(self) -> str:
        return f"""config_class: {self.__class__.__name__}
call_types: {", ".join(self.call_types)}
receiver_classes: {", ".join(", ".join(e) for e in self.receiver_classes.values())}"""
