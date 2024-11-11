from fastapi import APIRouter, HTTPException, Header, Depends
from app.models.message_models import MessageRequest
from app.core.message_service import MessageService
from app.dependencies import get_message_service, get_jwt_service, get_login_service
from app.core.jwt_service import JWTService
from app.core.login_service import LoginService
from pydantic import BaseModel

# Request model for login and sending a message in a single request
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
    message_service: MessageService = Depends(get_message_service),
    jwt_service: JWTService = Depends(get_jwt_service)
):
    """Sends a message to a recipient after validating the user's token."""
    try:
        token = authorization.split(" ")[1]
        username = jwt_service.validate_token(token)  # Validate token for user identification
        result = await message_service.send_message(request.recipient, request.message, username)
        if result == "success":
            return {"status": "success", "message": "Message sent", "data": result}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail="Message sending failed, try again later")

@router.post("/login-send-message")
async def login_and_send_message(
    request: MessageLoginRequest, 
    login_service: LoginService = Depends(get_login_service),
    message_service: MessageService = Depends(get_message_service)
):
    """Logs in the user, then sends a message to the specified recipient."""
    try:
        # Login to obtain access and refresh tokens
        access_token, refresh_token = await login_service.login(request.username, request.password)

        # Send the message on successful login
        result = await message_service.send_message(request.recipient, request.message, request.username)
        
        if result == "success":
            # Return success message along with access and refresh tokens
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
from fastapi import APIRouter, HTTPException, Header, Depends
from app.models.message_models import MessageRequest
from app.core.message_service import MessageService
from app.dependencies import get_message_service, get_jwt_service, get_login_service
from app.core.jwt_service import JWTService
from app.core.login_service import LoginService
from pydantic import BaseModel

# Request model for login and sending a message in a single request
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
    message_service: MessageService = Depends(get_message_service),
    jwt_service: JWTService = Depends(get_jwt_service)
):
    """Sends a message to a recipient after validating the user's token."""
    try:
        token = authorization.split(" ")[1]
        username = jwt_service.validate_token(token)  # Validate token for user identification
        result = await message_service.send_message(request.recipient, request.message, username)
        if result == "success":
            return {"status": "success", "message": "Message sent", "data": result}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail="Message sending failed, try again later")

@router.post("/login-send-message")
async def login_and_send_message(
    request: MessageLoginRequest, 
    login_service: LoginService = Depends(get_login_service),
    message_service: MessageService = Depends(get_message_service)
):
    """Logs in the user, then sends a message to the specified recipient."""
    try:
        # Login to obtain access and refresh tokens
        access_token, refresh_token = await login_service.login(request.username, request.password)

        # Send the message on successful login
        result = await message_service.send_message(request.recipient, request.message, request.username)
        
        if result == "success":
            # Return success message along with access and refresh tokens
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
