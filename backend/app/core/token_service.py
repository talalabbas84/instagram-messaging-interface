from datetime import datetime, timedelta

import jwt


class TokenService:
    @staticmethod
    def generate_tokens(username: str):
        """
        Generates an access token and a refresh token for the given username.
        """
        pass

    @staticmethod
    def _generate_token(username: str, expiration_minutes: int):
        """
        Generates a JWT token with the specified expiration time for the given username.
        """
        pass

    @staticmethod
    def validate_token(token: str) -> str:
        """
        Validates the provided JWT token and returns the username if valid.
        """
        pass
