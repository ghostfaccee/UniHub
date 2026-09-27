from fastapi.security import OAuth2PasswordBearer
from app.services.auth import AuthService
from app.core.database import get_db
from app.utils.jwt.jwt import decode_access_token
from fastapi import Depends
from uuid import UUID

async def get_auth_service(db = Depends(get_db)) -> AuthService:
    return AuthService(db)

oauth_2_scheme = OAuth2PasswordBearer(tokenUrl = '/login')
async def get_current_user_id(token: str = Depends(oauth_2_scheme)) -> UUID:
    payload = decode_access_token(token)
    if not payload:
        raise Exception
    user_id = payload.get('sub')
    if not user_id:
        raise Exception
    return UUID(user_id)