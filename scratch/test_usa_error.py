import urllib.request
import json
import time

def fetch_from_usaspending() -> dict:
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
    
    start = time.time()
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            res_data = response.read().decode("utf-8")
            print(f"Success in {time.time() - start:.2f}s")
            return json.loads(res_data)
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8")
        print(f"HTTP Error {e.code} in {time.time() - start:.2f}s:")
        print(error_body)
        return {}
    except Exception as e:
        print(f"Failed in {time.time() - start:.2f}s: {e}")
        return {}

res = fetch_from_usaspending()
