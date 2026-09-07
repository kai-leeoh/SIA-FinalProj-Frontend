import { Button, Typography, Statistic, Row, Col } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { EnrichedHolding } from "../types/portfolio";

const { Title } = Typography;

interface Props {
  holdings: EnrichedHolding[];
  onAddClick: () => void;
}

export const PortfolioHeader = ({ holdings, onAddClick }: Props) => {
  const totalValue = holdings.reduce((sum, h) => sum + (h.current_value ?? 0), 0);
  const totalGainLoss = holdings.reduce((sum, h) => sum + (h.gain_loss ?? 0), 0);

  return (
    <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
      <Col>
        <Title level={3} className="serif-title" style={{ margin: 0 }}>
  Portfolio Tracker
</Title>
      </Col>
      <Col>
        <Row gutter={32} align="middle">
          <Col>
            <Statistic
              title="Total Value"
              value={totalValue}
              precision={2}
              prefix="$"
              styles={{ content: { fontFamily: "'JetBrains Mono', monospace" } }}
            />
          </Col>
          <Col>
            <Statistic
              title="Gain / Loss"
              value={totalGainLoss}
              precision={2}
              prefix="$"
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
