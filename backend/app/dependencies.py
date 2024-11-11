# app/dependencies.py

from fastapi import Depends
from app.core.session_service import SessionService
from app.core.token_service import TokenService
from app.core.redis_helper import RedisHelper
from app.core.login_service import LoginService


# Dependency functions
def get_session_service():
    return SessionService()


def get_token_service():
    return TokenService()


def get_redis_helper():
    return RedisHelper()


def get_login_service(
    session_service: SessionService = Depends(get_session_service),
    token_service: TokenService = Depends(get_token_service),
):
    return LoginService(session_service, token_service)
