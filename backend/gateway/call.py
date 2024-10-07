from typing import Any, Generic, Type, TypeVar

from pydantic import BaseModel

_T = TypeVar("_T", bound="BaseModel")


class BaseCall(Generic[_T]):
    id: str | None = None
    payload: _T
    type: Type[_T]

    def __init__(self, data: dict[str, Any]) -> None:
        self.data = self.type(**data)
