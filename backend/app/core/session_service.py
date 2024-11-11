# app/utils/session_service.py

import json
from cryptography.fernet import Fernet
from app.core.redis_helper import RedisHelper
import os
import logging
from app.core.custom_exceptions import InvalidSessionError

logger = logging.getLogger(__name__)
ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY")  # Ensure this is securely stored

# Initialize RedisHelper and encryption key
redis_helper = RedisHelper()
fernet = Fernet(ENCRYPTION_KEY)

class SessionService:
    def __init__(self):
        if not ENCRYPTION_KEY:
            raise ValueError("ENCRYPTION_KEY must be set in environment variables")

    def save_session(self, username: str, session_data: dict, ttl: int):
        """Encrypt and save session data securely."""
        try:
            encrypted_data = self.encrypt_session_data(session_data)
            redis_helper.set_session(f"{username}_session", encrypted_data, expiration=ttl)
            logger.info(f"Session for {username} saved securely.")
        except Exception as e:
            logger.error(f"Failed to save session for {username}: {str(e)}")
            raise InvalidSessionError("Failed to save session")

    def get_session(self, username: str) -> dict:
        """Retrieve and decrypt session data."""
        encrypted_data = redis_helper.get_session(f"{username}_session")
        if not encrypted_data:
            logger.warning(f"Session not found for {username}")
            raise InvalidSessionError("Session not found. Please log in again.")
        return self.decrypt_session_data(encrypted_data)

    def delete_session(self, username: str):
        """Delete session data securely."""
        try:
            redis_helper.delete_session(f"{username}_session")
            print(f"Session for {username} deleted from Redis.")
            logger.info(f"Session for {username} deleted from Redis.")
        except Exception as e:
            logger.error(f"Failed to delete session for {username}: {str(e)}")
            raise InvalidSessionError("Failed to delete session")

    def encrypt_session_data(self, session_data: dict) -> bytes:
        """Encrypt session data for secure storage."""
        json_data = json.dumps(session_data).encode("utf-8")
        return fernet.encrypt(json_data)

    @staticmethod
    def decrypt_session_data(encrypted_data: bytes) -> dict:
        """Decrypt session data securely."""
        decrypted_data = fernet.decrypt(encrypted_data)
        return json.loads(decrypted_data.decode("utf-8"))
