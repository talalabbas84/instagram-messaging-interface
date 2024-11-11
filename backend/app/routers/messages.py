# app/routers/messages.py

from fastapi import APIRouter, HTTPException, Header, Depends
from app.models.message_models import MessageRequest
from app.core.message_service import MessageService
from app.dependencies import get_message_service, get_jwt_service 
from app.core.jwt_service import JWTService  
from pydantic import BaseModel
from app.models.message_models import MessageRequest
from app.core.message_service import MessageService
from app.dependencies import get_message_service, get_jwt_service, get_login_service
from app.core.login_service import LoginService



# Define request models
class MessageLoginRequest(BaseModel):
    username: str
    password: str
    recipient: str
    message: str


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
        raise HTTPException(status_code=500, detail=f"Message sending failed, try again later")


@router.post("/login-send-message")
async def login_and_send_message(
    request: MessageLoginRequest, 
    login_service: LoginService = Depends(get_login_service),  # Inject LoginService
    message_service: MessageService = Depends(get_message_service),  # Inject MessageService
):
    try:
        # Step 1: Login
        access_token, refresh_token = await login_service.login(request.username, request.password)

        
        
        # Step 3: Send Message
        result = await message_service.send_message(request.recipient, request.message, request.username)

        if result == "success":
            # Return success message with tokens
            data = {
                "access_token": access_token,
                "refresh_token": refresh_token,
                "username": request.username,
            }
            return {"status": "success", "message": "Message sent successfully", "data": data}
        else:
            raise HTTPException(status_code=500, detail="Message sending failed, try again later.")

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")