"use client";

import { useState, useEffect, useRef } from "react";

interface NavbarProps {
  onSearch: (query: string) => void;
  onRefresh: () => void;
}

export default function Navbar({ onSearch, onRefresh }: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced live search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearch(searchQuery);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery, onSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <nav className="navbar px-4 lg:px-6 flex items-center justify-between" id="navbar">
      {/* Logo & Title */}
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center relative"
          style={{ background: "var(--gradient-blue)" }}
        >
          {/* Animated glow ring */}
          <div
            className="absolute inset-0 rounded-lg"
            style={{
              background: "var(--gradient-blue)",
              opacity: 0.4,
              filter: "blur(6px)",
              animation: "pulse 3s infinite",
            }}
          />
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            className="relative z-10"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
        </div>
        <div>
          <h1
            className="text-sm font-bold tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            Gov Spending Graph
          </h1>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Intelligence Dashboard
          </p>
        </div>
      </div>

      {/* Search */}
      <form
        onSubmit={handleSearch}
        className="hidden md:flex items-center gap-2 flex-1 max-w-lg mx-8"
      >
        <div className="relative w-full">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors"
            style={{
              color: isSearchFocused ? "var(--accent-blue)" : "var(--text-muted)",
            }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            id="global-search"
            type="text"
            placeholder="Search agencies, vendors, contracts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className="filter-select pl-10 pr-4 py-2 w-full"
            style={{
              borderColor: isSearchFocused
                ? "var(--accent-blue)"
                : "var(--border-primary)",
              boxShadow: isSearchFocused
                ? "0 0 0 2px rgba(59, 130, 246, 0.15)"
                : "none",
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full"
              style={{ color: "var(--text-muted)" }}
            >
              <svg
                width="14"
                height="14"
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
      </form>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Status indicator */}
        <div
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full"
          style={{ background: "var(--bg-tertiary)" }}
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{
              background: "var(--accent-green)",
              boxShadow: "0 0 6px rgba(16, 185, 129, 0.5)",
              animation: "pulse 2s infinite",
            }}
          />
          <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            Live
          </span>
        </div>

        <button
          id="refresh-btn"
          onClick={onRefresh}
          className="btn btn-secondary"
          title="Refresh Data"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M1 4v6h6M23 20v-6h-6" />
            <path d="M20.49 9A9 9 0 005.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 013.51 15" />
          </svg>
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>
    </nav>
  );
}
