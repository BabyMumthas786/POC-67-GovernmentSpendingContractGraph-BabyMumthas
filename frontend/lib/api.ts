import axios from "axios";
import type {
  Agency,
  Vendor,
  Contract,
  GraphData,
  Analytics,
  Filters,
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

function buildParams(filters: Filters): Record<string, string | number> {
  const params: Record<string, string | number> = {};
  if (filters.agency_id) params.agency_id = filters.agency_id;
  if (filters.vendor_id) params.vendor_id = filters.vendor_id;
  if (filters.year) params.year = filters.year;
  if (filters.category) params.category = filters.category;
  if (filters.status) params.status = filters.status;
  if (filters.min_amount !== undefined) params.min_amount = filters.min_amount;
  if (filters.max_amount !== undefined) params.max_amount = filters.max_amount;
  return params;
}

export async function fetchAgencies(): Promise<Agency[]> {
  const { data } = await api.get<Agency[]>("/agencies");
  return data;
}

export async function fetchVendors(): Promise<Vendor[]> {
  const { data } = await api.get<Vendor[]>("/vendors");
  return data;
}

export async function fetchContracts(filters: Filters = {}): Promise<Contract[]> {
  const { data } = await api.get<Contract[]>("/contracts", {
    params: buildParams(filters),
  });
  return data;
}

export async function fetchGraph(filters: Filters = {}): Promise<GraphData> {
  const { data } = await api.get<GraphData>("/graph", {
    params: buildParams(filters),
  });
  return data;
}

export async function fetchAnalytics(filters: Filters = {}): Promise<Analytics> {
  const { data } = await api.get<Analytics>("/analytics", {
    params: buildParams(filters),
  });
  return data;
}
