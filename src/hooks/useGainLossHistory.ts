import { useEffect, useState } from "react";
import type { EnrichedHolding } from "../types/portfolio";

interface HistoryPoint {
  time: string;
  gainLoss: number;
}

const MAX_POINTS = 50;

export const useGainLossHistory = (holdings: EnrichedHolding[]) => {
  const [history, setHistory] = useState<HistoryPoint[]>([]);

  useEffect(() => {
    if (holdings.length === 0) return;

    const totalGainLoss = holdings.reduce((sum, h) => sum + (h.gain_loss ?? 0), 0);
    const point: HistoryPoint = {
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      gainLoss: totalGainLoss,
    };

    setHistory((prev) => [...prev, point].slice(-MAX_POINTS));
  }, [holdings]);

  return history;
};
