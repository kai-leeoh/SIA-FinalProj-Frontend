import { useCallback, useEffect, useState } from "react";
import * as api from "../api/portfolioApi";
import type { EnrichedHolding, HoldingFormValues } from "../types/portfolio";

const POLL_INTERVAL_MS = 30000; // 30 seconds

export const usePortfolio = () => {
  const [holdings, setHoldings] = useState<EnrichedHolding[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHoldings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getEnrichedHoldings();
      setHoldings(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHoldings();
    const interval = setInterval(fetchHoldings, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchHoldings]);

  const addHolding = async (values: HoldingFormValues) => {
    await api.createHolding(values);
    await fetchHoldings();
  };

  const editHolding = async (id: number, values: HoldingFormValues) => {
    await api.updateHolding(id, values);
    await fetchHoldings();
  };

  const removeHolding = async (id: number) => {
    await api.deleteHolding(id);
    await fetchHoldings();
  };

  return { holdings, loading, addHolding, editHolding, removeHolding, refetch: fetchHoldings };
};
