"use client";

export default function Footer() {
  return (
    <footer
      className="px-4 lg:px-6 py-5 mt-auto"
      style={{
        background: "var(--bg-secondary)",
        borderTop: "1px solid var(--border-primary)",
      }}
      id="footer"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "var(--gradient-ambient)" }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            </div>
            <div>
              <p
                className="text-sm font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Government Spending Contract Graph
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Intelligence Dashboard · Governance & Trust Rail
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                Data Source
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Synthetic / USAspending.gov
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                Updated
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                2018 – 2025
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                Built With
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Next.js · FastAPI · Cytoscape.js
              </p>
            </div>
          </div>
        </div>

        <div
          className="mt-4 pt-4 text-center"
          style={{ borderTop: "1px solid var(--border-primary)" }}
        >
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            © {new Date().getFullYear()} POC-67 · Government Spending Intelligence Platform ·
            Built for transparency and public accountability
          </p>
        </div>
      </div>
    </footer>
  );
}
