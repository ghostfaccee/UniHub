from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.auth import UserRegister, TokenResponse, UserLogin
from app.utils.passwords.passutils import hash_password, verify_password
from app.repository.auth import UserRepository
from app.models.user import User
from app.utils.jwt.jwt import create_access_token

class AuthService:
    def __init__(self, db: AsyncSession) -> None:
        self.repo = UserRepository(db)

    async def register(self, data: UserRegister) -> User:
        existing = await self.repo.get_by_username(data.username)
        if existing:
            raise Exception
        token = None
        hashed_pwd = hash_password(data.password)
        user = User(
            username = data.username,
            hashed_password = hashed_pwd,
            group = data.group
        )
        return await self.repo.create(user)
    
    async def login(self, data: UserLogin) -> TokenResponse:
        exists = await self.repo.get_by_username(data.username)
        if not exists:
            raise Exception
        if not verify_password(data.password, exists.hashed_password):
            raise Exception
        access_token = create_access_token({'sub': str(exists.user_id)})
        return TokenResponse(access_token = access_token)