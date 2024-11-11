from fastapi import HTTPException

class InvalidSessionError(HTTPException):
    """Exception raised when the user session is invalid or expired."""
    def __init__(self, detail: str = "Invalid session. Please log in again."):
        super().__init__(status_code=401, detail=detail)

class TokenExpiredError(HTTPException):
    """Exception raised when a token has expired."""
    def __init__(self, detail: str = "Token has expired"):
        super().__init__(status_code=401, detail=detail)

class InvalidTokenError(HTTPException):
    """Exception raised when a token is invalid or malformed."""
    def __init__(self, detail: str = "Invalid token"):
        super().__init__(status_code=401, detail=detail)

class LoginFailedError(HTTPException):
    """Exception raised when login fails due to incorrect credentials."""
    def __init__(self, detail: str = "Login failed due to invalid credentials"):
        super().__init__(status_code=401, detail=detail)

class InvalidCredentialsError(HTTPException):
    """Exception raised when provided credentials are invalid."""
    def __init__(self, detail: str = "Invalid credentials"):
        super().__init__(status_code=401, detail=detail)
