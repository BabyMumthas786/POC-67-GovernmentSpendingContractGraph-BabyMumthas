"""
Generate synthetic data for the Government Spending Contract Graph.
Produces: data/agencies.json, data/vendors.json, data/contracts.json
"""
import json
import os
import random

random.seed(42)

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
os.makedirs(DATA_DIR, exist_ok=True)

# ─── Categories ───
CATEGORIES = [
    "IT Services", "Defense", "Healthcare",
    "Education", "Infrastructure", "Energy", "Research"
]

STATUSES = ["Active", "Completed", "Pending", "Terminated"]

# ─── 30 Agencies ───
AGENCIES = [
    ("Department of Defense", "Federal", 715000000000),
    ("Department of Health and Human Services", "Federal", 1700000000000),
    ("National Aeronautics and Space Administration", "Federal", 25000000000),
    ("Department of Homeland Security", "Federal", 55000000000),
    ("Department of Veterans Affairs", "Federal", 300000000000),
    ("Department of Energy", "Federal", 48000000000),
    ("Department of Education", "Federal", 68000000000),
    ("Department of Transportation", "Federal", 87000000000),
    ("Department of Justice", "Federal", 38000000000),
    ("Department of Commerce", "Federal", 12000000000),
    ("Department of the Treasury", "Federal", 16000000000),
    ("Department of Agriculture", "Federal", 28000000000),
    ("Department of the Interior", "Federal", 15000000000),
    ("Department of Labor", "Federal", 14000000000),
    ("Department of State", "Federal", 52000000000),
    ("Environmental Protection Agency", "Federal", 12000000000),
    ("General Services Administration", "Federal", 26000000000),
    ("Social Security Administration", "Federal", 13000000000),
    ("National Science Foundation", "Federal", 9000000000),
    ("Small Business Administration", "Federal", 1200000000),
    ("Nuclear Regulatory Commission", "Federal", 900000000),
    ("Federal Communications Commission", "Independent", 590000000),
    ("Securities and Exchange Commission", "Independent", 2100000000),
    ("National Institutes of Health", "Federal", 47000000000),
    ("Centers for Disease Control", "Federal", 12000000000),
    ("Federal Emergency Management Agency", "Federal", 30000000000),
    ("U.S. Agency for International Development", "Federal", 22000000000),
    ("Office of Personnel Management", "Independent", 2000000000),
    ("Corps of Engineers", "Federal", 8000000000),
    ("Consumer Financial Protection Bureau", "Independent", 600000000),
]

# ─── 100 Vendors ───
VENDORS = [
    ("Lockheed Martin", "Defense & Aerospace", "Bethesda, MD"),
    ("Boeing", "Defense & Aerospace", "Arlington, VA"),
    ("Raytheon Technologies", "Defense & Aerospace", "Waltham, MA"),
    ("General Dynamics", "Defense & Aerospace", "Reston, VA"),
    ("Northrop Grumman", "Defense & Aerospace", "Falls Church, VA"),
    ("IBM", "Technology", "Armonk, NY"),
    ("Accenture Federal Services", "IT & Consulting", "Arlington, VA"),
    ("Deloitte", "Consulting", "New York, NY"),
    ("Booz Allen Hamilton", "Consulting & IT", "McLean, VA"),
    ("Leidos", "IT & Defense", "Reston, VA"),
    ("SAIC", "IT & Engineering", "Reston, VA"),
    ("BAE Systems", "Defense & Aerospace", "Falls Church, VA"),
    ("L3Harris Technologies", "Defense & Technology", "Melbourne, FL"),
    ("ManTech International", "IT & Cybersecurity", "Herndon, VA"),
    ("CACI International", "IT & Intelligence", "Arlington, VA"),
    ("Peraton", "IT & Defense", "Herndon, VA"),
    ("Amazon Web Services", "Cloud & IT", "Seattle, WA"),
    ("Microsoft", "Technology", "Redmond, WA"),
    ("Palantir Technologies", "Data Analytics", "Denver, CO"),
    ("CGI Federal", "IT & Consulting", "Fairfax, VA"),
    ("UnitedHealth Group", "Healthcare", "Minnetonka, MN"),
    ("Humana", "Healthcare", "Louisville, KY"),
    ("McKesson Corporation", "Healthcare & Pharma", "Irving, TX"),
    ("KBR Inc", "Engineering & Defense", "Houston, TX"),
    ("Jacobs Engineering", "Engineering", "Dallas, TX"),
    ("Amentum", "Engineering & Defense", "Germantown, MD"),
    ("Maximus Inc", "Government Services", "Tysons, VA"),
    ("ICF International", "Consulting", "Fairfax, VA"),
    ("Parsons Corporation", "Engineering & Defense", "Centreville, VA"),
    ("Oracle", "Technology", "Austin, TX"),
    ("Dell Technologies", "IT & Hardware", "Round Rock, TX"),
    ("HP Inc", "IT & Hardware", "Palo Alto, CA"),
    ("Cisco Systems", "IT & Networking", "San Jose, CA"),
    ("Verizon", "Telecommunications", "New York, NY"),
    ("AT&T", "Telecommunications", "Dallas, TX"),
    ("General Electric", "Energy & Industrial", "Boston, MA"),
    ("Honeywell", "Aerospace & Industrial", "Charlotte, NC"),
    ("Textron Systems", "Defense & Aerospace", "Providence, RI"),
    ("SpaceX", "Aerospace", "Hawthorne, CA"),
    ("Blue Origin", "Aerospace", "Kent, WA"),
    ("Pfizer", "Pharmaceuticals", "New York, NY"),
    ("Moderna", "Pharmaceuticals", "Cambridge, MA"),
    ("Johnson & Johnson", "Healthcare & Pharma", "New Brunswick, NJ"),
    ("Emergent BioSolutions", "Pharmaceuticals", "Gaithersburg, MD"),
    ("Bechtel", "Engineering & Construction", "Reston, VA"),
    ("Fluor Corporation", "Engineering & Construction", "Irving, TX"),
    ("AECOM", "Engineering", "Dallas, TX"),
    ("Huntington Ingalls Industries", "Shipbuilding & Defense", "Newport News, VA"),
    ("General Atomics", "Defense & Energy", "San Diego, CA"),
    ("GDIT", "IT & Defense", "Falls Church, VA"),
    ("Palo Alto Networks", "Cybersecurity", "Santa Clara, CA"),
    ("CrowdStrike", "Cybersecurity", "Austin, TX"),
    ("Fortinet", "Cybersecurity", "Sunnyvale, CA"),
    ("ServiceNow", "Technology", "Santa Clara, CA"),
    ("Salesforce", "Technology", "San Francisco, CA"),
    ("Google Cloud", "Cloud & IT", "Mountain View, CA"),
    ("Red Hat", "Technology", "Raleigh, NC"),
    ("VMware", "Technology", "Palo Alto, CA"),
    ("Splunk", "Data Analytics", "San Francisco, CA"),
    ("Databricks", "Data Analytics", "San Francisco, CA"),
    ("CDW Government", "IT Distribution", "Vernon Hills, IL"),
    ("SHI International", "IT Solutions", "Somerset, NJ"),
    ("World Wide Technology", "IT Solutions", "St. Louis, MO"),
    ("Guidehouse", "Consulting", "McLean, VA"),
    ("Serco Group", "Government Services", "Herndon, VA"),
    ("Conduent", "Government Services", "Florham Park, NJ"),
    ("Mitre Corporation", "Research & Development", "McLean, VA"),
    ("RAND Corporation", "Research", "Santa Monica, CA"),
    ("Battelle Memorial Institute", "Research & Development", "Columbus, OH"),
    ("RTI International", "Research", "Durham, NC"),
    ("Abt Associates", "Research & Consulting", "Rockville, MD"),
    ("Noblis", "Research & IT", "Reston, VA"),
    ("Westat", "Research & Statistics", "Rockville, MD"),
    ("FedEx", "Logistics", "Memphis, TN"),
    ("UPS", "Logistics", "Atlanta, GA"),
    ("Caterpillar", "Heavy Equipment", "Irving, TX"),
    ("3M Company", "Manufacturing", "Maplewood, MN"),
    ("Motorola Solutions", "Communications", "Chicago, IL"),
    ("Tyler Technologies", "Government Software", "Plano, TX"),
    ("Telos Corporation", "IT & Security", "Ashburn, VA"),
    ("Raytheon Intelligence & Space", "Defense & Intelligence", "Arlington, VA"),
    ("Lockheed Martin Aeronautics", "Defense & Aerospace", "Fort Worth, TX"),
    ("Boeing Defense", "Defense & Aerospace", "St. Louis, MO"),
    ("Northrop Grumman Mission Systems", "Defense & IT", "Linthicum, MD"),
    ("Pratt & Whitney", "Aerospace", "East Hartford, CT"),
    ("GE Aviation", "Aerospace", "Evendale, OH"),
    ("United Launch Alliance", "Space", "Centennial, CO"),
    ("Ball Aerospace", "Aerospace & Defense", "Broomfield, CO"),
    ("Sierra Nevada Corporation", "Defense & Aerospace", "Sparks, NV"),
    ("Leonardo DRS", "Defense", "Arlington, VA"),
    ("Cubic Corporation", "Defense & Transportation", "San Diego, CA"),
    ("Kratos Defense", "Defense", "San Diego, CA"),
    ("Carahsoft Technology", "IT Distribution", "Reston, VA"),
    ("Apex Systems", "IT Staffing", "Richmond, VA"),
    ("Tenable", "Cybersecurity", "Columbia, MD"),
    ("Zscaler", "Cloud Security", "San Jose, CA"),
    ("Okta", "Identity & Security", "San Francisco, CA"),
    ("HashiCorp", "Cloud Infrastructure", "San Francisco, CA"),
    ("Elastic", "Data Analytics", "Mountain View, CA"),
    ("Nutanix", "Cloud Infrastructure", "San Jose, CA"),
]

CONTRACT_TITLES = {
    "IT Services": [
        "Enterprise IT Modernization", "Cloud Migration Services",
        "Cybersecurity Operations Center", "Data Center Consolidation",
        "Network Infrastructure Upgrade", "Software Development Services",
        "IT Help Desk Support", "Digital Transformation Initiative",
        "Systems Integration Program", "Application Modernization"
    ],
    "Defense": [
        "Weapons Systems Maintenance", "Military Aircraft Program",
        "Naval Vessel Construction", "Missile Defense System",
        "Intelligence Surveillance Reconnaissance", "Combat Vehicle Upgrade",
        "Electronic Warfare Systems", "Base Operations Support",
        "Logistics Support Services", "Training Systems Development"
    ],
    "Healthcare": [
        "Electronic Health Records", "Telehealth Platform Development",
        "Medical Supply Chain Management", "Clinical Research Support",
        "Vaccine Distribution Program", "Healthcare IT Infrastructure",
        "Patient Care Management System", "Public Health Analytics",
        "Medical Device Procurement", "Health Information Exchange"
    ],
    "Education": [
        "Student Information System", "E-Learning Platform Development",
        "Educational Research Program", "Workforce Training Initiative",
        "Digital Literacy Program", "STEM Education Support",
        "Assessment and Testing Services", "Library Modernization",
        "Teacher Training Program", "Educational Technology Integration"
    ],
    "Infrastructure": [
        "Highway Construction Project", "Bridge Rehabilitation Program",
        "Water Treatment Facility", "Federal Building Renovation",
        "Airport Modernization", "Port Infrastructure Upgrade",
        "Dam Safety Assessment", "Environmental Remediation",
        "Broadband Expansion Initiative", "Smart Grid Implementation"
    ],
    "Energy": [
        "Solar Energy Installation", "Wind Farm Development",
        "Nuclear Facility Management", "Energy Efficiency Program",
        "Grid Modernization Initiative", "Renewable Energy Research",
        "Oil and Gas Facility Operations", "Energy Storage Systems",
        "Power Plant Decommissioning", "Carbon Capture Technology"
    ],
    "Research": [
        "Biomedical Research Program", "Space Exploration Study",
        "Climate Change Research", "Artificial Intelligence R&D",
        "Materials Science Research", "Quantum Computing Research",
        "Genomics Research Initiative", "Ocean Science Program",
        "Agricultural Research Study", "Cybersecurity Research"
    ]
}

YEARS = list(range(2018, 2026))


def generate_agencies():
    agencies = []
    for i, (name, atype, budget) in enumerate(AGENCIES, 1):
        agencies.append({
            "agency_id": f"A{i:03d}",
            "agency_name": name,
            "agency_type": atype,
            "annual_budget": budget
        })
    return agencies


def generate_vendors():
    vendors = []
    for i, (name, industry, hq) in enumerate(VENDORS, 1):
        vendors.append({
            "vendor_id": f"V{i:03d}",
            "vendor_name": name,
            "industry": industry,
            "headquarters": hq
        })
    return vendors


def generate_contracts(agencies, vendors):
    contracts = []
    agency_ids = [a["agency_id"] for a in agencies]
    vendor_ids = [v["vendor_id"] for v in vendors]

    for i in range(1, 1001):
        category = random.choice(CATEGORIES)
        agency_id = random.choice(agency_ids)
        vendor_id = random.choice(vendor_ids)
        year = random.choice(YEARS)
        title = random.choice(CONTRACT_TITLES[category])
        status = random.choices(
            STATUSES, weights=[40, 35, 15, 10], k=1
        )[0]

        if category == "Defense":
            amount = random.randint(5000000, 500000000)
        elif category in ("IT Services", "Healthcare"):
            amount = random.randint(1000000, 150000000)
        elif category == "Infrastructure":
            amount = random.randint(2000000, 200000000)
        elif category == "Energy":
            amount = random.randint(1000000, 100000000)
        elif category == "Research":
            amount = random.randint(500000, 50000000)
        else:  # Education
            amount = random.randint(250000, 30000000)

        contracts.append({
            "contract_id": f"C{i:03d}",
            "agency_id": agency_id,
            "vendor_id": vendor_id,
            "contract_title": title,
            "amount": amount,
            "year": year,
            "category": category,
            "status": status
        })

    return contracts


def main():
    agencies = generate_agencies()
    vendors = generate_vendors()
    contracts = generate_contracts(agencies, vendors)

    with open(os.path.join(DATA_DIR, "agencies.json"), "w") as f:
        json.dump(agencies, f, indent=2)

    with open(os.path.join(DATA_DIR, "vendors.json"), "w") as f:
        json.dump(vendors, f, indent=2)

    with open(os.path.join(DATA_DIR, "contracts.json"), "w") as f:
        json.dump(contracts, f, indent=2)

    total_spending = sum(c["amount"] for c in contracts)
    print(f"Generated {len(agencies)} agencies")
    print(f"Generated {len(vendors)} vendors")
    print(f"Generated {len(contracts)} contracts")
    print(f"Total spending: ${total_spending:,.0f}")
    print(f"Years: {min(c['year'] for c in contracts)}–{max(c['year'] for c in contracts)}")
    print(f"Categories: {sorted(set(c['category'] for c in contracts))}")


if __name__ == "__main__":
    main()
