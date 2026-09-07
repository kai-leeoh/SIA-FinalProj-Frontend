import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { EnrichedHolding } from "../types/portfolio";

interface Props {
  holdings: EnrichedHolding[];
  loading: boolean;
  onEdit: (holding: EnrichedHolding) => void;
  onDelete: (id: number) => void;
}

export const PortfolioTable = ({ holdings, loading, onEdit, onDelete }: Props) => {
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
      render: (v: number) => <span className="mono">${v.toFixed(2)}</span>,
    },
    {
      title: "Current Price",
      dataIndex: "current_price",
      key: "current_price",
      render: (v: number | null) => (
        <span className="mono">{v != null ? `$${v.toFixed(2)}` : "—"}</span>
      ),
    },
    {
      title: "Current Value",
      dataIndex: "current_value",
      key: "current_value",
      render: (v: number | null) => (
        <span className="mono">{v != null ? `$${v.toFixed(2)}` : "—"}</span>
      ),
    },
    {
      title: "Gain / Loss",
      dataIndex: "gain_loss",
      key: "gain_loss",
      render: (v: number | null) =>
        v != null ? (
          <span className="mono" style={{ color: v >= 0 ? "#2F6E4F" : "#B3492F" }}>
            {v >= 0 ? "+" : ""}${v.toFixed(2)}
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
          <Button icon={<DeleteOutlined />} danger onClick={() => onDelete(record.id)} />
        </Space>
      ),
    },
  ];

  return <Table rowKey="id" columns={columns} dataSource={holdings} loading={loading} />;
};
