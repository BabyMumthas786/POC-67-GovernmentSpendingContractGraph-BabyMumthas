"use client";

import type { Analytics } from "@/lib/types";
import { formatCurrency, formatNumber } from "@/lib/utils";

interface MetricCardsProps {
  analytics: Analytics | null;
  loading: boolean;
}

const METRICS = [
  { key: "total_spending", label: "Total Spending", icon: "💰", format: "currency" },
  { key: "total_contracts", label: "Total Contracts", icon: "📄", format: "number" },
  { key: "total_agencies", label: "Total Agencies", icon: "🏛️", format: "number" },
  { key: "total_vendors", label: "Total Vendors", icon: "🏢", format: "number" },
  { key: "average_contract_value", label: "Avg Contract Value", icon: "📊", format: "currency" },
  { key: "largest_contract", label: "Largest Contract", icon: "🏆", format: "currency" },
] as const;

export default function MetricCards({ analytics, loading }: MetricCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4" id="metric-cards">
        {METRICS.map((m) => (
          <div key={m.key} className="metric-card">
            <div className="skeleton h-8 w-24 mb-2" />
            <div className="skeleton h-3 w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (!analytics) return null;

  const getValue = (key: typeof METRICS[number]["key"]): number => {
    switch (key) {
      case "total_spending":
        return analytics.total_spending;
      case "total_contracts":
        return analytics.total_contracts;
      case "total_agencies":
        return analytics.total_agencies;
      case "total_vendors":
        return analytics.total_vendors;
      case "average_contract_value":
        return analytics.average_contract_value;
      case "largest_contract":
        return analytics.largest_contract?.amount || 0;
      default:
        return 0;
    }
  };


  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4" id="metric-cards">
      {METRICS.map((m) => {
        const value = getValue(m.key);
        const formatted = m.format === "currency"
          ? formatCurrency(value)
          : formatNumber(value);
        return (
          <div key={m.key} className="metric-card">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{m.icon}</span>
            </div>
            <div className="metric-value">{formatted}</div>
            <div className="metric-label">{m.label}</div>
          </div>
        );
      })}
    </div>
  );
}
