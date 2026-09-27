from fastapi import APIRouter, status
from app.schemas.auth import TokenResponse, UserLogin, UserRegister
from app.dependencies import get_auth_service
from fastapi import Depends

router = APIRouter()

@router.post('/register')
async def register(data: UserRegister, service = Depends(get_auth_service)):
    return await service.register(data)

@router.post('/login', response_model = TokenResponse)
async def login(data: UserLogin, service = Depends(get_auth_service)):
    return await service.login(data)

