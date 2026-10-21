import { LogoutOutlined, PrinterOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, message, Space, Tooltip } from "antd";
import { useEffect, useState } from "react";
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
import { CURRENCY_SYMBOLS } from "./utils/currency";

function PortfolioApp() {
  const { logout, user } = useAuth();
  const { holdings, loading, addHolding, editHolding, removeHolding } = usePortfolio();
  const { convert, currencies, loading: ratesLoading } = useExchangeRates();
  const [currency, setCurrency] = useState<Currency>("USD");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingHolding, setEditingHolding] = useState<EnrichedHolding | null>(null);

  const [printing, setPrinting] = useState(false);

  useEffect(() => {
    const done = () => setPrinting(false);
    window.addEventListener("afterprint", done);
    return () => window.removeEventListener("afterprint", done);
  }, []);

  const handlePrint = () => {
    setPrinting(true);
    setTimeout(() => window.print(), 300);
  };

  const symbol = CURRENCY_SYMBOLS[currency] ?? currency;
  const totalValue = convert(holdings.reduce((s, h) => s + (h.current_value ?? 0), 0), currency);
  const totalGainLoss = convert(holdings.reduce((s, h) => s + (h.gain_loss ?? 0), 0), currency);

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
      <div className="print-only report-header">
        <h1 className="serif-title">Portfolio Report</h1>
        <p>
          {user?.email} | Generated {new Date().toLocaleString()} | Currency: {currency}
        </p>
        <p>
          Total value: {symbol}{totalValue.toFixed(2)} | Gain / Loss: {totalGainLoss >= 0 ? "+" : ""}
          {symbol}{totalGainLoss.toFixed(2)}
        </p>
      </div>

      <div
        className="no-print"
        style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 12, marginBottom: 16 }}
      >
        <Tooltip title={user?.email ?? ""}>
          <Space>
            <Avatar size="small" icon={<UserOutlined />} />
            <span style={{ fontSize: 13, color: "#5C6B72" }}>{user?.email ?? "Loading..."}</span>
          </Space>
        </Tooltip>
        <Button icon={<PrinterOutlined />} onClick={handlePrint}>
          Print Report
        </Button>
        <Button icon={<LogoutOutlined />} onClick={logout}>
          Log Out
        </Button>
      </div>

      <div className="no-print">
        <PortfolioHeader
          holdings={holdings}
          onAddClick={handleAddClick}
          currency={currency}
          onCurrencyChange={setCurrency}
          currencies={currencies}
          convert={convert}
          loading={ratesLoading}
        />
      </div>

      <GainLossChart holdings={holdings} currency={currency} convert={convert} />
      <AllocationChart holdings={holdings} currency={currency} convert={convert} />
      <PortfolioTable
        holdings={holdings}
        loading={loading}
        onEdit={handleEditClick}
        onDelete={handleDelete}
        currency={currency}
        convert={convert}
        printing={printing}
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

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
