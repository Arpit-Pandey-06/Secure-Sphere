from fastapi import APIRouter, HTTPException,Depends
from app.db.mongodb import db
from app.utils.logger import logger
from typing import List
import time

router = APIRouter()

@router.get("/")
async def get_all_threats(db = Depends(db)):
    """Fetches all threats from MongoDB for the Threat Log and Alerts."""
    try:
        # Fetch from 'threats' collection
        threats = await db["threats"].find().to_list(length=100)
        # Convert MongoDB _id to string 'id' for frontend compatibility
        for t in threats:
            t["id"] = str(t.pop("_id"))
        return threats
    except Exception as e:
        logger.error(f"Failed to fetch threats: {e}")
        raise HTTPException(status_code=500, detail="Database fetch failed")


@router.patch("/{threat_id}/resolve")
async def resolve_threat(threat_id: str,db=Depends(db)):
    """Updates a threat status to 'resolved' in MongoDB."""
    from bson import ObjectId
    try:
        result = await db["threats"].update_one(
            {"_id": ObjectId(threat_id)},
            {"$set": {"status": "resolved"}}
        )
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Threat not found")
        
        logger.info(f"Threat {threat_id} marked as resolved.")
        return {"message": "Threat resolved"}
    except Exception as e:
        logger.error(f"Resolve failed for {threat_id}: {e}")
        raise HTTPException(status_code=400, detail="Invalid ID format")