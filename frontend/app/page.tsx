"use client";

import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import GraphView from "@/components/GraphView";
import MetricCards from "@/components/MetricCards";
import Charts from "@/components/Charts";
import Timeline from "@/components/Timeline";
import ContractDrawer from "@/components/ContractDrawer";
import InsightsPanel from "@/components/InsightsPanel";
import ControlPanel from "@/components/ControlPanel";
import DownloadPanel from "@/components/DownloadPanel";
import Footer from "@/components/Footer";
import type { Agency, Vendor, Contract, GraphData, Analytics, Filters, GraphEdge } from "@/lib/types";
import { fetchAgencies, fetchVendors, fetchContracts, fetchGraph, fetchAnalytics } from "@/lib/api";

export default function Dashboard() {
  // Data state
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [contracts, setContracts] = useState<Contract[]>([]);

  // UI state
  const [filters, setFilters] = useState<Filters>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerContracts, setDrawerContracts] = useState<Contract[]>([]);
  const [drawerSource, setDrawerSource] = useState("");
  const [drawerTarget, setDrawerTarget] = useState("");
  const [drawerAmount, setDrawerAmount] = useState(0);

  // Load reference data on mount and when source changes
  useEffect(() => {
    const loadReferenceData = async () => {
      try {
        const [agencyData, vendorData] = await Promise.all([
          fetchAgencies(filters.source),
          fetchVendors(filters.source),
        ]);
        setAgencies(agencyData);
        setVendors(vendorData);
      } catch (err) {
        console.error("Failed to load reference data:", err);
        setError("Failed to connect to backend. Please ensure the FastAPI server is running on port 8000.");
      }
    };
    loadReferenceData();
  }, [filters.source]);

  // Load filtered data
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [graphResult, analyticsResult, contractsResult] = await Promise.all([
        fetchGraph(filters),
        fetchAnalytics(filters),
        fetchContracts(filters),
      ]);
      setGraphData(graphResult);
      setAnalytics(analyticsResult);
      setContracts(contractsResult);
    } catch (err) {
      console.error("Failed to load data:", err);
      setError("Failed to fetch data. Please check API connection.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handlers
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleRefresh = useCallback(() => {
    loadData();
  }, [loadData]);

  const handleFilterChange = useCallback((newFilters: Filters) => {
    setFilters(newFilters);
  }, []);

  const handleTimelineChange = useCallback((year: number | undefined) => {
    setFilters((prev) => ({ ...prev, year }));
  }, []);

  const handleEdgeClick = useCallback(
    (edge: GraphEdge) => {
      // Find matching contracts for this edge
      const matchingContracts = contracts.filter((c) => {
        const agencyMatch = agencies.find((a) => a.agency_name === edge.source);
        const vendorMatch = vendors.find((v) => v.vendor_name === edge.target);
        return (
          agencyMatch &&
          vendorMatch &&
          c.agency_id === agencyMatch.agency_id &&
          c.vendor_id === vendorMatch.vendor_id
        );
      });

      setDrawerContracts(matchingContracts);
      setDrawerSource(edge.source);
      setDrawerTarget(edge.target);
      setDrawerAmount(edge.amount);
      setDrawerOpen(true);
    },
    [contracts, agencies, vendors]
  );

  const handleDrawerClose = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg-primary)" }}>
      {/* Navbar */}
      <Navbar onSearch={handleSearch} onRefresh={handleRefresh} />

      {/* Main layout */}
      <div className="flex flex-1">
        {/* Main content */}
        <main className="flex-1 px-4 py-5 lg:px-6 lg:py-6 overflow-x-hidden">
          {/* Mobile filter toggle */}
          <button
            className="btn btn-secondary mb-5 lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            id="mobile-filter-toggle"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Filters
          </button>

          {/* Error state */}
          {error && (
            <div className="mb-5 p-4 rounded-lg" style={{
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
            }}>
              <div className="flex items-center gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-red)" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4M12 16h.01" />
                </svg>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--accent-red)" }}>Connection Error</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Metric Cards */}
          <section className="mb-5" id="analytics-section">
            <MetricCards analytics={analytics} loading={loading} />
          </section>

          {/* Timeline Control */}
          <section className="mb-5">
            <Timeline year={filters.year} onChange={handleTimelineChange} />
          </section>

          {/* Graph */}
          <section className="mb-5" id="graph-section">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="section-title">Contract Relationship Graph</h2>
                <p className="section-subtitle">
                  Interactive network of agency-vendor spending relationships
                </p>
              </div>
            </div>
            <GraphView
              data={graphData}
              loading={loading}
              searchQuery={searchQuery}
              onEdgeClick={handleEdgeClick}
            />
          </section>

          {/* Charts */}
          <section className="mb-5">
            <div className="mb-3">
              <h2 className="section-title">Spending Analytics</h2>
              <p className="section-subtitle">
                Breakdown of government contract spending across agencies, vendors, and categories
              </p>
            </div>
            <Charts analytics={analytics} loading={loading} />
          </section>

          {/* Insights + Control + Downloads */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
            <InsightsPanel />
            <ControlPanel />
            <DownloadPanel
              graphData={graphData}
              contracts={contracts}
              filters={filters}
            />
          </section>
        </main>

        {/* Sidebar (right side) */}
        <Sidebar
          agencies={agencies}
          vendors={vendors}
          filters={filters}
          onFilterChange={handleFilterChange}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          searchQuery={searchQuery}
          onSearchChange={handleSearch}
        />
      </div>

      {/* Footer */}
      <Footer />

      {/* Contract Detail Drawer */}
      <ContractDrawer
        contracts={drawerContracts}
        isOpen={drawerOpen}
        onClose={handleDrawerClose}
        sourceName={drawerSource}
        targetName={drawerTarget}
        totalAmount={drawerAmount}
      />
    </div>
  );
}
