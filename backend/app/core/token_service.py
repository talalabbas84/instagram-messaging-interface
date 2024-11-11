import jwt
from datetime import datetime, timedelta
from app.core.custom_exceptions import TokenExpiredError, InvalidTokenError
from app.core.config import Config

class TokenService:
    """Service for generating and validating JWT tokens."""

    @staticmethod
    def generate_tokens(username: str):
        """Generates both access and refresh tokens for a given username."""
        access_token = TokenService._generate_token(username, Config.ACCESS_TOKEN_EXPIRATION_MINUTES)
        refresh_token = TokenService._generate_token(username, Config.REFRESH_TOKEN_EXPIRATION_DAYS * 1440)
        return access_token, refresh_token

    @staticmethod
    def _generate_token(username: str, expiration_minutes: int):
        """Generates a JWT token with a specified expiration time."""
        expiration = datetime.utcnow() + timedelta(minutes=expiration_minutes)
        token = jwt.encode({"sub": username, "exp": expiration}, Config.JWT_SECRET_KEY, algorithm=Config.JWT_ALGORITHM)
        return token

    @staticmethod
    def validate_token(token: str) -> str:
        """Validates a JWT token, returning the username if valid or raising an error if invalid or expired."""
        try:
            payload = jwt.decode(token, Config.JWT_SECRET_KEY, algorithms=[Config.JWT_ALGORITHM])
            return payload.get("sub")
        except jwt.ExpiredSignatureError:
            raise TokenExpiredError()  # Raised if the token has expired
        except jwt.InvalidTokenError:
            raise InvalidTokenError()  # Raised if the token is invalid or tampered with
