from fastapi import FastAPI
from app.api import router
from app.core.database import Base, engine
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(lifespan = lifespan)

app.include_router(router)