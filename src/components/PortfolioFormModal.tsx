import { Form, InputNumber, Modal, Select, Spin } from "antd";
import { useEffect, useState } from "react";
import { getPrice, searchAssets, type AssetSearchResult } from "../api/portfolioApi";
import type { EnrichedHolding, HoldingFormValues } from "../types/portfolio";

interface Props {
  open: boolean;
  editingHolding: EnrichedHolding | null;
  onCancel: () => void;
  onSubmit: (values: HoldingFormValues) => Promise<void>;
}

export const PortfolioFormModal = ({ open, editingHolding, onCancel, onSubmit }: Props) => {
  const [form] = Form.useForm<HoldingFormValues>();
  const [livePrice, setLivePrice] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<AssetSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
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

  // Debounced search as the user types
  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([]);
      return;
    }
    let active = true;
    setSearching(true);
    const handler = setTimeout(async () => {
      try {
        const results = await searchAssets(searchQuery);
        if (active) setSearchResults(results);
      } finally {
        if (active) setSearching(false);
      }
    }, 400);

    return () => {
      active = false;
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const recalculateCostBasis = (price: number | null, quantity: number | null) => {
    if (price != null && quantity != null) {
      form.setFieldValue("cost_basis", Number((price * quantity).toFixed(2)));
    }
  };

  const handleAssetChange = async (value: string) => {
    const selected = searchResults.find((r) => r.value === value);
    if (!selected) return;

    form.setFieldValue("type", selected.type);
    setPriceLoading(true);
    try {
      const price = await getPrice(selected.type, value);
      setLivePrice(price);
      recalculateCostBasis(price, form.getFieldValue("quantity"));
    } catch {
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
    setSearchResults([]);
    setSearchQuery("");
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
        <Form.Item name="asset" label="Asset" rules={[{ required: true, message: "Search and select an asset" }]}>
          <Select
            showSearch
            placeholder="Search stocks or crypto (e.g. bitcoin, AAPL)"
            filterOption={false}
            loading={priceLoading}
            onSearch={setSearchQuery}
            onChange={handleAssetChange}
            notFoundContent={searching ? <Spin size="small" /> : "No results"}
            options={searchResults.map((r) => ({ value: r.value, label: r.label }))}
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
          label={livePrice != null ? `Cost Basis ($) — calculated at $${livePrice}` : "Cost Basis ($) — price unavailable, enter manually"}
          rules={[{ required: true, type: "number" }]}
        >
          <InputNumber style={{ width: "100%" }} min={0} step={0.01} disabled={livePrice != null} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
