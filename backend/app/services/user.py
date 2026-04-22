from app.models.user import UserCreate, UserLogin
from app.utils.logger import logger
from fastapi import HTTPException
from app.core.security import hash_password, verify_password, create_access_token

#signup user logics
async def create_user(user:UserCreate,db):
     existing_user = await db["users"].find_one({"email": user.email})

     #Check if user Already exist or not
     if existing_user:
        logger.warning(f"Registration failed: Email {user.email} already exists")
        raise HTTPException(status_code=400, detail="Email already registered")
    
    #Hashing Password 
     hashed = await hash_password(user.password)
     user_dict = {"username": user.username, "email": user.email, "password": hashed}
     await db["users"].insert_one(user_dict)
     logger.info(f"New user registered: {user.email}")
     return {"message": "User created successfully"}

# Login User Logic
async def login_user(user:UserLogin,db):
     db_user = await db["users"].find_one({"email": user.email})
     if not db_user or not await verify_password(user.password, db_user["password"]):
        logger.error(f"Login attempt failed for: {user.email}")
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
     token = await create_access_token({"sub": db_user["email"]})
     logger.info(f"User logged in: {user.email}")
     return {"access_token": token, "token_type": "bearer"}