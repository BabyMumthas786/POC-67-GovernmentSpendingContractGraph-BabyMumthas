# 🏛️ Government Spending Contract Graph

> **POC-67** · Governance & Trust Rail  
> Interactive intelligence platform visualizing government spending relationships between agencies and vendors.

![Dashboard](screenshots/dashboard-overview.png)

---

## 📋 Project Overview

This is a **production-quality data intelligence dashboard** that visualizes government spending relationships through interactive graph visualization and analytics. The platform transforms raw contract data into actionable insights about procurement transparency, vendor concentration, and spending patterns.

### Key Features

- **Interactive Contract Graph** — Cytoscape.js network visualization of agency-vendor relationships
- **Real-time Analytics** — Dynamic metric cards, charts, and spending breakdowns
- **Advanced Filtering** — Filter by agency, vendor, year, category, and contract amount
- **Timeline Control** — Year slider (2018–2025) with dynamic graph and analytics updates
- **Contract Detail Drawer** — Click edges to view individual contract details
- **Data Export** — Download nodes, edges, contracts as JSON/CSV
- **Responsive Design** — Works on desktop, tablet, and mobile
- **Bloomberg-style Dark UI** — Professional, data-rich interface

---

## 🏗️ Architecture

```
┌─────────────┐     HTTP/JSON      ┌─────────────┐
│   Next.js   │ ◄───────────────►  │   FastAPI    │
│  Frontend   │     REST API       │   Backend    │
│  (React)    │                    │  (Python)    │
└──────┬──────┘                    └──────┬───────┘
       │                                  │
  Cytoscape.js                     JSON Data Files
  Recharts                         (agencies, vendors,
  Tailwind CSS                      contracts)
```

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (App Router), TypeScript, Tailwind CSS |
| Visualization | Cytoscape.js, React CytoscapeJS, Recharts |
| Backend | FastAPI, Python |
| Data | Synthetic dataset (30 agencies, 100 vendors, 1000 contracts) |
| Styling | Bloomberg-inspired dark theme with Inter font |

---

## 📁 Folder Structure

```
POC-67-GovernmentSpendingContractGraph-BabyMumthas/
├── frontend/              # Next.js application
│   ├── app/               # App Router pages & layout
│   ├── components/        # React components
│   ├── lib/               # API client, types, utilities
│   └── public/            # Static assets
├── backend/               # FastAPI server
│   ├── main.py            # API endpoints
│   └── requirements.txt   # Python dependencies
├── data/                  # Synthetic JSON datasets
│   ├── agencies.json      # 30 government agencies
│   ├── vendors.json       # 100 vendors
│   └── contracts.json     # 1000 contracts
├── docs/                  # Documentation
├── screenshots/           # Application screenshots
├── generate_data.py       # Data generation script
└── README.md              # This file
```

---

## 🚀 Setup Instructions

### Prerequisites

- Node.js 18+
- Python 3.10+
- pip or pip3

### 1. Clone the Repository

```bash
git clone <repository-url>
cd POC-67-GovernmentSpendingContractGraph-BabyMumthas
```

### 2. Generate Synthetic Data

```bash
python generate_data.py
```

### 3. Start the Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

The API will be available at `http://127.0.0.1:8000`

### 4. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

The dashboard will be available at `http://localhost:3000`

---

## 🔌 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Health check |
| `/agencies` | GET | List all agencies |
| `/vendors` | GET | List all vendors |
| `/contracts` | GET | List contracts (with filters) |
| `/graph` | GET | Graph data (nodes + edges) |
| `/analytics` | GET | Aggregated analytics |

### Query Parameters (for `/contracts`, `/graph`, `/analytics`)

| Parameter | Type | Description |
|-----------|------|-------------|
| `agency_id` | string | Filter by agency ID |
| `vendor_id` | string | Filter by vendor ID |
| `year` | int | Filter by year (2018–2025) |
| `category` | string | Filter by category |
| `status` | string | Filter by status |
| `min_amount` | int | Minimum contract amount |
| `max_amount` | int | Maximum contract amount |

---

## 📊 Data Model

### Agencies (30 records)
- `agency_id` — Unique identifier (A001–A030)
- `agency_name` — Full agency name
- `agency_type` — Federal / Independent
- `annual_budget` — Annual budget in USD

### Vendors (100 records)
- `vendor_id` — Unique identifier (V001–V100)
- `vendor_name` — Company name
- `industry` — Industry sector
- `headquarters` — HQ location

### Contracts (1000 records)
- `contract_id` — Unique identifier (C001–C1000)
- `agency_id` — Contracting agency
- `vendor_id` — Awarded vendor
- `contract_title` — Contract description
- `amount` — Contract value in USD
- `year` — Contract year (2018–2025)
- `category` — IT Services, Defense, Healthcare, Education, Infrastructure, Energy, Research
- `status` — Active, Completed, Pending, Terminated

---

## 🎨 Frontend Components

| Component | Description |
|-----------|-------------|
| `Navbar` | Global search, refresh, live status indicator |
| `Sidebar` | Filter controls (agency, vendor, year, category, amount) |
| `GraphView` | Cytoscape.js interactive graph visualization |
| `MetricCards` | KPI cards (spending, contracts, agencies, vendors) |
| `Charts` | Recharts analytics (bar, line, pie charts) |
| `Timeline` | Year range slider with dynamic updates |
| `ContractDrawer` | Slide-out drawer with contract details |
| `InsightsPanel` | "Why This Matters" transparency narrative |
| `ControlPanel` | "Who Controls The Rail" governance overview |
| `DownloadPanel` | JSON/CSV data export |
| `Footer` | Project info and attribution |

---

## 🖥️ Screenshots

| View | Description |
|------|-------------|
| Dashboard Overview | Full dashboard with graph, metrics, and charts |
| Graph View | Interactive agency-vendor network |
| Analytics View | Charts and spending breakdowns |
| Filtered Results | Dashboard with active filters |
| Contract Drawer | Edge click contract details |
| Mobile View | Responsive mobile layout |

---

## 🚢 Deployment

### Frontend (Vercel)

```bash
cd frontend
npx vercel --prod
```

Set environment variable:
```
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

### Backend (Render / Railway)

1. Push to GitHub
2. Connect to Render/Railway
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

---

## 📝 License

This project is for educational and demonstration purposes.

---

**Built for transparency and public accountability.**