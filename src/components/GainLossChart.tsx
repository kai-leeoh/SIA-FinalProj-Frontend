import { Card, Typography } from "antd";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { Currency } from "../hooks/useExchangeRates";
import { useGainLossHistory } from "../hooks/useGainLossHistory";
import type { EnrichedHolding } from "../types/portfolio";
import { CURRENCY_SYMBOLS } from "../utils/currency";

const { Title } = Typography;

interface Props {
  holdings: EnrichedHolding[];
  currency: Currency;
  convert: (usdAmount: number, currency: Currency) => number;
}

export const GainLossChart = ({ holdings, currency, convert }: Props) => {
  const history = useGainLossHistory(holdings);
  const symbol = CURRENCY_SYMBOLS[currency] ?? currency;

  if (history.length < 2) {
    return (
      <Card style={{ border: "1px solid #DDD8CE", boxShadow: "none", marginBottom: 24 }}>
        <Title level={5} className="serif-title" style={{ marginTop: 0 }}>
          Gain / Loss (Live)
        </Title>
        <Typography.Text type="secondary">
          Watching for price updates. The chart will appear after the next refresh.
        </Typography.Text>
      </Card>
    );
  }

  const data = history.map((p) => ({
    time: p.time,
    gainLoss: convert(p.gainLoss, currency),
  }));

  const isPositive = data[data.length - 1].gainLoss >= 0;

  return (
    <Card style={{ border: "1px solid #DDD8CE", boxShadow: "none", marginBottom: 24 }}>
      <Title level={5} className="serif-title" style={{ marginTop: 0 }}>
        Gain / Loss (Live)
      </Title>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#DDD8CE" />
          <XAxis dataKey="time" tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }} />
          <YAxis
            width={80}
            tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }}
            tickFormatter={(v) => `${symbol}${v.toFixed(2)}`}
            domain={["auto", "auto"]}
          />
          <Tooltip
            formatter={(value) => {
              const num = typeof value === "number" ? value : Number(value);
              return [Number.isFinite(num) ? `${symbol}${num.toFixed(2)}` : "—", "Gain/Loss"];
            }}
            contentStyle={{ fontFamily: "JetBrains Mono", fontSize: 12 }}
          />
          <Line
            type="monotone"
            dataKey="gainLoss"
            stroke={isPositive ? "#2F6E4F" : "#B3492F"}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};
