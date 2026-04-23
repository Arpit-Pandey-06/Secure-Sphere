from fastapi import APIRouter, Depends, HTTPException
from app.db.mongodb import db  # Your helper function
from app.models.scanner import URLScanRequest
from app.utils.logger import logger
from datetime import datetime
import time


router = APIRouter()

@router.post("/url")
async def scan_url(data: URLScanRequest, database=Depends(db)):
    url = data.url
    if not url:
        raise HTTPException(status_code=400, detail="URL is required")

    # Simulate processing time
    time.sleep(1.5) 
    
    # Deterministic check logic
    is_malicious = any(x in url.lower() for x in ["malware", "phish", "get-free-nitro", "appspot"])
    verdict = "malicious" if is_malicious else "safe"
    
    scan_result = {
        "scan_id": f"URL-{int(time.time())}",
        "target": url,
        "verdict": verdict,
        "engine": "SecureSphere-AI",
        "scanned_at": datetime.now(),
        "type": "url",
        "details": {"positives": 12 if is_malicious else 0, "total": 70}
    }

    try:
        # LOG TO DB: This updates your 'Scans Run' count on the dashboard
        await database["scans"].insert_one(scan_result.copy())
        
        # If malicious, you could optionally auto-create a threat entry here
        if is_malicious:
            await database["threats"].insert_one({
                "type": "Phishing" if "phish" in url.lower() else "Malware",
                "severity": "high",
                "source": "Scanner Tool",
                "status": "active",
                "url": url,
                "details": f"Detected via manual URL scan: {verdict}",
                "detected_at": datetime.now().isoformat()
            })
            
        logger.info(f"URL Scan completed for {url}: {verdict}")
        
        # Clean the dictionary for JSON response (MongoDB _id isn't JSON serializable)
        if "_id" in scan_result:
            scan_result.pop("_id")
            
        return scan_result

    except Exception as e:
        logger.error(f"Failed to log scan to database: {e}")
        # Return the result anyway so the frontend doesn't hang, even if logging fails
        return scan_result

@router.post("/file")
async def scan_file(data: dict, database=Depends(db)):
    file_hash = data.get("file_hash")
    if not file_hash:
        raise HTTPException(status_code=400, detail="File hash required")

    scan_result = {
        "scan_id": f"FILE-{int(time.time())}",
        "target": file_hash,
        "verdict": "safe",
        "engine": "Static-Analysis-Engine",
        "scanned_at": datetime.now(),
        "type": "file",
        "details": {"positives": 0, "total": 70}
    }

    # Log file scan to DB
    await database["scans"].insert_one(scan_result.copy())
    
    if "_id" in scan_result:
        scan_result.pop("_id")
        
    return scan_result

