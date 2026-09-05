import { useEffect, useState } from "react";
import { Modal, Form, InputNumber, Select } from "antd";
import type { EnrichedHolding, HoldingFormValues } from "../types/portfolio";
import { getPrice } from "../api/portfolioApi";

const ASSET_OPTIONS = [
  { value: "BTC", label: "Bitcoin (BTC)", type: "crypto" },
  { value: "ETH", label: "Ethereum (ETH)", type: "crypto" },
  { value: "VTI", label: "Vanguard Total Stock Market (VTI)", type: "etf" },
  { value: "VXUS", label: "Vanguard Total International Stock (VXUS)", type: "etf" },
] as const;

interface Props {
  open: boolean;
  editingHolding: EnrichedHolding | null;
  onCancel: () => void;
  onSubmit: (values: HoldingFormValues) => Promise<void>;
}

export const PortfolioFormModal = ({ open, editingHolding, onCancel, onSubmit }: Props) => {
  const [form] = Form.useForm<HoldingFormValues>();
  const [livePrice, setLivePrice] = useState<number | null>(null);
  const [priceLoading, setPriceLoading] = useState(false);

  useEffect(() => {
    if (editingHolding) {
      form.setFieldsValue(editingHolding);
      setLivePrice(editingHolding.current_price);
    } else {
      form.resetFields();
      setLivePrice(null);
    }
  }, [editingHolding, form]);

  const recalculateCostBasis = (price: number | null, quantity: number | null) => {
    if (price != null && quantity != null) {
      form.setFieldValue("cost_basis", Number((price * quantity).toFixed(2)));
    }
  };

const handleAssetChange = async (value: string) => {
  const selected = ASSET_OPTIONS.find((a) => a.value === value);
  if (selected) {
    form.setFieldValue("type", selected.type);
  }
  setPriceLoading(true);
  try {
    const price = await getPrice(value);
    setLivePrice(price);
    recalculateCostBasis(price, form.getFieldValue("quantity"));
  } catch (error) {
    console.error("getPrice failed:", error);   // ← temporary debug line
    setLivePrice(null);
  } finally {
    setPriceLoading(false);
  }
};
  const handleQuantityChange = (value: number | null) => {
    recalculateCostBasis(livePrice, value);
  };

  const handleOk = async () => {
    const values = await form.validateFields();
    await onSubmit(values);
    form.resetFields();
    setLivePrice(null);
  };

  return (
    <Modal
      title={editingHolding ? "Edit Holding" : "Add Holding"}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      okText={editingHolding ? "Save" : "Add"}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="asset" label="Asset" rules={[{ required: true, message: "Select an asset" }]}>
          <Select
            placeholder="Select a coin or ETF"
            options={ASSET_OPTIONS.map(({ value, label }) => ({ value, label }))}
            onChange={handleAssetChange}
            loading={priceLoading}
          />
        </Form.Item>
        <Form.Item name="type" hidden>
          <InputNumber />
        </Form.Item>
        <Form.Item name="quantity" label="Quantity" rules={[{ required: true, type: "number" }]}>
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            step={0.0001}
            onChange={handleQuantityChange}
          />
        </Form.Item>
        <Form.Item
          name="cost_basis"
          label={livePrice != null ? `Cost Basis ($) — auto-filled at $${livePrice}` : "Cost Basis ($)"}
          rules={[{ required: true, type: "number" }]}
        >
          <InputNumber style={{ width: "100%" }} min={0} step={0.01} disabled />
        </Form.Item>
      </Form>
    </Modal>
  );
};
