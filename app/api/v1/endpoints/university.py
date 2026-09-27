from fastapi import APIRouter, Depends
from app.dependencies import get_current_user_id
from uuid import UUID

router = APIRouter()

@router.get('/timetable')
async def timetable(current_user_id: UUID = Depends(get_current_user_id)):
    return {"detail": "https://edu.sfu-kras.ru/timetable"}

@router.get('/ecourses')
async def ecourses(current_use_id: UUID = Depends(get_current_user_id)):
    return {'detail' : 'https://e.sfu-kras.ru/?redirect=0'}

@router.get('usport')
async def usport(current_user_id: UUID = Depends(get_current_user_id)):
    return {'detail' : 'https://u-sport.sfu-kras.ru/spec/'}

@router.get('/papers')
async def papers(current_user_id: UUID = Depends(get_current_user_id)):
    return {'detail' : 'https://i.sfu-kras.ru/'}

@router.get('/uniinfo')
async def uniinfo(current_user_id: UUID = Depends(get_current_user_id)):
    return {'detail' : 'https://i.sfu-kras.ru/'}

@router.get('/aboutus')
async def aboutud(current_user_id: UUID = Depends(get_current_user_id)):
    return {'detail' : 'https://t.me/ikitcodzilla'}
