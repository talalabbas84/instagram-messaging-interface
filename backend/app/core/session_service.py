# app/utils/session_service.py

import json
from cryptography.fernet import Fernet
import os
import logging

logger = logging.getLogger(__name__)
ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY")  # Ensure this is securely stored

fernet = Fernet(ENCRYPTION_KEY) if ENCRYPTION_KEY else None


class SessionService:
    def __init__(self):
        if not ENCRYPTION_KEY:
            raise ValueError("ENCRYPTION_KEY must be set in environment variables")

    def save_session(self, username: str, session_data: dict, ttl: int):
        """Encrypt and save session data securely."""
        pass

    def get_session(self, username: str) -> dict:
        """Retrieve and decrypt session data."""
        pass

    def delete_session(self, username: str):
        """Delete session data securely."""
        pass

    def encrypt_session_data(self, session_data: dict) -> bytes:
        """Encrypt session data for secure storage."""
        pass

    @staticmethod
    def decrypt_session_data(encrypted_data: bytes) -> dict:
        """Decrypt session data securely."""
        pass
