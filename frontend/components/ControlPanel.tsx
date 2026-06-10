"use client";

export default function ControlPanel() {
  const controllers = [
    {
      icon: "🏛️",
      title: "Government Agencies",
      description:
        "Federal departments that originate procurement requests, define requirements, and authorize spending through appropriated budgets.",
    },
    {
      icon: "🏗️",
      title: "Prime Contractors",
      description:
        "Major corporations and organizations that win competitive bids and serve as primary service or product providers to government entities.",
    },
    {
      icon: "📋",
      title: "Procurement Systems",
      description:
        "Formal acquisition frameworks like FAR (Federal Acquisition Regulation) that govern how contracts are solicited, awarded, and managed.",
    },
    {
      icon: "👁️",
      title: "Oversight Organizations",
      description:
        "Bodies such as the GAO (Government Accountability Office) and IGs (Inspectors General) that audit spending and ensure compliance.",
    },
    {
      icon: "⚖️",
      title: "Regulators",
      description:
        "Legislative committees and independent agencies that establish spending limits, enforce transparency mandates, and set procurement policy.",
    },
  ];

  return (
    <div className="insight-panel" id="control-panel">
      <h3>🎛️ Who Controls The Rail</h3>
      <div className="space-y-3">
        {controllers.map((item) => (
          <div
            key={item.title}
            className="flex gap-3 p-2.5 rounded-lg transition-colors"
            style={{ background: "var(--bg-tertiary)" }}
          >
            <span className="text-xl flex-shrink-0 mt-0.5">{item.icon}</span>
            <div>
              <p
                className="text-sm font-semibold mb-0.5"
                style={{ color: "var(--text-primary)" }}
              >
                {item.title}
              </p>
              <p
                className="text-xs leading-relaxed"
                style={{ color: "var(--text-muted)" }}
              >
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
