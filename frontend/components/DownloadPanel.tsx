"use client";

import type { GraphData, Contract, Filters } from "@/lib/types";

interface DownloadPanelProps {
  graphData: GraphData | null;
  contracts: Contract[];
  filters: Filters;
}

function downloadJSON(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadCSV(data: any[], filename: string) {
  if (data.length === 0) return;
  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((h) => {
          const val = String(row[h] ?? "");
          return val.includes(",") || val.includes('"')
            ? `"${val.replace(/"/g, '""')}"`
            : val;
        })
        .join(",")
    ),
  ];
  const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function DownloadPanel({
  graphData,
  contracts,
  filters,
}: DownloadPanelProps) {
  const hasFilters = Object.values(filters).some((v) => v !== undefined);
  const suffix = hasFilters ? "_filtered" : "";

  const downloads = [
    {
      label: "Nodes JSON",
      description: "Graph node data (agencies + vendors)",
      icon: "🔵",
      onClick: () => {
        if (graphData) downloadJSON(graphData.nodes, `nodes${suffix}.json`);
      },
      disabled: !graphData || graphData.nodes.length === 0,
    },
    {
      label: "Edges JSON",
      description: "Graph edge data (contract relationships)",
      icon: "🔗",
      onClick: () => {
        if (graphData) downloadJSON(graphData.edges, `edges${suffix}.json`);
      },
      disabled: !graphData || graphData.edges.length === 0,
    },
    {
      label: "Contracts CSV",
      description: "All matching contracts in spreadsheet format",
      icon: "📊",
      onClick: () => {
        if (contracts.length > 0) downloadCSV(contracts, `contracts${suffix}.csv`);
      },
      disabled: contracts.length === 0,
    },
    {
      label: "Full Report JSON",
      description: "Complete graph + contract dataset",
      icon: "📦",
      onClick: () => {
        const report = {
          exported_at: new Date().toISOString(),
          filters,
          graph: graphData,
          contracts,
        };
        downloadJSON(report, `spending_report${suffix}.json`);
      },
      disabled: !graphData && contracts.length === 0,
    },
  ];

  return (
    <div className="insight-panel" id="download-panel">
      <h3>📥 Export Data</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {downloads.map((dl) => (
          <button
            key={dl.label}
            onClick={dl.onClick}
            disabled={dl.disabled}
            className="w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all"
            style={{
              background: dl.disabled ? "var(--bg-tertiary)" : "var(--bg-tertiary)",
              opacity: dl.disabled ? 0.4 : 1,
              cursor: dl.disabled ? "not-allowed" : "pointer",
              border: "1px solid transparent",
            }}
            onMouseEnter={(e) => {
              if (!dl.disabled) {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-secondary)";
                (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-hover)";
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "transparent";
              (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-tertiary)";
            }}
          >
            <span className="text-lg flex-shrink-0">{dl.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                {dl.label}
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {dl.description}
              </p>
            </div>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ color: "var(--text-muted)", flexShrink: 0 }}
            >
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
          </button>
        ))}
      </div>
      {hasFilters && (
        <p className="text-xs mt-3" style={{ color: "var(--text-muted)" }}>
          ⚡ Exports reflect currently active filters
        </p>
      )}
    </div>
  );
}
