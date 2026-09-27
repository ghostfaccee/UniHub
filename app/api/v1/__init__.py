from fastapi import APIRouter

from app.api.v1.endpoints.main_page import router as mainp_router
from app.api.v1.endpoints.login import router as log_router
from app.api.v1.endpoints.university import router as uv_router

router = APIRouter()

router.include_router(mainp_router)
router.include_router(log_router)
router.include_router(uv_router)
