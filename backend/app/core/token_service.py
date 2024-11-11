# app/core/token_service.py
import jwt
from datetime import datetime, timedelta
from app.core.custom_exceptions import TokenExpiredError, InvalidTokenError
from app.core.config import Config  # Import Config

class TokenService:
    @staticmethod
    def generate_tokens(username: str):
        access_token = TokenService._generate_token(username, Config.ACCESS_TOKEN_EXPIRATION_MINUTES)
        refresh_token = TokenService._generate_token(username, Config.REFRESH_TOKEN_EXPIRATION_DAYS * 1440)
        return access_token, refresh_token

    @staticmethod
    def _generate_token(username: str, expiration_minutes: int):
        expiration = datetime.utcnow() + timedelta(minutes=expiration_minutes)
        token = jwt.encode({"sub": username, "exp": expiration}, Config.JWT_SECRET_KEY, algorithm=Config.JWT_ALGORITHM)
        return token

    @staticmethod
    def validate_token(token: str) -> str:
        try:
            payload = jwt.decode(token, Config.JWT_SECRET_KEY, algorithms=[Config.JWT_ALGORITHM])
            return payload.get("sub")
        except jwt.ExpiredSignatureError:
            raise TokenExpiredError()
        except jwt.InvalidTokenError:
            raise InvalidTokenError()
