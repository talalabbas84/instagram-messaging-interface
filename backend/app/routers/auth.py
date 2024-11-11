# app/routers/auth.py

from fastapi import APIRouter, HTTPException, Depends
from app.core.login_service import LoginService
from app.models.auth_models import LoginRequest
from app.dependencies import get_login_service  # Updated import from dependencies
from pydantic import BaseModel  # Import BaseModel if not already done

# Define RefreshTokenRequest if it's missing
class RefreshTokenRequest(BaseModel):
    refresh_token: str

router = APIRouter()

@router.post("/login")
async def login(request: LoginRequest, login_service: LoginService = Depends(get_login_service)):  # Inject LoginService
    try:
        result = await login_service.login(request.username, request.password)
        return result
    except HTTPException as e:
        raise e

@router.post("/refresh-token")
async def refresh_token(request: RefreshTokenRequest, login_service: LoginService = Depends(get_login_service)):  # Inject LoginService
    try:
        tokens = await login_service.refresh_access_token(request.refresh_token)
        return tokens
    except HTTPException as e:
        raise e

@router.post("/logout")
async def logout(authorization: str, login_service: LoginService = Depends(get_login_service)):  # Inject LoginService
    try:
        token = authorization.split(" ")[1]
        username = login_service.token_service.validate_token(token)  
        result = await login_service.logout(username)
        return result
    except HTTPException as e:
        raise e
