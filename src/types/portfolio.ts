export interface Holding {
  id: number;
  asset: string;
  type: "crypto" | "etf";
  quantity: number;
  cost_basis: number;
}

export interface EnrichedHolding extends Holding {
  current_price: number | null;
  current_value: number | null;
  gain_loss: number | null;
}

export type HoldingFormValues = Omit<Holding, "id">;