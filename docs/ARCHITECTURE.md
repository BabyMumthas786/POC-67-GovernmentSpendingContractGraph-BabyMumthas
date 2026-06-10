# Architecture Document

## Government Spending Contract Graph — System Architecture

---

## 1. High-Level Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                              │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │                    NEXT.JS FRONTEND                          │ │
│  │                                                              │ │
│  │  ┌─────────┐  ┌────────────┐  ┌──────────┐  ┌───────────┐  │ │
│  │  │ Navbar  │  │  Sidebar   │  │ Timeline │  │  Footer   │  │ │
│  │  │ Search  │  │  Filters   │  │  Slider  │  │           │  │ │
│  │  └─────────┘  └────────────┘  └──────────┘  └───────────┘  │ │
│  │                                                              │ │
│  │  ┌───────────────────────────────────────────────────────┐  │ │
│  │  │              GRAPH VIEW (Cytoscape.js)                │  │ │
│  │  │  Agency Nodes (Blue) ← Edges → Vendor Nodes (Green)  │  │ │
│  │  └───────────────────────────────────────────────────────┘  │ │
│  │                                                              │ │
│  │  ┌─────────────┐  ┌───────────────────────────────────┐    │ │
│  │  │ MetricCards  │  │      CHARTS (Recharts)            │    │ │
│  │  │ KPI Summary  │  │  Bar · Line · Pie · H-Bar        │    │ │
│  │  └─────────────┘  └───────────────────────────────────┘    │ │
│  │                                                              │ │
│  │  ┌────────────┐  ┌──────────────┐  ┌─────────────────┐    │ │
│  │  │  Insights  │  │ Control Rail │  │  Download Panel  │    │ │
│  │  └────────────┘  └──────────────┘  └─────────────────┘    │ │
│  │                                                              │ │
│  │  ┌───────────────────────────────────────────────────────┐  │ │
│  │  │          CONTRACT DETAIL DRAWER (Slide-out)           │  │ │
│  │  └───────────────────────────────────────────────────────┘  │ │
│  └──────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
                              │
                         HTTP REST API
                              │
┌──────────────────────────────────────────────────────────────────┐
│                       FASTAPI BACKEND                             │
│                                                                    │
│  ┌─────────────┐  ┌─────────────┐  ┌───────────────────────┐    │
│  │ /agencies   │  │ /contracts  │  │ /graph                │    │
│  │ /vendors    │  │ /analytics  │  │ (nodes + edges)       │    │
│  └─────────────┘  └─────────────┘  └───────────────────────┘    │
│                                                                    │
│  ┌───────────────────────────────────────────────────────────┐   │
│  │                    DATA LAYER                              │   │
│  │   agencies.json   vendors.json   contracts.json            │   │
│  └───────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 2. Data Flow

### Request Lifecycle

1. **User interacts** with filters, timeline, or search in the frontend
2. **React state** updates the `Filters` object
3. **API client** (`lib/api.ts`) sends HTTP requests to FastAPI with filter parameters
4. **FastAPI** filters the in-memory contract data and computes aggregations
5. **Response** is returned as JSON (graph nodes/edges, analytics, or raw contracts)
6. **React components** re-render with updated data
7. **Cytoscape.js** rebuilds the graph layout with new node/edge data
8. **Recharts** re-renders charts with new analytics data

### Data Flow Diagram

```
User Action → Filter State → API Call → FastAPI → Filter/Aggregate → JSON Response
     ↑                                                                      │
     └──────────────── React Re-render ← State Update ←────────────────────┘
```

---

## 3. Frontend Architecture

### Technology Stack
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom CSS Variables
- **State**: React `useState` + `useCallback` hooks (no external state library)
- **Data Fetching**: Axios with custom API client
- **Graph**: Cytoscape.js (imperative API via refs)
- **Charts**: Recharts (declarative React components)

### Component Hierarchy

```
page.tsx (Dashboard — main orchestrator)
├── Navbar          — Search + Refresh + Status
├── Sidebar         — Filter controls
├── MetricCards     — KPI summary cards
├── Timeline        — Year range slider
├── GraphView       — Cytoscape.js graph (imperative)
├── Charts          — Recharts analytics
├── InsightsPanel   — Why This Matters narrative
├── ControlPanel    — Who Controls The Rail
├── DownloadPanel   — JSON/CSV export
├── Footer          — Attribution
└── ContractDrawer  — Slide-out detail panel (on edge click)
```

### State Management

The main `page.tsx` component manages all state:
- **Data state**: agencies, vendors, contracts, graphData, analytics
- **UI state**: filters, searchQuery, sidebarOpen, loading, error
- **Drawer state**: drawerOpen, drawerContracts, drawerSource/Target/Amount

State is passed down to child components as props. Filter changes trigger API re-fetches via `useEffect`.

---

## 4. Backend Architecture

### Technology Stack
- **Framework**: FastAPI
- **Language**: Python 3.10+
- **Data**: JSON files loaded into memory at startup
- **CORS**: Fully open for development

### Endpoints

| Endpoint | Purpose | Filters |
|----------|---------|---------|
| `GET /` | Health check | None |
| `GET /agencies` | List all agencies | None |
| `GET /vendors` | List all vendors | None |
| `GET /contracts` | Filtered contract list | agency_id, vendor_id, year, category, status, min_amount, max_amount |
| `GET /graph` | Graph nodes + edges | Same as contracts |
| `GET /analytics` | Aggregated analytics | Same as contracts |

### Data Processing

- **Loading**: JSON files are read once at startup and stored in memory
- **Filtering**: `_filter_contracts()` applies all query parameters
- **Graph Generation**: Groups contracts by agency-vendor pairs, computes aggregate edge amounts
- **Analytics Computation**: Calculates totals, top-N rankings, and category breakdowns

---

## 5. Graph Generation Process

1. Filter contracts based on query parameters
2. Extract unique agency IDs and vendor IDs from filtered contracts
3. Create **agency nodes** (blue) with total spending data
4. Create **vendor nodes** (green) with total received data
5. Aggregate contracts into **edges** grouped by (agency_id, vendor_id) pair
6. Return `{ nodes: [...], edges: [...] }`

### Visual Rules
- **Node size** = proportional to total spending/received
- **Edge thickness** = proportional to aggregate contract amount
- **Agency color** = Blue (#3b82f6)
- **Vendor color** = Green (#10b981)
- **Layout** = CoSE (Compound Spring Embedder) with gravity and node repulsion

---

## 6. Analytics Generation Process

1. Filter contracts based on query parameters
2. Compute summary metrics:
   - Total spending, contract count, unique agencies/vendors
   - Average contract value, largest contract
3. Compute rankings:
   - Top 10 vendors by spending
   - Top 10 agencies by spending
4. Compute distributions:
   - Spending by year
   - Spending by category
5. Return complete analytics object

---

## 7. Performance Considerations

- **In-memory data**: All JSON data is loaded at startup (fast reads, no DB queries)
- **Client-side graph**: Cytoscape.js handles 100+ nodes smoothly with CoSE layout
- **Debounced search**: 300ms debounce prevents excessive re-renders
- **Memoized callbacks**: `useCallback` prevents unnecessary child re-renders
- **Lazy drawer**: Contract drawer only mounts when opened
