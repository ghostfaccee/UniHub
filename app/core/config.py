from pydantic import ConfigDict
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    SECRET_JWT_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int

    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str
    POSTGRES_URL: str

    REDIS_URL: str

    model_config = ConfigDict(env_file = '.env', case_sensitive = True)

settings = Settings()