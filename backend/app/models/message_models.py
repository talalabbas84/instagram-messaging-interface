# app/models/message_models.py
from pydantic import BaseModel

class MessageRequest(BaseModel):
    recipient: str
    message: str
