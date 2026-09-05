import axios from "axios";
import type { Holding, EnrichedHolding, HoldingFormValues } from "../types/portfolio";

const API_BASE = "http://localhost:4000";

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

export const getPrice = async (asset: string): Promise<number> => {
  const res = await axios.get(`${API_BASE}/prices/${asset}`);
  return res.data.price;
};