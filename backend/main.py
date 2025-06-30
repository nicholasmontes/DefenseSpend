from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import requests

app = FastAPI()

# Allow CORS so frontend can access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_URL = "https://api.usaspending.gov/api/v2"

def fetch_award_summary(toptier_code: str, year: int, agency_type="awarding", award_type_codes=None):
    if award_type_codes is None:
        award_type_codes = ["A", "B", "C", "D"]
    body = {
        "toptier_code": toptier_code,
        "fiscal_year": year,
        "agency_type": agency_type,
        "award_type_codes": award_type_codes
    }
    response = requests.post(f"{BASE_URL}/awards/summary/", json=body)
    if response.status_code != 200:
        raise Exception(f"Summary API error: {response.status_code} {response.text}")
    return response.json()

def fetch_spending_by_award(year: int, limit: int, page: int, award_type_codes=None):
    if award_type_codes is None:
        award_type_codes = ["A", "B", "C", "D"]
    body = {
        "filters": {
            "agencies": [{
                "type": "awarding",
                "tier": "toptier",
                "name": "Department of Defense"
            }],
            "time_period": [{
                "start_date": f"{year}-01-01",
                "end_date": f"{year}-12-31"
            }],
            "award_type_codes": award_type_codes
        },
        "fields": [
            "Award ID", "Recipient Name", "Award Amount", "Description", "Action Date", "Award Date"
        ],
        "sort": "Action Date",
        "order": "desc",
        "limit": limit,
        "page": page
    }
    response = requests.post(f"{BASE_URL}/search/spending_by_award/", json=body)
    if response.status_code != 200:
        raise Exception(f"Spending API error: {response.status_code} {response.text}")
    return response.json()

def fetch_award_details(award_id: str):
    response = requests.get(f"{BASE_URL}/awards/{award_id}/")
    if response.status_code != 200:
        raise Exception(f"Award details API error: {response.status_code} {response.text}")
    return response.json()

@app.get("/api/summary")
def get_summary():
    return {"message": "summary works"}


@app.get("/api/summary")
def get_summary(
    toptier_code: str = Query("020", min_length=3, max_length=4),
    fiscal_year: int = Query(2023, ge=2000, le=2100),
    agency_type: str = Query("awarding", regex="^(awarding|funding)$"),
    award_type_codes: list[str] = Query(["A", "B", "C", "D"])
):
    try:
        summary = fetch_award_summary(toptier_code, fiscal_year, agency_type, award_type_codes)
        return summary
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/contracts")
def get_contracts(
    fiscal_year: int = Query(2023, ge=2000, le=2100),
    limit: int = Query(50, ge=1, le=500),
    page: int = Query(1, ge=1),
    award_type_codes: list[str] = Query(["A", "B", "C", "D"])
):
    try:
        data = fetch_spending_by_award(fiscal_year, limit, page, award_type_codes)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/contracts/{award_id}")
def get_contract_detail(award_id: str):
    try:
        details = fetch_award_details(award_id)
        return details
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
