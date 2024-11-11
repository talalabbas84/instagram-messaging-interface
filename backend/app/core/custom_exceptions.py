# app/utils/custom_exceptions.py

from fastapi import HTTPException


class InvalidSessionError(HTTPException):
    def __init__(self, detail: str = "Invalid session. Please log in again."):
        super().__init__(status_code=401, detail=detail)


class TokenExpiredError(HTTPException):
    def __init__(self, detail: str = "Token has expired"):
        super().__init__(status_code=401, detail=detail)


class InvalidTokenError(HTTPException):
    def __init__(self, detail: str = "Invalid token"):
        super().__init__(status_code=401, detail=detail)


class LoginFailedError(HTTPException):
    def __init__(self, detail: str = "Login failed due to invalid credentials"):
        super().__init__(status_code=401, detail=detail)

class InvalidCredentialsError(HTTPException):
    def __init__(self, detail: str = "Invalid credentials"):
        super().__init__(status_code=401, detail=detail)
