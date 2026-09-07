import axios from "axios";
import type { EnrichedHolding, Holding, HoldingFormValues } from "../types/portfolio";

const API_BASE = "https://sia-finalproj-backend.onrender.com";

export const getEnrichedHoldings = async (): Promise<EnrichedHolding[]> => {
  const res = await axios.get(`${API_BASE}/holdings/enriched`);
  return res.data;
};

export const createHolding = async (values: HoldingFormValues): Promise<Holding> => {
  const res = await axios.post(`${API_BASE}/holdings`, values);
  return res.data;
};

export const updateHolding = async (id: number, values: HoldingFormValues): Promise<Holding> => {
  const res = await axios.put(`${API_BASE}/holdings/${id}`, values);
  return res.data;
};

export const deleteHolding = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE}/holdings/${id}`);
};

export const getPrice = async (assetType: string, asset: string): Promise<number> => {
  const res = await axios.get(`${API_BASE}/prices/${assetType}/${asset}`);
  return res.data.price;
};

export interface AssetSearchResult {
  value: string;
  label: string;
  type: "crypto" | "etf";
}

export const searchAssets = async (query: string): Promise<AssetSearchResult[]> => {
  if (!query || query.length < 1) return [];
  const res = await axios.get(`${API_BASE}/search`, { params: { query } });
  return res.data;
};

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
