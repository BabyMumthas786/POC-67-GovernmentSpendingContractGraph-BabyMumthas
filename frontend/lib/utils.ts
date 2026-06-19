export function formatCurrency(value: number): string {
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(1)}K`;
  }
  return `$${value.toLocaleString()}`;
}

export function formatNumber(value: number): string {
  return value.toLocaleString();
}

export function formatFullCurrency(value: number): string {
  return `$${value.toLocaleString()}`;
}

export const CHART_COLORS = [
  "#3b82f6", "#06b6d4", "#818CF8", "#10b981",
  "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899",
  "#84cc16", "#f97316", "#6366f1",
];

export const CATEGORY_COLORS: Record<string, string> = {
  "IT Services": "#3b82f6",
  "Defense": "#ef4444",
  "Healthcare": "#10b981",
  "Education": "#f59e0b",
  "Infrastructure": "#818CF8",
  "Energy": "#06b6d4",
  "Research": "#ec4899",
};
