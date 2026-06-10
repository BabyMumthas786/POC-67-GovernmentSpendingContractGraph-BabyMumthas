"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import cytoscape from "cytoscape";
import type { GraphData, GraphEdge } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface GraphViewProps {
  data: GraphData | null;
  loading: boolean;
  searchQuery: string;
  onEdgeClick: (edge: GraphEdge) => void;
}

export default function GraphView({ data, loading, searchQuery, onEdgeClick }: GraphViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  const layoutRef = useRef<cytoscape.Layouts | null>(null);
  const [graphReady, setGraphReady] = useState(false);

  // Safely destroy the current Cytoscape instance
  const destroyCy = useCallback(() => {
    if (layoutRef.current) {
      try {
        layoutRef.current.stop();
      } catch {
        // layout may already be stopped
      }
      layoutRef.current = null;
    }
    if (cyRef.current) {
      try {
        cyRef.current.destroy();
      } catch {
        // instance may already be destroyed
      }
      cyRef.current = null;
    }
    setGraphReady(false);
  }, []);

  const buildGraph = useCallback(() => {
    if (!containerRef.current || !data || data.nodes.length === 0) {
      destroyCy();
      return;
    }

    // Destroy previous instance before building a new one
    destroyCy();

    const maxNodeSpending = Math.max(
      ...data.nodes.map((n) => n.total_spending || n.total_received || 1)
    );
    const maxEdgeAmount = Math.max(...data.edges.map((e) => e.amount || 1));

    const elements: cytoscape.ElementDefinition[] = [];

    // Nodes
    data.nodes.forEach((node) => {
      const spending = node.total_spending || node.total_received || 0;
      const size = 24 + (spending / maxNodeSpending) * 56;
      elements.push({
        data: {
          id: node.id,
          label: node.id.length > 22 ? node.id.slice(0, 20) + "…" : node.id,
          type: node.type,
          spending,
          size,
          fullLabel: node.id,
        },
      });
    });

    // Edges
    data.edges.forEach((edge, idx) => {
      const width = 1 + (edge.amount / maxEdgeAmount) * 8;
      elements.push({
        data: {
          id: `edge-${idx}`,
          source: edge.source,
          target: edge.target,
          amount: edge.amount,
          contracts: edge.contracts,
          label: formatCurrency(edge.amount),
          width,
          edgeData: JSON.stringify(edge),
        },
      });
    });

    const cy = cytoscape({
      container: containerRef.current,
      elements,
      style: [
        {
          selector: "node[type='agency']",
          style: {
            "background-color": "#3b82f6",
            "border-color": "#60a5fa",
            "border-width": 2,
            label: "data(label)",
            "font-size": "9px",
            "font-weight": "bold" as unknown as number,
            color: "#e2e8f0",
            "text-outline-color": "#0a0e17",
            "text-outline-width": 2,
            "text-valign": "bottom",
            "text-margin-y": 6,
            width: "data(size)",
            height: "data(size)",
            "overlay-opacity": 0,
            shape: "ellipse",
          },
        },
        {
          selector: "node[type='vendor']",
          style: {
            "background-color": "#10b981",
            "border-color": "#34d399",
            "border-width": 2,
            label: "data(label)",
            "font-size": "8px",
            color: "#e2e8f0",
            "text-outline-color": "#0a0e17",
            "text-outline-width": 2,
            "text-valign": "bottom",
            "text-margin-y": 6,
            width: "data(size)",
            height: "data(size)",
            "overlay-opacity": 0,
            shape: "ellipse",
          },
        },
        {
          selector: "edge",
          style: {
            "line-color": "#334155",
            "target-arrow-color": "#334155",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
            width: "data(width)",
            opacity: 0.5,
            "overlay-opacity": 0,
          },
        },
        {
          selector: "node:selected",
          style: {
            "border-color": "#f59e0b",
            "border-width": 4,
          },
        },
        {
          selector: "edge:selected",
          style: {
            "line-color": "#f59e0b",
            "target-arrow-color": "#f59e0b",
            opacity: 1,
          },
        },
        {
          selector: ".highlighted",
          style: {
            "border-color": "#f59e0b",
            "border-width": 4,
            "background-color": "#fbbf24",
            "z-index": 999,
          },
        },
        {
          selector: ".faded",
          style: {
            opacity: 0.1,
          },
        },
        {
          selector: ".edge-highlighted",
          style: {
            "line-color": "#f59e0b",
            "target-arrow-color": "#f59e0b",
            opacity: 1,
            "z-index": 999,
          },
        },
      ],
      // Don't run layout automatically — we'll run it manually so we can track the reference
      layout: { name: "preset" },
      minZoom: 0.2,
      maxZoom: 3.5,
      wheelSensitivity: 0.25,
    });

    // Hover effects
    cy.on("mouseover", "node", (evt) => {
      const node = evt.target;
      const connected = node.connectedEdges().connectedNodes();
      cy.elements().addClass("faded");
      node.removeClass("faded").addClass("highlighted");
      connected.removeClass("faded");
      node.connectedEdges().removeClass("faded").addClass("edge-highlighted");
    });

    cy.on("mouseout", "node", () => {
      cy.elements()
        .removeClass("faded")
        .removeClass("highlighted")
        .removeClass("edge-highlighted");
    });

    // Edge hover
    cy.on("mouseover", "edge", (evt) => {
      const edge = evt.target;
      cy.elements().addClass("faded");
      edge.removeClass("faded").addClass("edge-highlighted");
      edge.source().removeClass("faded").addClass("highlighted");
      edge.target().removeClass("faded").addClass("highlighted");
    });

    cy.on("mouseout", "edge", () => {
      cy.elements()
        .removeClass("faded")
        .removeClass("highlighted")
        .removeClass("edge-highlighted");
    });

    // Edge click → open drawer
    cy.on("tap", "edge", (evt) => {
      const edgeDataStr = evt.target.data("edgeData");
      if (edgeDataStr) {
        const edgeData = JSON.parse(edgeDataStr) as GraphEdge;
        onEdgeClick(edgeData);
      }
    });

    cyRef.current = cy;

    // Run the layout manually so we can track and stop it on cleanup
    const layout = cy.layout({
      name: "cose",
      animate: true,
      animationDuration: 1000,
      nodeRepulsion: () => 10000,
      idealEdgeLength: () => 140,
      gravity: 0.25,
      numIter: 600,
      padding: 50,
    } as cytoscape.LayoutOptions);

    layoutRef.current = layout;
    layout.run();

    // Mark graph as ready once layout completes
    layout.on("layoutstop", () => {
      setGraphReady(true);
      layoutRef.current = null;
    });
  }, [data, onEdgeClick, destroyCy]);

  useEffect(() => {
    if (!loading) {
      buildGraph();
    }
    return () => {
      destroyCy();
    };
  }, [buildGraph, loading, destroyCy]);

  // Search highlighting
  useEffect(() => {
    if (!cyRef.current) return;
    if (!searchQuery) {
      cyRef.current
        .elements()
        .removeClass("faded")
        .removeClass("highlighted")
        .removeClass("edge-highlighted");
      return;
    }
    const q = searchQuery.toLowerCase();
    const cy = cyRef.current;
    cy.elements().addClass("faded");
    cy.nodes().forEach((node) => {
      if (node.data("id").toLowerCase().includes(q)) {
        node.removeClass("faded").addClass("highlighted");
        node.connectedEdges().removeClass("faded").addClass("edge-highlighted");
        node.connectedEdges().connectedNodes().removeClass("faded");
      }
    });
  }, [searchQuery]);

  const showLoading = loading;
  const showEmpty = !loading && (!data || data.nodes.length === 0);
  const showGraph = !loading && data && data.nodes.length > 0;

  return (
    <div className="graph-container w-full relative" style={{ height: "600px" }} id="graph-view">
      {/* Always-mounted Cytoscape container — hidden when not in use */}
      <div
        ref={containerRef}
        className="w-full h-full"
        style={{ display: showGraph ? "block" : "none" }}
      />

      {/* Loading overlay */}
      {showLoading && (
        <div className="flex items-center justify-center h-full absolute inset-0">
          <div className="text-center">
            <div
              className="w-12 h-12 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-4"
              style={{
                borderColor: "var(--accent-blue)",
                borderTopColor: "transparent",
              }}
            />
            <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              Building network graph...
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              Mapping agency-vendor relationships
            </p>
          </div>
        </div>
      )}

      {/* Empty state overlay */}
      {showEmpty && (
        <div className="flex items-center justify-center h-full absolute inset-0">
          <div className="text-center">
            <svg
              className="w-16 h-16 mx-auto mb-4"
              style={{ color: "var(--text-muted)" }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1"
            >
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              No data matches your filters
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              Try adjusting your filter criteria or reset all filters
            </p>
          </div>
        </div>
      )}

      {/* Legend — shown when graph is visible */}
      {showGraph && (
        <div className="graph-legend">
          <div className="legend-item">
            <div className="legend-dot" style={{ background: "#3b82f6" }} />
            <span>Agency</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{ background: "#10b981" }} />
            <span>Vendor</span>
          </div>
          <div
            className="mt-2 pt-2"
            style={{ borderTop: "1px solid var(--border-primary)" }}
          >
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {data.nodes.length} nodes · {data.edges.length} edges
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
              Click edges for details
            </p>
          </div>
        </div>
      )}

      {/* Graph controls hint */}
      {showGraph && (
        <div
          className="absolute top-3 right-3 px-3 py-1.5 rounded-lg"
          style={{
            background: "rgba(10, 14, 23, 0.8)",
            backdropFilter: "blur(8px)",
            border: "1px solid var(--border-primary)",
          }}
        >
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            🖱️ Scroll to zoom · Drag to pan · Hover to highlight
          </p>
        </div>
      )}
    </div>
  );
}
