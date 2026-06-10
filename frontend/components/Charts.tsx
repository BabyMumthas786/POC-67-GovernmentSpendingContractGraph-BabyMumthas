"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  LineChart, Line, PieChart, Pie, Cell,
  ResponsiveContainer, Legend,
} from "recharts";
import type { Analytics } from "@/lib/types";
import { formatCurrency, CHART_COLORS, CATEGORY_COLORS } from "@/lib/utils";

interface ChartsProps {
  analytics: Analytics | null;
  loading: boolean;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "var(--bg-secondary)",
      border: "1px solid var(--border-secondary)",
      borderRadius: "var(--radius)",
      padding: "0.5rem 0.75rem",
      fontSize: "0.75rem",
    }}>
      <p style={{ color: "var(--text-primary)", fontWeight: 600 }}>{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} style={{ color: entry.color }}>
          {entry.name}: {formatCurrency(entry.value)}
        </p>
      ))}
    </div>
  );
};
/* eslint-enable @typescript-eslint/no-explicit-any */

export default function Charts({ analytics, loading }: ChartsProps) {
  if (loading || !analytics) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" id="charts-section">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card p-4">
            <div className="skeleton h-5 w-40 mb-4" />
            <div className="skeleton h-48 w-full" />
          </div>
        ))}
      </div>
    );
  }

  const agencyData = analytics.top_agencies.slice(0, 8).map((a) => ({
    name: (a.agency_name || "").length > 15
      ? (a.agency_name || "").slice(0, 13) + "…"
      : a.agency_name,
    total: a.total,
  }));

  const yearData = analytics.spending_by_year;

  const vendorData = analytics.top_vendors.slice(0, 8).map((v) => ({
    name: (v.vendor_name || "").length > 15
      ? (v.vendor_name || "").slice(0, 13) + "…"
      : v.vendor_name,
    total: v.total,
  }));

  const categoryData = analytics.spending_by_category.map((c) => ({
    name: c.category,
    value: c.total,
    color: CATEGORY_COLORS[c.category] || "#6366f1",
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" id="charts-section">
      {/* Spending by Agency — Bar Chart */}
      <div className="card p-4">
        <h3 className="section-title mb-4">Spending by Agency</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={agencyData} layout="vertical" margin={{ left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis type="number" tickFormatter={(v) => formatCurrency(v)}
                   tick={{ fill: "#64748b", fontSize: 10 }} />
            <YAxis type="category" dataKey="name" width={110}
                   tick={{ fill: "#94a3b8", fontSize: 10 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="total" name="Spending" radius={[0, 4, 4, 0]}>
              {agencyData.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Spending by Year — Line Chart */}
      <div className="card p-4">
        <h3 className="section-title mb-4">Spending by Year</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={yearData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="year" tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <YAxis tickFormatter={(v) => formatCurrency(v)}
                   tick={{ fill: "#64748b", fontSize: 10 }} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="total" name="Spending"
                  stroke="#3b82f6" strokeWidth={3} dot={{ r: 5, fill: "#3b82f6" }}
                  activeDot={{ r: 7, fill: "#60a5fa" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top Vendors — Horizontal Bar */}
      <div className="card p-4">
        <h3 className="section-title mb-4">Top Vendors</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={vendorData} layout="vertical" margin={{ left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis type="number" tickFormatter={(v) => formatCurrency(v)}
                   tick={{ fill: "#64748b", fontSize: 10 }} />
            <YAxis type="category" dataKey="name" width={110}
                   tick={{ fill: "#94a3b8", fontSize: 10 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="total" name="Received" radius={[0, 4, 4, 0]}>
              {vendorData.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category Distribution — Pie */}
      <div className="card p-4">
        <h3 className="section-title mb-4">Category Distribution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={categoryData} cx="50%" cy="50%"
                 innerRadius={55} outerRadius={90}
                 paddingAngle={3} dataKey="value" nameKey="name">
              {categoryData.map((entry, i) => (
                <Cell key={i} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: "11px" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
