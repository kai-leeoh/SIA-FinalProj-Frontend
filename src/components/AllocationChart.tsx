import { Card, Typography } from "antd";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
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
            <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                    <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>
                        {data.map((_, index) => (
                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value) => {
                            const num = typeof value === "number" ? value : Number(value);
                            return [Number.isFinite(num) ? `${symbol}${num.toFixed(2)}` : "—", "Value"];
                        }}
                        contentStyle={{ fontFamily: "JetBrains Mono", fontSize: 12 }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </Card>
    );
};
