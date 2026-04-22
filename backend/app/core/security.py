import jwt
from datetime import datetime, timedelta,UTC
from pwdlib import PasswordHash
from app.core.config import settings

password_hash = PasswordHash.recommended()

async def hash_password(password: str) -> str:
    return password_hash.hash(password)

async def verify_password(plain: str, hashed: str) -> bool:
    return password_hash.verify(plain, hashed)

async def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(UTC) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": int(expire.timestamp())})
    return jwt.encode(to_encode, settings.ACCESS_TOKEN_KEY, algorithm=settings.ALGORITHM)