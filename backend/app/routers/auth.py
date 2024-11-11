from fastapi import APIRouter, HTTPException, Depends, Header  
from app.core.login_service import LoginService
from app.models.auth_models import LoginRequest
from app.dependencies import get_login_service, get_jwt_service
from app.core.jwt_service import JWTService
from pydantic import BaseModel
import jwt
from jwt.exceptions import InvalidTokenError

# Request models for token operations
class RefreshTokenRequest(BaseModel):
    refresh_token: str

class TokenRequest(BaseModel):
    access_token: str
    refresh_token: str

router = APIRouter()

@router.post("/login")
async def login(request: LoginRequest, login_service: LoginService = Depends(get_login_service)):
    """Authenticates the user and returns access and refresh tokens on success."""
    try:
        access_token, refresh_token = await login_service.login(request.username, request.password)
        data = {"access_token": access_token, "refresh_token": refresh_token, "username": request.username}
        return {"status": "success", "message": "Login successful", "data": data}
    except HTTPException as e:
        raise e

@router.post("/refresh-token")
async def refresh_token(request: RefreshTokenRequest, login_service: LoginService = Depends(get_login_service)):
    """Refreshes access and refresh tokens using a valid refresh token."""
    try:
        tokens = await login_service.refresh_access_token(request.refresh_token)
        data = {"access_token": tokens["access_token"], "refresh_token": tokens["refresh_token"]}
        return {"status": "success", "message": "Token refreshed", "data": data}
    except HTTPException as e:
        raise e

@router.post("/logout")
async def logout(
    authorization: str = Header(...),
    jwt_service: JWTService = Depends(get_jwt_service),
    login_service: LoginService = Depends(get_login_service)
):
    """Logs out the user by validating the token and clearing the session."""
    try:
        token = authorization.split(" ")[1]  # Extract Bearer token
        username = jwt_service.validate_token(token)  # Validate the token
        result = await login_service.logout(username)  # Logout logic in LoginService
        return {"status": "success", "message": "Logged out successfully", "data": result}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/authorized-token")
async def authorized_token(
    authorization: str = Header(...),
    jwt_service: JWTService = Depends(get_jwt_service),
):
    """Validates and refreshes the access token if necessary, returning a new one if valid."""
    try:
        access_token = authorization.split(" ")[1]  # Extract Bearer token

        try:
            new_access_token, username = await jwt_service.validate_access_token_and_generate_new_access_token(access_token)
            data = {"access_token": new_access_token, "username": username}
            return {"status": "success", "message": "Token is valid and not expired", "data": data}
        
        except InvalidTokenError:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        except jwt.ExpiredSignatureError:
            raise HTTPException(status_code=401, detail="Token has expired")
        
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
