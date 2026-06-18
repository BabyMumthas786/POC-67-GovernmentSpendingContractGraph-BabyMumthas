// ─── Data Models ───

export interface Agency {
  agency_id: string;
  agency_name: string;
  agency_type: string;
  annual_budget: number;
}

export interface Vendor {
  vendor_id: string;
  vendor_name: string;
  industry: string;
  headquarters: string;
}

export interface Contract {
  contract_id: string;
  agency_id: string;
  vendor_id: string;
  contract_title: string;
  amount: number;
  year: number;
  category: string;
  status: string;
}

// ─── Graph Models ───

export interface GraphNode {
  id: string;
  type: "agency" | "vendor";
  agency_id?: string;
  vendor_id?: string;
  annual_budget?: number;
  total_spending?: number;
  total_received?: number;
  industry?: string;
}

export interface GraphEdge {
  source: string;
  target: string;
  amount: number;
  contracts: number;
  contract_ids: string[];
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

// ─── Analytics Models ───

export interface TopItem {
  vendor_id?: string;
  vendor_name?: string;
  agency_id?: string;
  agency_name?: string;
  total: number;
}

export interface YearSpending {
  year: number;
  total: number;
}

export interface CategorySpending {
  category: string;
  total: number;
}

export interface Analytics {
  total_spending: number;
  total_contracts: number;
  total_agencies: number;
  total_vendors: number;
  average_contract_value: number;
  largest_contract: Contract | null;
  top_vendors: TopItem[];
  top_agencies: TopItem[];
  spending_by_year: YearSpending[];
  spending_by_category: CategorySpending[];
}

// ─── Filter State ───

export interface Filters {
  agency_id?: string;
  vendor_id?: string;
  year?: number;
  category?: string;
  status?: string;
  min_amount?: number;
  max_amount?: number;
  source?: string;
}
