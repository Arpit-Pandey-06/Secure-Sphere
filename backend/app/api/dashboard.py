from fastapi import APIRouter, Depends
from app.db.mongodb import db # Your helper function
from app.utils.logger import logger

router = APIRouter()

@router.get("/stats")
async def get_dashboard_stats(database=Depends(db)):
    """Calculates live statistics from MongoDB for the frontend dashboard cards."""
    try:
        # 1. Count real documents from 'threats' collection
        total = await database["threats"].count_documents({})
        active = await database["threats"].count_documents({"status": "active"})
        resolved = await database["threats"].count_documents({"status": "resolved"})
        
        # 2. Count real documents from 'scans' collection
        total_scans = await database["scans"].count_documents({})

        # 3. Aggregation: Threats by Type
        type_pipeline = [{"$group": {"_id": "$type", "count": {"$sum": 1}}}]
        type_data = await database["threats"].aggregate(type_pipeline).to_list(length=10)
        threats_by_type = {item["_id"]: item["count"] for item in type_data}

        # 4. Aggregation: Severity Breakdown
        sev_pipeline = [{"$group": {"_id": "$severity", "count": {"$sum": 1}}}]
        sev_data = await database["threats"].aggregate(sev_pipeline).to_list(length=10)
        threats_by_severity = {item["_id"]: item["count"] for item in sev_data}

        # 5. Return JSON matching your frontend 'stats' state
        return {
            "total_threats": total,
            "active_threats": active,
            "resolved_threats": resolved,
            "total_scans": total_scans,
            "threats_by_type": threats_by_type,
            "threats_by_severity": threats_by_severity
        }
        
    except Exception as e:
        logger.error(f"Dashboard Stats calculation failed: {e}")
        # Return fallback zeros so the frontend doesn't break if DB is empty
        return {
            "total_threats": 0, "active_threats": 0, "resolved_threats": 0, "total_scans": 0,
            "threats_by_type": {}, "threats_by_severity": {}
        }

@router.get("/activity")
async def get_recent_activity(database=Depends(db)):
    # Fetch the 5 most recent scans/events
    activity = await database["scans"].find().sort("scanned_at", -1).to_list(length=5)
    return [
        {
            "time": a["scanned_at"].strftime("%H:%M"),
            "event": f"{a['type'].upper()} scan completed",
            "source": a["engine"],
            "type": "scan" if a["verdict"] == "safe" else "threat"
        } for a in activity
    ]
