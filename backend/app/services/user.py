from app.models.user import UserCreate, UserLogin
from app.utils.logger import logger
from fastapi import HTTPException
from app.core.security import hash_password, verify_password, create_access_token
from google.oauth2 import id_token #
from google.auth.transport import requests as google_requests
from app.core.config import settings
from datetime import datetime

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


#Google Auth
async def google_auth(data:dict,db):
    token = data.get("token")
    try:
        # Verify the token directly with Google's API
      idinfo = id_token.verify_oauth2_token(
            token, 
            google_requests.Request(), 
            settings.GOOGLE_CLIENT_ID
        )
        
      email = idinfo['email']
      username = idinfo.get('name', email.split('@')[0])

        # Check if user exists, or create a new 'Social' account
      user = await db["users"].find_one({"email": email})
      if not user:
            new_user = {
                "username": username,
                "email": email,
                "auth_type": "google",
                "created_at": datetime.now()
            }
            await db["users"].insert_one(new_user)
        
        # Return your app's standard JWT so the rest of the app works
      access_token = await create_access_token(data={"sub": email})
      return {"access_token": access_token, "token_type": "bearer"}

    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid Google token")   