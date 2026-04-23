from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from app.db.mongodb import db
from app.utils.logger import logger
from datetime import datetime
import ahocorasick
import math

router = APIRouter()

class URLCheckRequest(BaseModel):
    url: str
    strict_mode: bool = False

def calculate_entropy(text: str) -> float:
    """Detects if a domain looks 'randomly generated' (DGA detection)."""
    if not text: return 0
    entropy = 0
    for x in range(256):
        p_x = float(text.count(chr(x))) / len(text)
        if p_x > 0:
            entropy += - p_x * math.log(p_x, 2)
    return entropy

def get_matches_fast(text, keywords):
    """Uses Aho-Corasick for high-speed pattern matching."""
    if not keywords: return []
    A = ahocorasick.Automaton()
    for word in keywords:
        A.add_word(word, word)
    A.make_automaton()
    
    found = []
    for end_index, original_value in A.iter(text):
        found.append(original_value)
    return list(set(found)) # Return unique matches

# ... existing imports ...

@router.post("/check")
async def check_content(data: URLCheckRequest, db = Depends(db)):
    url_lower = data.url.lower().strip()
    domain = url_lower.replace("https://", "").replace("http://", "").split("/")[0]

    # LAYER 0: Known Malicious TLDs (Heuristic)
    # Most malware uses cheap TLDs like .top, .xyz, .click, .gdn
    malicious_tlds = [".top", ".xyz", ".click", ".gdn", ".pw", ".bid"]
    is_shady_tld = any(domain.endswith(tld) for tld in malicious_tlds)

    # LAYER 1: Database Check
    config = await db["nsfw"].find_one({"type": "global_config"})
    blacklist = config.get("blacklist_domains", []) if config else []
    keywords = config.get("keywords", [])
    
    is_blocked = False
    category = "Safe"
    
    if domain in blacklist:
        is_blocked = True
        category = "Blacklisted Domain"
    
    # LAYER 2: Advanced Heuristics (Randomness & Length)
    elif calculate_entropy(domain) > 4.5 or (is_shady_tld and len(domain) > 15):
        is_blocked = True
        category = "Malicious (DGA/Phishing Pattern)"
        confidence = 88

    # LAYER 3: Keyword Match
    # ... your existing Aho-Corasick logic ...
    else:
        search_keywords = keywords.copy()
        if data.strict_mode:
            search_keywords.extend(["dating", "bikini", "gamble"])
            
        matches = get_matches_fast(url_lower, search_keywords)
        if matches:
            is_blocked = True
            category = "Restricted Content"
            confidence = 92
            details = f"Matched keywords: {', '.join(matches)}"



    # LOGGING (Crucial for your Dashboard)
    await db["scans"].insert_one({
        "target": data.url,
        "verdict": "blocked" if is_blocked else "safe",
        "category": category,
        "engine": "SecureSphere-HEURISTICS-V3",
        "type": "url",
        "scanned_at": datetime.now()
    })

    if is_blocked:
        # Create a THREAT record for the Alerts page
        await db["threats"].insert_one({
            "url": data.url,
            "type": category,
            "severity": "critical" if is_blocked else "low",
            "status": "active",
            "source": "Heuristic Engine",
            "detected_at": datetime.now().isoformat()
        })

    return {"url": data.url, "blocked": is_blocked, "category": category}