from fastapi import APIRouter, HTTPException,Depends
from pydantic import BaseModel
from app.db.mongodb import db
from app.utils.logger import logger
import asyncio

router = APIRouter()

class URLCheckRequest(BaseModel):
    url: str
    strict_mode: bool = False

@router.post("/check")
async def check_content(data: URLCheckRequest,db = Depends(db)):
    url_lower = data.url.lower().strip()
    domain = url_lower.replace("https://", "").replace("http://", "").split("/")[0]

    # FETCH FROM DB: Get the latest blacklist and keywords
    config = await db["nsfw"].find_one({"type": "global_config"})
    
    if not config:
        logger.error("NSFW configuration missing in Database!")
        # Fallback to empty lists if DB is empty to avoid crashing
        blacklist = []
        keywords = []
    else:
        blacklist = config.get("blacklist_domains", [])
        keywords = config.get("keywords", [])

    # Logic Layer 1: Domain Blacklist
    if domain in blacklist:
        logger.info(f"BLOCKED: Domain {domain} found in Database Blacklist.")
        return {
            "url": data.url,
            "blocked": True,
            "category": "Blacklisted Domain",
            "confidence": 100
        }

    # Logic Layer 2: Keyword Scanning
    # If strict mode is on, we can append extra sensitivity if needed
    current_keywords = keywords.copy()
    if data.strict_mode:
        current_keywords.extend(["dating", "bikini"]) # Example strict additions

    found_keywords = [word for word in current_keywords if word in url_lower]
    
    if found_keywords:
        logger.info(f"BLOCKED: Keywords {found_keywords} detected in URL.")
        return {
            "url": data.url,
            "blocked": True,
            "category": "Restricted Content",
            "confidence": 90,
            "details": f"Matches: {', '.join(found_keywords)}"
        }

    return {
        "url": data.url,
        "blocked": False,
        "category": "Safe",
        "confidence": 98
    }