import { PlusOutlined } from "@ant-design/icons";
import { Button, Col, Row, Select, Statistic, Typography } from "antd";
import { useState } from "react";
import { useExchangeRates } from "../hooks/useExchangeRates";
import type { EnrichedHolding } from "../types/portfolio";

const { Title } = Typography;

interface Props {
  holdings: EnrichedHolding[];
  onAddClick: () => void;
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$", PHP: "₱", EUR: "€", JPY: "¥", GBP: "£", SGD: "S$",
};

export const PortfolioHeader = ({ holdings, onAddClick }: Props) => {
  const { convert, currencies, loading } = useExchangeRates();
  const [currency, setCurrency] = useState<string>("USD");

  const totalValueUSD = holdings.reduce((sum, h) => sum + (h.current_value ?? 0), 0);
  const totalGainLossUSD = holdings.reduce((sum, h) => sum + (h.gain_loss ?? 0), 0);

  const totalValue = convert(totalValueUSD, currency as any);
  const totalGainLoss = convert(totalGainLossUSD, currency as any);

  return (
    <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
      <Col>
        <Title level={3} className="serif-title" style={{ margin: 0 }}>
          Portfolio Tracker
        </Title>
      </Col>
      <Col>
        <Row gutter={24} align="middle">
          <Col>
            <Select
              value={currency}
              onChange={setCurrency}
              loading={loading}
              style={{ width: 90 }}
              options={currencies.map((c) => ({ value: c, label: c }))}
            />
          </Col>
          <Col>
            <Statistic
              title="Total Value"
              value={totalValue}
              precision={2}
              prefix={CURRENCY_SYMBOLS[currency] ?? currency}
              styles={{ content: { fontFamily: "'JetBrains Mono', monospace" } }}
            />
          </Col>
          <Col>
            <Statistic
              title="Gain / Loss"
              value={totalGainLoss}
              precision={2}
              prefix={CURRENCY_SYMBOLS[currency] ?? currency}
              styles={{
                content: {
                  fontFamily: "'JetBrains Mono', monospace",
                  color: totalGainLoss >= 0 ? "#2F6E4F" : "#B3492F",
                },
              }}
            />
          </Col>
          <Col>
            <Button type="primary" icon={<PlusOutlined />} onClick={onAddClick}>
              Add Holding
            </Button>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};
