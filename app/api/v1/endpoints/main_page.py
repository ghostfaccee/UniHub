from fastapi import APIRouter, Request

router = APIRouter()

@router.get('/')
async def mainpage():
    return {'detail': 'Welcome to mainpage :)'}
