import { Card, Typography } from "antd";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Currency } from "../hooks/useExchangeRates";
import type { EnrichedHolding } from "../types/portfolio";
import { CURRENCY_SYMBOLS } from "../utils/currency";
const { Title } = Typography;

interface Props {
  holdings: EnrichedHolding[];
  currency: Currency;
  convert: (usdAmount: number, currency: Currency) => number;
}

const COLORS = ["#3D5A6C", "#2F6E4F", "#B3492F", "#C9A24B", "#7A5C8E", "#4E8098"];

export const AllocationChart = ({ holdings, currency, convert }: Props) => {
  const symbol = CURRENCY_SYMBOLS[currency] ?? currency;
  const data = holdings
    .filter((h) => h.current_value != null && h.current_value > 0)
    .map((h) => ({ name: h.asset, value: convert(h.current_value as number, currency) }));

  if (data.length === 0) {
    return (
      <Card style={{ border: "1px solid #DDD8CE", boxShadow: "none", marginBottom: 24 }}>
        <Title level={5} className="serif-title" style={{ marginTop: 0 }}>
          Allocation
        </Title>
        <Typography.Text type="secondary">
          Add a holding to see your allocation breakdown.
        </Typography.Text>
      </Card>
    );
  }

  return (
    <Card style={{ border: "1px solid #DDD8CE", boxShadow: "none", marginBottom: 24 }}>
      <Title level={5} className="serif-title" style={{ marginTop: 0 }}>
        Allocation
      </Title>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 24, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#DDD8CE" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }}
            axisLine={{ stroke: "#DDD8CE" }}
          />
          <YAxis hide />
          <Tooltip
            formatter={(value) => {
              const num = typeof value === "number" ? value : Number(value);
              return [Number.isFinite(num) ? `${symbol}${num.toFixed(2)}` : "—", "Value"];
            }}
            contentStyle={{ fontFamily: "JetBrains Mono", fontSize: 12 }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
            <LabelList
              dataKey="value"
              position="top"
              formatter={(value: number) => `${symbol}${value.toFixed(2)}`}
              style={{ fontFamily: "JetBrains Mono", fontSize: 11, fill: "#1A2B33" }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};