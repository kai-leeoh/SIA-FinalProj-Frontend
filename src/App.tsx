import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, message, Space, Tooltip } from "antd";
import { useState } from "react";
import { AllocationChart } from "./components/AllocationChart";
import { AuthPage } from "./components/AuthPage";
import { GainLossChart } from "./components/GainLossChart";
import { PortfolioFormModal } from "./components/PortfolioFormModal";
import { PortfolioHeader } from "./components/PortfolioHeader";
import { PortfolioTable } from "./components/PortfolioTable";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { useExchangeRates, type Currency } from "./hooks/useExchangeRates";
import { usePortfolio } from "./hooks/usePortfolio";
import type { EnrichedHolding, HoldingFormValues } from "./types/portfolio";

function PortfolioApp() {
  const { logout, user } = useAuth();
  const { holdings, loading, addHolding, editHolding, removeHolding } = usePortfolio();
  const { convert, currencies, loading: ratesLoading } = useExchangeRates();
  const [currency, setCurrency] = useState<Currency>("USD");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingHolding, setEditingHolding] = useState<EnrichedHolding | null>(null);

  const handleAddClick = () => {
    setEditingHolding(null);
    setModalOpen(true);
  };

  const handleEditClick = (holding: EnrichedHolding) => {
    setEditingHolding(holding);
    setModalOpen(true);
  };

  const handleSubmit = async (values: HoldingFormValues) => {
    try {
      if (editingHolding) {
        await editHolding(editingHolding.id, values);
        message.success("Holding updated.");
      } else {
        await addHolding(values);
        message.success("Holding added.");
      }
      setModalOpen(false);
    } catch {
      message.error("Couldn't save that holding. Try again.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await removeHolding(id);
      message.success("Holding deleted.");
    } catch {
      message.error("Couldn't delete that holding. Try again.");
    }
  };

  return (
    <div style={{ padding: 32, maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <Tooltip title={user?.email ?? ""}>
          <Space>
            <Avatar size="small" icon={<UserOutlined />} />
            <span style={{ fontSize: 13, color: "#5C6B72" }}>{user?.email ?? "Loading..."}</span>
          </Space>
        </Tooltip>
        <Button icon={<LogoutOutlined />} onClick={logout}>
          Log Out
        </Button>
      </div>
      <PortfolioHeader
        holdings={holdings}
        onAddClick={handleAddClick}
        currency={currency}
        onCurrencyChange={setCurrency}
        currencies={currencies}
        convert={convert}
        loading={ratesLoading}
      />
      <GainLossChart holdings={holdings} />
      <AllocationChart holdings={holdings} currency={currency} convert={convert} />
      <PortfolioTable
        holdings={holdings}
        loading={loading}
        onEdit={handleEditClick}
        onDelete={handleDelete}
        currency={currency}
        convert={convert}
      />
      <PortfolioFormModal
        open={modalOpen}
        editingHolding={editingHolding}
        onCancel={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

function AppContent() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <PortfolioApp /> : <AuthPage />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
