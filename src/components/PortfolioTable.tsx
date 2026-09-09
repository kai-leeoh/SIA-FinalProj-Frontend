import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { Currency } from "../hooks/useExchangeRates";
import type { EnrichedHolding } from "../types/portfolio";
import { CURRENCY_SYMBOLS } from "../utils/currency";

interface Props {
  holdings: EnrichedHolding[];
  loading: boolean;
  onEdit: (holding: EnrichedHolding) => void;
  onDelete: (id: number) => void;
  currency: Currency;
  convert: (usdAmount: number, currency: Currency) => number;
}

export const PortfolioTable = ({ holdings, loading, onEdit, onDelete, currency, convert }: Props) => {
  const symbol = CURRENCY_SYMBOLS[currency] ?? currency;
  const fmt = (v: number | null) =>
    v != null ? `${symbol}${convert(v, currency).toFixed(2)}` : "—";

  const columns: ColumnsType<EnrichedHolding> = [
    { title: "Asset", dataIndex: "asset", key: "asset" },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type: string) => <Tag color={type === "crypto" ? "gold" : "blue"}>{type}</Tag>,
    },
    { title: "Quantity", dataIndex: "quantity", key: "quantity", render: (v: number) => <span className="mono">{v}</span> },
    {
      title: "Cost Basis",
      dataIndex: "cost_basis",
      key: "cost_basis",
      render: (v: number) => <span className="mono">{fmt(v)}</span>,
    },
    {
      title: "Current Price",
      dataIndex: "current_price",
      key: "current_price",
      render: (v: number | null) => <span className="mono">{fmt(v)}</span>,
    },
    {
      title: "Current Value",
      dataIndex: "current_value",
      key: "current_value",
      render: (v: number | null) => <span className="mono">{fmt(v)}</span>,
    },
    {
      title: "Gain / Loss",
      dataIndex: "gain_loss",
      key: "gain_loss",
      render: (v: number | null) =>
        v != null ? (
          <span className="mono" style={{ color: v >= 0 ? "#2F6E4F" : "#B3492F" }}>
            {v >= 0 ? "+" : ""}{fmt(v)}
          </span>
        ) : (
          "—"
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => onEdit(record)} />
          <Popconfirm
            title="Delete this holding?"
            description="This can't be undone."
            okText="Delete"
            okButtonProps={{ danger: true }}
            onConfirm={() => onDelete(record.id)}
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={holdings}
        loading={loading}
        scroll={{ x: 700 }}
        pagination={{ pageSize: 10, simple: true }}
      />
    </div>
  );
};
