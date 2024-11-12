# app/models/request_models.py
from pydantic import BaseModel

# Request model for sending a message
class MessageRequest(BaseModel):
    recipient: str
    message: str

# Request model for logging in and sending a message in a single request
class MessageLoginRequest(BaseModel):
    username: str
    password: str
    recipient: str
    message: str
