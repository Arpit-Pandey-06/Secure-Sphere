from fastapi import APIRouter, HTTPException, status,Depends
from app.models.user import UserCreate, UserLogin
from app.db.mongodb import db
from app.core.config import settings

from app.services.user import create_user,login_user,google_auth

router = APIRouter()

@router.post("/register")
async def register(user: UserCreate,db=Depends(db)):
        return await create_user(user,db)
   

@router.post("/login")
async def login(user: UserLogin,db=Depends(db)):
    return await login_user(user,db)

@router.post("/google")
async def google(data: dict,db=Depends(db)):
    return await google_auth(data,db)