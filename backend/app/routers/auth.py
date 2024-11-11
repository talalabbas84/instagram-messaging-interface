from fastapi import APIRouter, HTTPException, Depends, Header  
from app.core.login_service import LoginService
from app.models.auth_models import LoginRequest
from app.dependencies import get_login_service, get_jwt_service
from app.core.jwt_service import JWTService
from pydantic import BaseModel  # Import BaseModel if not already done
import jwt
from jwt.exceptions import InvalidTokenError


# Define RefreshTokenRequest if it's missing
class RefreshTokenRequest(BaseModel):
    refresh_token: str

class TokenRequest(BaseModel):
    access_token: str
    refresh_token: str

router = APIRouter()

@router.post("/login")
async def login(request: LoginRequest, login_service: LoginService = Depends(get_login_service)):  # Inject LoginService
    try:
        access_token, refresh_token = await login_service.login(request.username, request.password)
        data = {"access_token": access_token, "refresh_token": refresh_token, "username": request.username}
        return {"status": "success", "message": "Login successful", "data": data}
    except HTTPException as e:
        raise e

@router.post("/refresh-token")
async def refresh_token(request: RefreshTokenRequest, login_service: LoginService = Depends(get_login_service)):  # Inject LoginService
    try:
        tokens = await login_service.refresh_access_token(request.refresh_token)
        data = {"access_token": tokens["access_token"], "refresh_token": tokens["refresh_token"]}
        return {"status": "success", "message": "Token refreshed", "data": data}
    except HTTPException as e:
        raise e


@router.post("/logout")
async def logout(
    authorization: str = Header(...),  # This header will contain the Authorization Bearer token
    jwt_service: JWTService = Depends(get_jwt_service),  # Inject JWTService for token validation
    login_service: LoginService = Depends(get_login_service)  # Inject LoginService
):
    try:
        # Extract the token from the authorization header
        token = authorization.split(" ")[1]

        # Use JWTService to validate the token
        username = jwt_service.validate_token(token)

        # Proceed with logout logic, using LoginService if necessary
        result = await login_service.logout(username)

        return {"status": "success", "message": "Logged out successfully", "data": result}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/authorized-token")
async def authorized_token(
    authorization: str = Header(...),  # Authorization header with the Bearer token
    jwt_service: JWTService = Depends(get_jwt_service),  # Inject JWTService for token validation
):
    try:
        # Extract the token from the authorization header
        access_token = authorization.split(" ")[1]

        
        # Try to validate the access token
        try:
            new_access_token, username = await jwt_service.validae_access_token_and_generate_new_access_token(access_token)
            message = "Token is valid and not expired"
            data = {"access_token": new_access_token, "username": username}
            return {"status": "success", "message": message, "data": data}
        
        except InvalidTokenError:
            # Handle invalid token (i.e., malformed or tampered tokens)
            raise HTTPException(status_code=401, detail="Invalid token")
        
        except jwt.ExpiredSignatureError:
           
            # Handle expired token
            raise HTTPException(status_code=401, detail="Token has expired")
        
    except HTTPException as e:
        raise e  # Reraise the HTTPException if it occurs during validation
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
