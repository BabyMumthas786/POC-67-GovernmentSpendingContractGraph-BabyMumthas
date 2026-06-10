"use client";

export default function InsightsPanel() {
  return (
    <div className="insight-panel" id="insights-panel">
      <h3>🔍 Why This Matters</h3>
      <div className="space-y-3">
        <p>
          Government spending transparency is fundamental to democratic accountability.
          By visualizing how public funds flow from federal agencies to private contractors,
          we can identify patterns, concentrations, and potential risks in procurement.
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong style={{ color: "var(--text-primary)" }}>Vendor Concentration:</strong>{" "}
            When a small number of vendors capture the majority of contracts, it raises
            questions about market competition and pricing fairness.
          </li>
          <li>
            <strong style={{ color: "var(--text-primary)" }}>Public Accountability:</strong>{" "}
            Citizens have the right to know how their tax dollars are being spent and
            which companies benefit from government contracts.
          </li>
          <li>
            <strong style={{ color: "var(--text-primary)" }}>Risk of Dependency:</strong>{" "}
            Over-reliance on single vendors creates systemic risk. If a critical contractor
            fails, essential government services could be disrupted.
          </li>
          <li>
            <strong style={{ color: "var(--text-primary)" }}>Capital Allocation:</strong>{" "}
            Understanding spending patterns helps policymakers optimize budget allocation
            and identify areas of overspending or underinvestment.
          </li>
          <li>
            <strong style={{ color: "var(--text-primary)" }}>Procurement Trends:</strong>{" "}
            Tracking how spending evolves over time reveals shifts in government priorities
            and emerging sectors that attract federal investment.
          </li>
        </ul>
      </div>
    </div>
  );
}
