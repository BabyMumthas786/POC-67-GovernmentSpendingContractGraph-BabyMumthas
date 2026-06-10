"""
Government Spending Contract Graph — FastAPI Backend
Endpoints: /, /contracts, /agencies, /vendors, /graph, /analytics
"""
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List
import json
import os

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

# Build lookup dicts
AGENCY_MAP = {a["agency_id"]: a for a in AGENCIES}
VENDOR_MAP = {v["vendor_id"]: v for v in VENDORS}


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
def get_agencies():
    return AGENCIES


@app.get("/vendors")
def get_vendors():
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
):
    return _filter_contracts(
        CONTRACTS, agency_id, vendor_id, year, category, status,
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
):
    """
    Transform contract relationships into graph format.
    Nodes = agencies + vendors, Edges = contracts.
    """
    filtered = _filter_contracts(
        CONTRACTS, agency_id, vendor_id, year, category, status,
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
        a = AGENCY_MAP.get(aid, {})
        total = sum(c["amount"] for c in filtered if c["agency_id"] == aid)
        nodes.append({
            "id": a.get("agency_name", aid),
            "type": "agency",
            "agency_id": aid,
            "annual_budget": a.get("annual_budget", 0),
            "total_spending": total,
        })
    for vid in vendor_ids_in_use:
        v = VENDOR_MAP.get(vid, {})
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
            a = AGENCY_MAP.get(c["agency_id"], {})
            v = VENDOR_MAP.get(c["vendor_id"], {})
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
):
    """Aggregated analytics from contract data."""
    filtered = _filter_contracts(
        CONTRACTS, agency_id, vendor_id, year, category, status,
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
            "vendor_name": VENDOR_MAP.get(vid, {}).get("vendor_name", vid),
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
            "agency_name": AGENCY_MAP.get(aid, {}).get("agency_name", aid),
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
