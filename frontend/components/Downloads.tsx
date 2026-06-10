"use client";

import type { GraphData, Contract } from "@/lib/types";

interface DownloadsProps {
  graphData: GraphData | null;
  filteredContracts: Contract[] | null;
}

export default function Downloads({ graphData, filteredContracts }: DownloadsProps) {
  // Helpers to trigger browser file download
  const downloadJSON = (data: any, filename: string) => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadCSV = (headers: string[], rows: any[][], filename: string) => {
    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((value) => {
            const strVal = value !== undefined && value !== null ? String(value) : "";
            // Escape double quotes and wrap in quotes if contains commas or newlines
            if (strVal.includes(",") || strVal.includes('"') || strVal.includes("\n")) {
              return `"${strVal.replace(/"/g, '""')}"`;
            }
            return strVal;
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportNodes = () => {
    if (!graphData) return;
    downloadJSON(graphData.nodes, "government-spending-nodes.json");
  };

  const handleExportEdges = () => {
    if (!graphData) return;
    downloadJSON(graphData.edges, "government-spending-edges.json");
  };

  const handleExportFilteredCSV = () => {
    if (!filteredContracts || filteredContracts.length === 0) return;
    const headers = [
      "contract_id",
      "agency_id",
      "vendor_id",
      "contract_title",
      "amount",
      "year",
      "category",
      "status",
    ];
    const rows = filteredContracts.map((c) => [
      c.contract_id,
      c.agency_id,
      c.vendor_id,
      c.contract_title,
      c.amount,
      c.year,
      c.category,
      c.status,
    ]);
    downloadCSV(headers, rows, "filtered-contracts.csv");
  };

  return (
    <div className="card p-4 flex flex-col gap-3" id="downloads-panel">
      <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
        💾 Data Export
      </h3>
      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
        Download structural network data or filtered tabular reports for external analysis.
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <button
          id="export-nodes-btn"
          onClick={handleExportNodes}
          disabled={!graphData || graphData.nodes.length === 0}
          className="btn btn-secondary text-xs flex items-center justify-center gap-2"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="9" rx="1" />
            <rect x="14" y="3" width="7" height="5" rx="1" />
            <rect x="14" y="12" width="7" height="9" rx="1" />
            <rect x="3" y="16" width="7" height="5" rx="1" />
          </svg>
          Export Nodes (JSON)
        </button>

        <button
          id="export-edges-btn"
          onClick={handleExportEdges}
          disabled={!graphData || graphData.edges.length === 0}
          className="btn btn-secondary text-xs flex items-center justify-center gap-2"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v16" />
          </svg>
          Export Edges (JSON)
        </button>

        <button
          id="export-filtered-csv-btn"
          onClick={handleExportFilteredCSV}
          disabled={!filteredContracts || filteredContracts.length === 0}
          className="btn btn-secondary text-xs flex items-center justify-center gap-2"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
          </svg>
          Export Contracts (CSV)
        </button>
      </div>
    </div>
  );
}
