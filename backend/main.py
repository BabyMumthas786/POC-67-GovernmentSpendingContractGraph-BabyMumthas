"""
Government Spending Contract Graph — FastAPI Backend
Endpoints: /, /contracts, /agencies, /vendors, /graph, /analytics
"""
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List, Dict, Any
import json
import os
import urllib.request
import urllib.parse
import logging
import threading

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Government Spending Contract Graph API",
    description="Intelligence API for government spending and contract data",
    version="1.0.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Data Loading ───
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")


def _load(filename: str):
    with open(os.path.join(DATA_DIR, filename), "r") as f:
        return json.load(f)


AGENCIES = _load("agencies.json")
VENDORS = _load("vendors.json")
CONTRACTS = _load("contracts.json")

# Build lookup dicts for synthetic fallback
AGENCY_MAP = {a["agency_id"]: a for a in AGENCIES}
VENDOR_MAP = {v["vendor_id"]: v for v in VENDORS}

# ─── USAspending.gov & SAM.gov API Integration ───
LIVE_DATA_CACHE = {
    "contracts": [],
    "vendors": [],
    "agencies": [],
    "last_fetched": None
}
LIVE_DATA_LOCK = threading.Lock()

def fetch_from_usaspending() -> Dict[str, Any]:
    url = "https://api.usaspending.gov/api/v2/search/spending_by_award/"
    payload = {
        "filters": {
            "fiscal_years": [2024, 2025],
            "award_type_codes": ["A", "B", "C", "D"] # Contracts
        },
        "fields": [
            "Award ID",
            "Recipient Name",
            "Award Amount",
            "Start Date",
            "Description",
            "Awarding Agency",
            "Awarding Sub Agency",
            "Award Type"
        ],
        "limit": 100,
        "sort": "Award Amount",
        "order": "desc"
    }
    
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url, 
        data=data, 
        headers={"Content-Type": "application/json", "User-Agent": "Mozilla/5.0"}
    )
    
    with urllib.request.urlopen(req, timeout=8) as response:
        res_data = response.read().decode("utf-8")
        return json.loads(res_data)

def fetch_from_sam_gov(vendor_name: str) -> Dict[str, Any]:
    sam_key = os.environ.get("SAM_API_KEY")
    if not sam_key:
        return {}
    
    url = f"https://api.sam.gov/entity-information/v3/entities?api_key={sam_key}&name={urllib.parse.quote(vendor_name)}"
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "Mozilla/5.0"}
    )
    try:
        with urllib.request.urlopen(req, timeout=5) as response:
            res_data = response.read().decode("utf-8")
            return json.loads(res_data)
    except Exception as e:
        logger.warning(f"Failed to fetch from SAM.gov: {e}")
        return {}

def get_live_data(force_refresh: bool = False) -> Dict[str, Any]:
    global LIVE_DATA_CACHE
    
    # Fast path: cache exists and no force refresh
    if LIVE_DATA_CACHE["contracts"] and not force_refresh:
        return LIVE_DATA_CACHE
    
    with LIVE_DATA_LOCK:
        # Double-checked locking
        if LIVE_DATA_CACHE["contracts"] and not force_refresh:
            return LIVE_DATA_CACHE
        
        try:
            logger.info("Fetching live spending data from USAspending.gov...")
            raw_data = fetch_from_usaspending()
            results = raw_data.get("results", [])
            
            if not results:
                logger.warning("USAspending.gov returned empty results. Falling back to synthetic data.")
                LIVE_DATA_CACHE["contracts"] = CONTRACTS
                LIVE_DATA_CACHE["vendors"] = VENDORS
                LIVE_DATA_CACHE["agencies"] = AGENCIES
                LIVE_DATA_CACHE["last_fetched"] = "fallback"
                return LIVE_DATA_CACHE
            
            agencies_map = {}
            vendors_map = {}
            contracts = []
            
            for idx, item in enumerate(results):
                award_id = item.get("Award ID") or f"L-C{idx+1:03d}"
                recipient_name = item.get("Recipient Name") or "UNKNOWN VENDOR"
                amount = item.get("Award Amount") or 0.0
                start_date = item.get("Start Date") or "2024-01-01"
                description = item.get("Description") or ""
                awarding_agency = item.get("Awarding Agency") or "Department of Government"
                
                try:
                    year = int(start_date.split("-")[0])
                except Exception:
                    year = 2024
                    
                agency_slug = awarding_agency.lower().replace(" ", "-").replace(",", "")
                agency_id = f"A_{agency_slug}"
                
                vendor_slug = recipient_name.lower().replace(" ", "-").replace(",", "").replace(".", "").replace("'", "")
                vendor_id = f"V_{vendor_slug}"
                
                desc_upper = description.upper()
                agency_upper = awarding_agency.upper()
                
                category = "Infrastructure"
                if "DEFENSE" in agency_upper or "NAVY" in agency_upper or "ARMY" in agency_upper or "AIR FORCE" in agency_upper:
                    category = "Defense"
                elif "HEALTH" in agency_upper or "MEDIC" in agency_upper or "HUMAN SERVICES" in agency_upper:
                    category = "Healthcare"
                elif "IT" in desc_upper or "SOFTWARE" in desc_upper or "COMPUTER" in desc_upper or "CLOUD" in desc_upper or "TECHNOLOGY" in desc_upper:
                    category = "IT Services"
                elif "ENERGY" in agency_upper or "POWER" in agency_upper or "NUCLEAR" in agency_upper:
                    category = "Energy"
                elif "SCIENCE" in agency_upper or "RESEARCH" in agency_upper or "NASA" in agency_upper or "STUDY" in desc_upper or "R&D" in desc_upper:
                    category = "Research"
                elif "EDUCATION" in agency_upper or "SCHOOL" in agency_upper or "TRAINING" in desc_upper:
                    category = "Education"
                    
                title = description.strip()
                if not title or len(title) < 5 or title.startswith("IGF::") or "::" in title:
                    title = f"{category} Support - {awarding_agency}"
                
                if agency_id not in agencies_map:
                    agencies_map[agency_id] = {
                        "agency_id": agency_id,
                        "agency_name": awarding_agency,
                        "agency_type": "Federal" if "DEPARTMENT" in agency_upper else "Independent",
                        "annual_budget": amount * 5.0
                    }
                else:
                    agencies_map[agency_id]["annual_budget"] += amount * 1.5
                    
                if vendor_id not in vendors_map:
                    sam_data = fetch_from_sam_gov(recipient_name)
                    hq = "Washington, DC"
                    if sam_data and "entity" in sam_data:
                        entity = sam_data["entity"]
                        city = entity.get("physicalAddress", {}).get("city", "")
                        state = entity.get("physicalAddress", {}).get("stateOrProvinceCode", "")
                        if city and state:
                            hq = f"{city}, {state}"
                            
                    vendors_map[vendor_id] = {
                        "vendor_id": vendor_id,
                        "vendor_name": recipient_name,
                        "industry": "Government Contracting" if category == "Defense" else category,
                        "headquarters": hq
                    }
                    
                contracts.append({
                    "contract_id": award_id,
                    "agency_id": agency_id,
                    "vendor_id": vendor_id,
                    "contract_title": title,
                    "amount": int(amount),
                    "year": year,
                    "category": category,
                    "status": "Active" if year >= 2024 else "Completed"
                })
                
            LIVE_DATA_CACHE["agencies"] = list(agencies_map.values())
            LIVE_DATA_CACHE["vendors"] = list(vendors_map.values())
            LIVE_DATA_CACHE["contracts"] = contracts
            LIVE_DATA_CACHE["last_fetched"] = "now"
            
            logger.info(f"Successfully loaded live data from USAspending.gov: {len(contracts)} contracts")
            return LIVE_DATA_CACHE
            
        except Exception as e:
            logger.error(f"Error fetching live data from USAspending.gov: {e}. Falling back to synthetic dataset.")
            LIVE_DATA_CACHE["contracts"] = CONTRACTS
            LIVE_DATA_CACHE["vendors"] = VENDORS
            LIVE_DATA_CACHE["agencies"] = AGENCIES
            LIVE_DATA_CACHE["last_fetched"] = "fallback"
            return LIVE_DATA_CACHE

# ─── Helpers ───
def _filter_contracts(
    contracts: list,
    agency_id: Optional[str] = None,
    vendor_id: Optional[str] = None,
    year: Optional[int] = None,
    category: Optional[str] = None,
    status: Optional[str] = None,
    min_amount: Optional[int] = None,
    max_amount: Optional[int] = None,
) -> list:
    result = contracts
    if agency_id:
        result = [c for c in result if c["agency_id"] == agency_id]
    if vendor_id:
        result = [c for c in result if c["vendor_id"] == vendor_id]
    if year:
        result = [c for c in result if c["year"] == year]
    if category:
        result = [c for c in result if c["category"] == category]
    if status:
        result = [c for c in result if c["status"] == status]
    if min_amount is not None:
        result = [c for c in result if c["amount"] >= min_amount]
    if max_amount is not None:
        result = [c for c in result if c["amount"] <= max_amount]
    return result


# ─── Endpoints ───


@app.get("/")
def home():
    return {"message": "Government Spending Contract Graph API"}


@app.get("/agencies")
def get_agencies(source: Optional[str] = Query(None)):
    if source == "live":
        return get_live_data()["agencies"]
    return AGENCIES


@app.get("/vendors")
def get_vendors(source: Optional[str] = Query(None)):
    if source == "live":
        return get_live_data()["vendors"]
    return VENDORS


@app.get("/contracts")
def get_contracts(
    agency_id: Optional[str] = Query(None),
    vendor_id: Optional[str] = Query(None),
    year: Optional[int] = Query(None),
    category: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    min_amount: Optional[int] = Query(None),
    max_amount: Optional[int] = Query(None),
    source: Optional[str] = Query(None),
):
    contracts = CONTRACTS
    if source == "live":
        contracts = get_live_data()["contracts"]
    return _filter_contracts(
        contracts, agency_id, vendor_id, year, category, status,
        min_amount, max_amount
    )


@app.get("/graph")
def get_graph(
    agency_id: Optional[str] = Query(None),
    vendor_id: Optional[str] = Query(None),
    year: Optional[int] = Query(None),
    category: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    min_amount: Optional[int] = Query(None),
    max_amount: Optional[int] = Query(None),
    source: Optional[str] = Query(None),
):
    """
    Transform contract relationships into graph format.
    Nodes = agencies + vendors, Edges = contracts.
    """
    contracts = CONTRACTS
    agency_map = AGENCY_MAP
    vendor_map = VENDOR_MAP
    
    if source == "live":
        data = get_live_data()
        contracts = data["contracts"]
        agency_map = {a["agency_id"]: a for a in data["agencies"]}
        vendor_map = {v["vendor_id"]: v for v in data["vendors"]}

    filtered = _filter_contracts(
        contracts, agency_id, vendor_id, year, category, status,
        min_amount, max_amount
    )

    # Collect unique agency and vendor IDs from filtered contracts
    agency_ids_in_use = set()
    vendor_ids_in_use = set()
    for c in filtered:
        agency_ids_in_use.add(c["agency_id"])
        vendor_ids_in_use.add(c["vendor_id"])

    # Build nodes
    nodes = []
    for aid in agency_ids_in_use:
        a = agency_map.get(aid, {})
        total = sum(c["amount"] for c in filtered if c["agency_id"] == aid)
        nodes.append({
            "id": a.get("agency_name", aid),
            "type": "agency",
            "agency_id": aid,
            "annual_budget": a.get("annual_budget", 0),
            "total_spending": total,
        })
    for vid in vendor_ids_in_use:
        v = vendor_map.get(vid, {})
        total = sum(c["amount"] for c in filtered if c["vendor_id"] == vid)
        nodes.append({
            "id": v.get("vendor_name", vid),
            "type": "vendor",
            "vendor_id": vid,
            "industry": v.get("industry", ""),
            "total_received": total,
        })

    # Build edges — aggregate by agency+vendor pair
    edge_map = {}
    for c in filtered:
        key = (c["agency_id"], c["vendor_id"])
        if key not in edge_map:
            a = agency_map.get(c["agency_id"], {})
            v = vendor_map.get(c["vendor_id"], {})
            edge_map[key] = {
                "source": a.get("agency_name", c["agency_id"]),
                "target": v.get("vendor_name", c["vendor_id"]),
                "amount": 0,
                "contracts": 0,
                "contract_ids": [],
            }
        edge_map[key]["amount"] += c["amount"]
        edge_map[key]["contracts"] += 1
        edge_map[key]["contract_ids"].append(c["contract_id"])

    edges = list(edge_map.values())

    return {"nodes": nodes, "edges": edges}


@app.get("/analytics")
def get_analytics(
    agency_id: Optional[str] = Query(None),
    vendor_id: Optional[str] = Query(None),
    year: Optional[int] = Query(None),
    category: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    min_amount: Optional[int] = Query(None),
    max_amount: Optional[int] = Query(None),
    source: Optional[str] = Query(None),
):
    """Aggregated analytics from contract data."""
    contracts = CONTRACTS
    agency_map = AGENCY_MAP
    vendor_map = VENDOR_MAP
    
    if source == "live":
        data = get_live_data()
        contracts = data["contracts"]
        agency_map = {a["agency_id"]: a for a in data["agencies"]}
        vendor_map = {v["vendor_id"]: v for v in data["vendors"]}

    filtered = _filter_contracts(
        contracts, agency_id, vendor_id, year, category, status,
        min_amount, max_amount
    )

    if not filtered:
        return {
            "total_spending": 0,
            "total_contracts": 0,
            "total_agencies": 0,
            "total_vendors": 0,
            "average_contract_value": 0,
            "largest_contract": None,
            "top_vendors": [],
            "top_agencies": [],
            "spending_by_year": [],
            "spending_by_category": [],
        }

    total_spending = sum(c["amount"] for c in filtered)
    total_contracts = len(filtered)
    unique_agencies = set(c["agency_id"] for c in filtered)
    unique_vendors = set(c["vendor_id"] for c in filtered)
    avg_value = total_spending / total_contracts if total_contracts else 0
    largest = max(filtered, key=lambda c: c["amount"])

    # Top vendors
    vendor_totals = {}
    for c in filtered:
        vid = c["vendor_id"]
        vendor_totals[vid] = vendor_totals.get(vid, 0) + c["amount"]
    top_vendors = sorted(vendor_totals.items(), key=lambda x: x[1], reverse=True)[:10]
    top_vendors = [
        {
            "vendor_id": vid,
            "vendor_name": vendor_map.get(vid, {}).get("vendor_name", vid),
            "total": total,
        }
        for vid, total in top_vendors
    ]

    # Top agencies
    agency_totals = {}
    for c in filtered:
        aid = c["agency_id"]
        agency_totals[aid] = agency_totals.get(aid, 0) + c["amount"]
    top_agencies = sorted(agency_totals.items(), key=lambda x: x[1], reverse=True)[:10]
    top_agencies = [
        {
            "agency_id": aid,
            "agency_name": agency_map.get(aid, {}).get("agency_name", aid),
            "total": total,
        }
        for aid, total in top_agencies
    ]

    # Spending by year
    year_totals = {}
    for c in filtered:
        y = c["year"]
        year_totals[y] = year_totals.get(y, 0) + c["amount"]
    spending_by_year = [
        {"year": y, "total": t}
        for y, t in sorted(year_totals.items())
    ]

    # Spending by category
    cat_totals = {}
    for c in filtered:
        cat = c["category"]
        cat_totals[cat] = cat_totals.get(cat, 0) + c["amount"]
    spending_by_category = [
        {"category": cat, "total": t}
        for cat, t in sorted(cat_totals.items(), key=lambda x: x[1], reverse=True)
    ]

    return {
        "total_spending": total_spending,
        "total_contracts": total_contracts,
        "total_agencies": len(unique_agencies),
        "total_vendors": len(unique_vendors),
        "average_contract_value": round(avg_value),
        "largest_contract": largest,
        "top_vendors": top_vendors,
        "top_agencies": top_agencies,
        "spending_by_year": spending_by_year,
        "spending_by_category": spending_by_category,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=False)

