from pydantic import BaseModel
from app.core.config import settings

class UserRegister(BaseModel):
    username: str
    password: str
    group: str

class UserLogin(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = 'bearer'
    access_token_expires_in_minutes: int = settings.ACCESS_TOKEN_EXPIRE_MINUTES
