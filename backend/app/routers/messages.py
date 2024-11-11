# app/routers/messages.py

from fastapi import APIRouter, HTTPException, Header, Depends
from app.models.message_models import MessageRequest
from app.core.message_service import MessageService
from app.dependencies import get_message_service, get_jwt_service 
from app.core.jwt_service import JWTService  


router = APIRouter()

@router.post("/send-message")
async def send_message(
    request: MessageRequest, 
    authorization: str = Header(...), 
    message_service: MessageService = Depends(get_message_service),  # Inject MessageService
    jwt_service: JWTService = Depends(get_jwt_service)  # Inject JWTService
):
    try:
        token = authorization.split(" ")[1]
        username = jwt_service.validate_token(token)  # Use JWTService to validate the token
        result = await message_service.send_message(request.recipient, request.message, username)
        if result == "success":
            return {"status": "success", "message": "Message sent", "data": result}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
