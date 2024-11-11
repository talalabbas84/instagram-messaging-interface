from fastapi import Depends
from app.core.session_service import SessionService
from app.core.token_service import TokenService
from app.core.redis_helper import RedisHelper
from app.core.jwt_service import JWTService
from app.core.login_service import LoginService
from app.core.message_service import MessageService

# Dependency functions to initialize and manage service instances for injection

def get_session_service():
    """Creates and provides an instance of SessionService."""
    return SessionService()

def get_token_service():
    """Creates and provides an instance of TokenService."""
    return TokenService()

def get_redis_helper():
    """Creates and provides an instance of RedisHelper for managing Redis operations."""
    return RedisHelper()

def get_jwt_service(session_service: SessionService = Depends(get_session_service)):
    """Creates and provides an instance of JWTService with session management."""
    return JWTService(session_service)

def get_login_service(
    session_service: SessionService = Depends(get_session_service),
    jwt_service: JWTService = Depends(get_jwt_service),
):
    """Creates and provides an instance of LoginService with session and JWT support."""
    return LoginService(session_service, jwt_service)

def get_message_service(
    redis_helper: RedisHelper = Depends(get_redis_helper),
    session_service: SessionService = Depends(get_session_service)
):
    """Creates and provides an instance of MessageService with Redis and session support."""
    return MessageService(redis_helper, session_service)
