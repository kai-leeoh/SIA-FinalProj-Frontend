import { PlusOutlined } from "@ant-design/icons";
import { Button, Col, Row, Select, Statistic, Typography } from "antd";
import type { Currency } from "../hooks/useExchangeRates";
import type { EnrichedHolding } from "../types/portfolio";
import { CURRENCY_SYMBOLS } from "../utils/currency";
const { Title } = Typography;

interface Props {
  holdings: EnrichedHolding[];
  onAddClick: () => void;
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
  currencies: readonly Currency[];
  convert: (usdAmount: number, currency: Currency) => number;
  loading: boolean;
}

export const PortfolioHeader = ({
  holdings, onAddClick, currency, onCurrencyChange, currencies, convert, loading,
}: Props) => {
  const totalValueUSD = holdings.reduce((sum, h) => sum + (h.current_value ?? 0), 0);
  const totalGainLossUSD = holdings.reduce((sum, h) => sum + (h.gain_loss ?? 0), 0);
  const totalValue = convert(totalValueUSD, currency);
  const totalGainLoss = convert(totalGainLossUSD, currency);

  return (
    <Row justify="space-between" align="middle" gutter={[0, 16]} style={{ marginBottom: 24 }}>
      <Col xs={24} sm="auto">
        <Title level={3} className="serif-title" style={{ margin: 0 }}>
          Portfolio Tracker
        </Title>
      </Col>
      <Col xs={24} sm="auto">
        <Row gutter={[16, 12]} align="middle" wrap>
          <Col xs={8} sm="auto">
            <Select
              value={currency}
              onChange={onCurrencyChange}
              loading={loading}
              style={{ width: "100%" }}
              options={currencies.map((c) => ({ value: c, label: c }))}
            />
          </Col>
          <Col xs={16} sm="auto">
            <Statistic
              title="Total Value"
              value={totalValue}
              precision={2}
              prefix={CURRENCY_SYMBOLS[currency] ?? currency}
              styles={{ content: { fontFamily: "'JetBrains Mono', monospace", fontSize: 18 } }}
            />
          </Col>
          <Col xs={16} sm="auto">
            <Statistic
              title="Gain / Loss"
              value={totalGainLoss}
              precision={2}
              prefix={CURRENCY_SYMBOLS[currency] ?? currency}
              styles={{
                content: {
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 18,
                  color: totalGainLoss >= 0 ? "#2F6E4F" : "#B3492F",
                },
              }}
            />
          </Col>
          <Col xs={24} sm="auto">
            <Button type="primary" icon={<PlusOutlined />} onClick={onAddClick} block>
              Add Holding
            </Button>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};
