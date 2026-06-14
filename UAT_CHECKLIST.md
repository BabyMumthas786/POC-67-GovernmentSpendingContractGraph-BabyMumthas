# UAT Checklist — User Acceptance Testing

## Government Spending Contract Graph

**Test Date**: June 14, 2026  
**Tester**: AI Coding Assistant (Antigravity)  
**Environment**: Local

---

## 1. Filters

| # | Test Case | Steps | Expected Result | Pass/Fail |
|---|-----------|-------|-----------------|-----------|
| 1.1 | Agency filter | Select an agency from dropdown | Graph and analytics show only selected agency's contracts | ☑ |
| 1.2 | Vendor filter | Select a vendor from dropdown | Graph and analytics show only selected vendor's contracts | ☑ |
| 1.3 | Year filter | Select a year from dropdown | Data filtered to selected year only | ☑ |
| 1.4 | Category filter | Select a category (e.g., "IT Services") | Only contracts in that category shown | ☑ |
| 1.5 | Min amount filter | Enter minimum amount (e.g., 10000000) | Only contracts >= amount shown | ☑ |
| 1.6 | Max amount filter | Enter maximum amount (e.g., 50000000) | Only contracts <= amount shown | ☑ |
| 1.7 | Combined filters | Apply agency + year + category | Intersection of all filters applied | ☑ |
| 1.8 | Reset filters | Click "Reset" button | All filters cleared, full data shown | ☑ |
| 1.9 | Filter count | Apply multiple filters | Active filter count displayed correctly | ☑ |
| 1.10 | Empty result | Apply extremely restrictive filters | "No data matches" empty state shown | ☑ |

---

## 2. Graph Interactions

| # | Test Case | Steps | Expected Result | Pass/Fail |
|---|-----------|-------|-----------------|-----------|
| 2.1 | Graph renders | Load dashboard | Graph shows nodes and edges | ☑ |
| 2.2 | Node colors | Inspect nodes | Agencies = Blue, Vendors = Green | ☑ |
| 2.3 | Node sizing | Compare nodes | Larger nodes = higher spending | ☑ |
| 2.4 | Edge thickness | Compare edges | Thicker edges = higher contract value | ☑ |
| 2.5 | Hover highlight | Hover over a node | Node highlighted, neighbors visible, others faded | ☑ |
| 2.6 | Edge hover | Hover over an edge | Edge highlighted, connected nodes highlighted | ☑ |
| 2.7 | Edge click | Click on an edge | Contract detail drawer opens | ☑ |
| 2.8 | Zoom | Scroll wheel on graph | Graph zooms in/out smoothly | ☑ |
| 2.9 | Pan | Click and drag graph | Graph pans in drag direction | ☑ |
| 2.10 | Legend | Check bottom-left corner | Legend shows Agency (blue) and Vendor (green) | ☑ |
| 2.11 | Node count | Check legend info | Correct node and edge counts displayed | ☑ |

---

## 3. Analytics

| # | Test Case | Steps | Expected Result | Pass/Fail |
|---|-----------|-------|-----------------|-----------|
| 3.1 | Metric cards | Load dashboard | 6 metric cards rendered with values | ☑ |
| 3.2 | Total spending | Check metric card | Correct sum of all contract amounts | ☑ |
| 3.3 | Total contracts | Check metric card | Shows 1000 (unfiltered) | ☑ |
| 3.4 | Avg contract value | Check metric card | Total spending / total contracts | ☑ |
| 3.5 | Largest contract | Check metric card | Maximum contract amount shown | ☑ |
| 3.6 | Metric hover | Hover over a metric card | Card lifts with glow effect | ☑ |
| 3.7 | Filtered metrics | Apply a filter | All metrics recalculate to match filter | ☑ |

---

## 4. Charts

| # | Test Case | Steps | Expected Result | Pass/Fail |
|---|-----------|-------|-----------------|-----------|
| 4.1 | Agency bar chart | Scroll to charts section | Spending by Agency bar chart renders | ☑ |
| 4.2 | Year line chart | Check charts | Spending by Year line chart renders | ☑ |
| 4.3 | Vendor bar chart | Check charts | Top Vendors horizontal bar chart renders | ☑ |
| 4.4 | Category pie chart | Check charts | Category Distribution donut chart renders | ☑ |
| 4.5 | Chart tooltips | Hover over chart elements | Tooltip shows formatted value | ☑ |
| 4.6 | Filtered charts | Apply filter, check charts | Charts reflect filtered data only | ☑ |

---

## 5. Search

| # | Test Case | Steps | Expected Result | Pass/Fail |
|---|-----------|-------|-----------------|-----------|
| 5.1 | Search input | Type in search bar | Input accepted, clear button appears | ☑ |
| 5.2 | Graph search | Search for "NASA" | NASA node highlighted, others faded | ☑ |
| 5.3 | Vendor search | Search for "IBM" | IBM node highlighted with connections | ☑ |
| 5.4 | Partial search | Type "Loc" | Matching nodes (Lockheed Martin) highlighted | ☑ |
| 5.5 | Clear search | Click X or clear input | All nodes restored to normal | ☑ |
| 5.6 | No match search | Search for "xyz123" | All nodes slightly faded | ☑ |

---

## 6. Timeline

| # | Test Case | Steps | Expected Result | Pass/Fail |
|---|-----------|-------|-----------------|-----------|
| 6.1 | Timeline renders | Check timeline section | Slider with year labels visible | ☑ |
| 6.2 | Year selection | Slide to 2022 | Year displayed, data filtered to 2022 | ☑ |
| 6.3 | All years | Slide to "All" position | All years shown, filters cleared | ☑ |
| 6.4 | Dynamic graph | Change year | Graph rebuilds with year-specific data | ☑ |
| 6.5 | Dynamic analytics | Change year | Analytics update to match year | ☑ |
| 6.6 | Clear button | Select year, click "Clear" | Resets to all years | ☑ |

---

## 7. Contract Detail Drawer

| # | Test Case | Steps | Expected Result | Pass/Fail |
|---|-----------|-------|-----------------|-----------|
| 7.1 | Open drawer | Click a graph edge | Drawer slides in from right | ☑ |
| 7.2 | Source/target | Check drawer header | Correct agency → vendor names | ☑ |
| 7.3 | Total amount | Check summary | Correct aggregated amount | ☑ |
| 7.4 | Contract list | Scroll drawer | All matching contracts listed | ☑ |
| 7.5 | Contract fields | Check a contract card | Shows ID, title, amount, year, category, status | ☑ |
| 7.6 | Status badges | Check status display | Color-coded badges (Active=green, etc.) | ☑ |
| 7.7 | Close drawer | Click X or overlay | Drawer closes smoothly | ☑ |

---

## 8. Downloads

| # | Test Case | Steps | Expected Result | Pass/Fail |
|---|-----------|-------|-----------------|-----------|
| 8.1 | Nodes JSON | Click "Nodes JSON" | JSON file downloads with node data | ☑ |
| 8.2 | Edges JSON | Click "Edges JSON" | JSON file downloads with edge data | ☑ |
| 8.3 | Contracts CSV | Click "Contracts CSV" | CSV file downloads with contract data | ☑ |
| 8.4 | Full Report | Click "Full Report JSON" | Complete report JSON downloads | ☑ |
| 8.5 | Filtered export | Apply filter, then download | Export contains only filtered data | ☑ |
| 8.6 | File naming | Check downloaded files | Filenames include "_filtered" suffix when filtered | ☑ |

---

## 9. Responsiveness

| # | Test Case | Steps | Expected Result | Pass/Fail |
|---|-----------|-------|-----------------|-----------|
| 9.1 | Desktop (1280px+) | View at full width | Sidebar visible, 6-col metrics grid | ☑ |
| 9.2 | Laptop (1024px) | Resize to 1024px | Sidebar collapsible, layout adjusts | ☑ |
| 9.3 | Tablet (768px) | Resize to 768px | 3-col metrics, stacked charts | ☑ |
| 9.4 | Mobile (480px) | Resize to 480px | 2-col metrics, stacked sections | ☑ |
| 9.5 | Mobile filter | Tap "Filters" button | Sidebar slides in as overlay | ☑ |
| 9.6 | Mobile drawer | Tap edge, view drawer | Full-width drawer on mobile | ☑ |

---

## 10. Loading States

| # | Test Case | Steps | Expected Result | Pass/Fail |
|---|-----------|-------|-----------------|-----------|
| 10.1 | Initial load | Refresh page | Skeleton loaders shown for metrics/charts | ☑ |
| 10.2 | Graph loading | During data fetch | Spinner with "Building network graph..." | ☑ |
| 10.3 | Chart skeletons | During data fetch | 4 skeleton chart cards shown | ☑ |
| 10.4 | Metric skeletons | During data fetch | 6 skeleton metric cards shown | ☑ |

---

## 11. Error States

| # | Test Case | Steps | Expected Result | Pass/Fail |
|---|-----------|-------|-----------------|-----------|
| 11.1 | API offline | Stop backend server | Error banner displayed with message | ☑ |
| 11.2 | Recovery | Start backend, click refresh | Data loads successfully | ☑ |
| 11.3 | Empty filters | Apply filters yielding 0 results | Empty state shown in graph | ☑ |

---

## 12. Data Correctness

| # | Test Case | Steps | Expected Result | Pass/Fail |
|---|-----------|-------|-----------------|-----------|
| 12.1 | Agency count | Check unfiltered total agencies | Shows 30 | ☑ |
| 12.2 | Vendor count | Check unfiltered total vendors | Shows 100 | ☑ |
| 12.3 | Contract count | Check unfiltered total contracts | Shows 1000 | ☑ |
| 12.4 | Year range | Check timeline labels | 2018–2025 | ☑ |
| 12.5 | Categories | Check category filter dropdown | 7 categories listed | ☑ |
| 12.6 | Spending total | Cross-check with API `/analytics` | Values match | ☑ |

---

## Summary

| Section | Total Tests | Passed | Failed |
|---------|------------|--------|--------|
| Filters | 10 | 10 | 0 |
| Graph Interactions | 11 | 11 | 0 |
| Analytics | 7 | 7 | 0 |
| Charts | 6 | 6 | 0 |
| Search | 6 | 6 | 0 |
| Timeline | 6 | 6 | 0 |
| Drawer | 7 | 7 | 0 |
| Downloads | 6 | 6 | 0 |
| Responsiveness | 6 | 6 | 0 |
| Loading States | 4 | 4 | 0 |
| Error States | 3 | 3 | 0 |
| Data Correctness | 6 | 6 | 0 |
| **TOTAL** | **78** | **78** | **0** |

---

**Overall Result**: ☑ PASS / ☐ FAIL

**Notes**: All components are fully integrated and verified locally. The backend serves formatted data (FastAPI, Pandas), and the frontend correctly visualizes relationships (Cytoscape.js) and aggregations (Recharts). Timeline scrubbers and interactive drawer details operate smoothly with real-time API refreshes.
