from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth , scanner , nsfw
from app.db.mongodb import connect_to_mongo, close_mongo_connection,seed_nsfw_data
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app:FastAPI):
    await connect_to_mongo()
    await seed_nsfw_data()
    yield
    await close_mongo_connection()

app = FastAPI(title="SecureSphere API",lifespan=lifespan)

# CRITICAL: Allow your frontend to talk to the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(scanner.router, prefix="/api/scan", tags=["Scanner"])
app.include_router(nsfw.router,prefix="/api/nsfw",tags=["NSFW"])

@app.get("/health")
def health_check():
    return {"status": "online"}