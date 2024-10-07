import abc
import logging
from typing import Generic, TypeVar


BE = TypeVar("BE")


class BaseReceiver(Generic[BE], abc.ABC):
    event: BE
    logger: logging.Logger

    def __init__(self, event: BE):
        self.event = event
        self.logger = logging.getLogger("websocket")

    def receive(self) -> None:
        self.logger.debug(
            f"({self.__class__.__qualname__}) process event ({self.event.__class__.__qualname__}) start"
        )
        return self.process_event(self.event)

    @abc.abstractmethod
    def process_event(self, event: BE) -> None:
        pass
