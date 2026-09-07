import { Card, Typography } from "antd";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useGainLossHistory } from "../hooks/useGainLossHistory";
import type { EnrichedHolding } from "../types/portfolio";

const { Title } = Typography;

interface Props {
  holdings: EnrichedHolding[];
}

export const GainLossChart = ({ holdings }: Props) => {
  const history = useGainLossHistory(holdings);

  if (history.length < 2) {
    return (
      <Card style={{ border: "1px solid #DDD8CE", boxShadow: "none", marginBottom: 24 }}>
        <Title level={5} className="serif-title" style={{ marginTop: 0 }}>
          Gain / Loss (Live)
        </Title>
        <Typography.Text type="secondary">
          Watching for price updates — chart will appear after the next refresh.
        </Typography.Text>
      </Card>
    );
  }

  const isPositive = history[history.length - 1].gainLoss >= 0;

  return (
    <Card style={{ border: "1px solid #DDD8CE", boxShadow: "none", marginBottom: 24 }}>
      <Title level={5} className="serif-title" style={{ marginTop: 0 }}>
        Gain / Loss (Live)
      </Title>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={history}>
          <CartesianGrid strokeDasharray="3 3" stroke="#DDD8CE" />
          <XAxis dataKey="time" tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }} />
          <YAxis
            tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }}
            tickFormatter={(v) => `$${v.toFixed(0)}`}
          />
          <Tooltip
            formatter={(value) => {
                const num = typeof value === "number" ? value : Number(value);
                 return [Number.isFinite(num) ? `$${num.toFixed(2)}` : "—", "Gain/Loss"];
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
