"use client";

import { useState, useEffect } from "react";
import type { Agency, Vendor, Filters } from "@/lib/types";

interface SidebarProps {
  agencies: Agency[];
  vendors: Vendor[];
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
  isOpen: boolean;
  onToggle: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const CATEGORIES = [
  "IT Services", "Defense", "Healthcare",
  "Education", "Infrastructure", "Energy", "Research",
];

const YEARS = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];

export default function Sidebar({
  agencies,
  vendors,
  filters,
  onFilterChange,
  isOpen,
  onToggle,
  searchQuery,
  onSearchChange,
}: SidebarProps) {
  const [localSearch, setLocalSearch] = useState(searchQuery);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== searchQuery) {
        onSearchChange(localSearch);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, onSearchChange, searchQuery]);

  const update = (key: keyof Filters, value: string | number | undefined) => {
    onFilterChange({ ...filters, [key]: value || undefined });
  };

  const resetFilters = () => {
    onFilterChange({});
    onSearchChange("");
  };

  const hasFilters = Object.values(filters).some((v) => v !== undefined) || !!searchQuery;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={`sidebar w-64 p-4 flex flex-col gap-1 overflow-y-auto
          fixed lg:relative top-[56px] lg:top-0 z-40
          transition-transform duration-300
          ${isOpen ? "open translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        id="sidebar-filters"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "var(--text-muted)" }}>
            Filters
          </h2>
          {hasFilters && (
            <button
              id="reset-filters-btn"
              onClick={resetFilters}
              className="btn btn-danger text-xs py-1 px-2"
            >
              Reset
            </button>
          )}
        </div>

        {/* Search (Mobile Only) */}
        <div className="filter-group md:hidden">
          <label className="filter-label">Search</label>
          <div className="relative">
            <input
              id="filter-search-mobile"
              type="text"
              placeholder="Search..."
              className="filter-select pr-8"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
            {localSearch && (
              <button
                type="button"
                onClick={() => setLocalSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded-full"
                style={{ color: "var(--text-muted)" }}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Data Source */}
        <div className="filter-group">
          <label className="filter-label">Data Source</label>
          <select
            id="filter-source"
            className="filter-select"
            value={filters.source || ""}
            onChange={(e) => update("source", e.target.value)}
          >
            <option value="">Synthetic (Local)</option>
            <option value="live">Live (USAspending.gov + SAM.gov)</option>
          </select>
        </div>

        {/* Agency Filter */}
        <div className="filter-group">
          <label className="filter-label">Agency</label>
          <select
            id="filter-agency"
            className="filter-select"
            value={filters.agency_id || ""}
            onChange={(e) => update("agency_id", e.target.value)}
          >
            <option value="">All Agencies</option>
            {agencies.map((a) => (
              <option key={a.agency_id} value={a.agency_id}>
                {a.agency_name}
              </option>
            ))}
          </select>
        </div>

        {/* Vendor Filter */}
        <div className="filter-group">
          <label className="filter-label">Vendor</label>
          <select
            id="filter-vendor"
            className="filter-select"
            value={filters.vendor_id || ""}
            onChange={(e) => update("vendor_id", e.target.value)}
          >
            <option value="">All Vendors</option>
            {vendors.map((v) => (
              <option key={v.vendor_id} value={v.vendor_id}>
                {v.vendor_name}
              </option>
            ))}
          </select>
        </div>

        {/* Year Filter */}
        <div className="filter-group">
          <label className="filter-label">Year</label>
          <select
            id="filter-year"
            className="filter-select"
            value={filters.year || ""}
            onChange={(e) => update("year", e.target.value ? parseInt(e.target.value) : undefined)}
          >
            <option value="">All Years</option>
            {YEARS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div className="filter-group">
          <label className="filter-label">Category</label>
          <select
            id="filter-category"
            className="filter-select"
            value={filters.category || ""}
            onChange={(e) => update("category", e.target.value)}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Amount Range */}
        <div className="filter-group">
          <label className="filter-label">Min Amount ($)</label>
          <input
            id="filter-min-amount"
            type="number"
            placeholder="e.g. 1000000"
            className="filter-select"
            value={filters.min_amount || ""}
            onChange={(e) => update("min_amount", e.target.value ? parseInt(e.target.value) : undefined)}
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">Max Amount ($)</label>
          <input
            id="filter-max-amount"
            type="number"
            placeholder="e.g. 100000000"
            className="filter-select"
            value={filters.max_amount || ""}
            onChange={(e) => update("max_amount", e.target.value ? parseInt(e.target.value) : undefined)}
          />
        </div>

        {/* Active Filters Count */}
        {hasFilters && (
          <div className="mt-2 p-3 rounded-lg" style={{ background: "var(--bg-tertiary)" }}>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              <span className="font-semibold" style={{ color: "var(--accent-blue)" }}>
                {Object.values(filters).filter((v) => v !== undefined).length}
              </span>{" "}
              active filter(s)
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
