from pydantic import BaseModel
from uuid import UUID


class BaseProperties(BaseModel):
    event: str = ""
    charger_id: UUID
