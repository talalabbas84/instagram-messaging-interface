# app/core/jwt_service.py

import jwt
from datetime import datetime, timedelta
from app.core.config import Config
import logging
from app.core.custom_exceptions import InvalidTokenError, TokenExpiredError

logger = logging.getLogger(__name__)

class JWTService:
    def __init__(self, session_service):
        self.secret_key = Config.JWT_SECRET_KEY
        self.algorithm = Config.JWT_ALGORITHM
        self.session_service = session_service  # Inject session_service

    def generate_tokens(self, username: str):
        """
        Generates access and refresh tokens for a given username.
        """
        expiration = datetime.utcnow() + timedelta(minutes=Config.ACCESS_TOKEN_EXPIRATION_MINUTES)
        access_token = jwt.encode({"sub": username, "exp": expiration}, self.secret_key, algorithm=self.algorithm)
        
        refresh_token_expiration = datetime.utcnow() + timedelta(days=Config.REFRESH_TOKEN_EXPIRATION_DAYS)
        refresh_token = jwt.encode({"sub": username, "exp": refresh_token_expiration}, self.secret_key, algorithm=self.algorithm)

        return access_token, refresh_token
    
    def generate_access_token(self, username: str):
        """
        Generates an access token for a given username.
        """
        expiration = datetime.utcnow() + timedelta(minutes=Config.ACCESS_TOKEN_EXPIRATION_MINUTES)
        access_token = jwt.encode({"sub": username, "exp": expiration}, self.secret_key, algorithm=self.algorithm)
        return access_token

    def validate_token(self, token: str):
        """
        Validates the given JWT token and extracts the username.
        """
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            username = payload.get("sub")
            if not username:
                logger.warning("Invalid token: missing username")
                raise InvalidTokenError("Invalid token")
            # check if the session is active
            session_state = self.session_service.get_session_state(username)  # No await needed
            if not session_state:
                logger.warning(f"Session not found for {username}")
                raise InvalidTokenError("Invalid token")
            
            
            return username
        
        except jwt.ExpiredSignatureError:
            logger.error("Token has expired")
            raise InvalidTokenError("Token has expired")
        except jwt.InvalidTokenError:
            logger.error("Invalid token")
            raise InvalidTokenError("Invalid token")

    async def validate_access_token_and_generate_new_access_token(self, access_token: str):
        """
        Validates the given access token and generates a new access token if valid.
        """
        try:
            username = self.validate_token(access_token)  

            if not username:
                raise InvalidTokenError(detail="Invalid access token")

            logger.info(f"Access token validated for {username}")

            # Generate a new access token
            new_access_token = self.generate_access_token(username)
            

            logger.info(f"New access token generated for {username}")

            return new_access_token, username

        except TokenExpiredError:
            raise TokenExpiredError()
        except InvalidTokenError:
            raise InvalidTokenError()
        

    async def refresh_access_token(self, refresh_token: str):
      """Generate a new access token if the refresh token is valid and update session in Redis."""
      try:
          
          username = self.validate_token(refresh_token)  # Call the validate_token method directly

          if not username:
              raise InvalidTokenError(detail="Invalid refresh token")

          logger.info(f"Refreshing access token for {username}")

          # Generate a new access token and refresh token
          access_token, new_refresh_token = self.generate_tokens(username)

          # Save the new refresh token in Redis with the correct TTL
          self.session_service.save_session(
              f"{username}_refresh_token",  # Key for the refresh token
              new_refresh_token,            # The new refresh token
              ttl=Config.REFRESH_TOKEN_EXPIRATION_DAYS * 24 * 60 * 60  # Set TTL for the new refresh token
          )

          # Also, update the session data with the new access token
          session_state = self.session_service.get_session_state(username)  # No await needed
          self.session_service.save_session(
              f"{username}_session",        # Key for the session
              session_state,                # The session state to update
              ttl=Config.ACCESS_TOKEN_EXPIRATION_MINUTES * 60  # Set TTL for the session
          )

          logger.info(f"New refresh token and session updated for {username}")

          return {"access_token": access_token, "refresh_token": new_refresh_token}

      except TokenExpiredError:
          raise TokenExpiredError()
      except InvalidTokenError:
          raise InvalidTokenError()
