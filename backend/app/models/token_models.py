from pydantic import BaseModel

# Request model for refreshing a token
class RefreshTokenRequest(BaseModel):
    refresh_token: str

# Request model for passing both access and refresh tokens
class TokenRequest(BaseModel):
    access_token: str
    refresh_token: str
