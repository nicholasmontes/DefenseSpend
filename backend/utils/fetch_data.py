import requests


def fetch_dod_contracts(limit=50, year=2023):
    body = {
        "filters": {
            "agencies": [
                {
                    "type": "awarding",
                    "tier": "toptier",
                    "name": "Department of Defense"
                }
            ],
            "time_period": [
                {
                    "start_date": f"{year}-01-01",
                    "end_date": f"{year}-12-31"
                }
            ],
            "award_type_codes": ["A", "B", "C", "D"]
        },
        "fields": [
            "Award ID", "Recipient Name", "Award Amount", "Description", "Action Date"
        ],
        "sort": "Award Amount",
        "order": "desc",
        "limit": limit,
        "page": 1
    }

    response = requests.post("https://api.usaspending.gov/api/v2/search/spending_by_award/", json=body)
    if response.status_code == 200:
        data = response.json()
        print("DEBUG: Full API response:", data)  # Add this to check actual data structure
        return data.get("results", [])
    else:
        print("DEBUG:", response.status_code, response.text)
        return [{
            "error": "Failed to fetch DoD data",
            "status_code": response.status_code
    }]

