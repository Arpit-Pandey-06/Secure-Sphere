from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
from fastapi import HTTPException

class Database:
    client: AsyncIOMotorClient 


async def connect_to_mongo():
    global client
    client = AsyncIOMotorClient(settings.MONGO_URL)
    print("Connected to MongoDB")

async def close_mongo_connection():
    global client
    if client:
        client.close()
        print("connection closed")
def db():
    global client
    if not client:
        raise HTTPException(400,"Not Found")
    return client[settings.DATABASE_NAME]


async def seed_nsfw_data():
    global client
    db_name = client[settings.DATABASE_NAME]
    
    # Check if we already have data
    count = await db_name["nsfw"].count_documents({})
    if count == 0:
        config_data = {
            "type": "global_config",
            "blacklist_domains": ["pornhub.com", "redtube.com", "xvideos.com", "casino.org","jav.org","milfnut.com","xhamster.com","xxxtabooo.com"],
            "keywords": ["adult", "xxx", "porn", "betting", "gambling", "nude", "sex","jav","hanime","hentai","misjav","taboo"]
        }
        await db_name["nsfw"].insert_one(config_data)
        print("NSFW configuration seeded to MongoDB.")