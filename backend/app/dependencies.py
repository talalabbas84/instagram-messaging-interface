# app/dependencies.py

from fastapi import Depends
from app.core.session_service import SessionService
from app.core.token_service import TokenService
from app.core.redis_helper import RedisHelper
from app.core.jwt_service import JWTService  # Import the new JWTService
from app.core.login_service import LoginService
from app.core.message_service import MessageService

# Dependency functions
def get_session_service():
    return SessionService()

def get_token_service():
    return TokenService()

def get_redis_helper():
    return RedisHelper()


def get_jwt_service(session_service: SessionService = Depends(get_session_service)):
    # Pass the session_service to JWTService
    return JWTService(session_service)


def get_login_service(
    session_service: SessionService = Depends(get_session_service),
    jwt_service: JWTService = Depends(get_jwt_service),
):
    return LoginService(session_service, jwt_service)
def get_message_service(
    redis_helper: RedisHelper = Depends(get_redis_helper),
    session_service: SessionService = Depends(get_session_service)
):
    return MessageService(redis_helper, session_service)
