import { useEffect, useState } from "react";

const CURRENCIES = ["USD", "PHP", "EUR", "JPY", "GBP", "SGD"] as const;
export type Currency = (typeof CURRENCIES)[number];

export const useExchangeRates = () => {
  const [rates, setRates] = useState<Record<string, number>>({ USD: 1 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch("https://api.frankfurter.app/latest?from=USD");
        const data = await res.json();
        setRates({ USD: 1, ...data.rates });
      } catch {
        setRates({ USD: 1 });
      } finally {
        setLoading(false);
      }
    };
    fetchRates();
  }, []);

  const convert = (usdAmount: number, currency: Currency): number => {
    return usdAmount * (rates[currency] ?? 1);
  };

  return { rates, loading, convert, currencies: CURRENCIES };
};
