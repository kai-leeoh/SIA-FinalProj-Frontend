import { LogoutOutlined, PrinterOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, message, Space, Tooltip } from "antd";
import { useEffect, useMemo, useState } from "react";
import { AllocationChart } from "./components/AllocationChart";
import { AuthPage } from "./components/AuthPage";
import { DEFAULT_FILTERS, FilterBar, type Filters } from "./components/FilterBar";
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
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  useEffect(() => {
    const done = () => setPrinting(false);
    window.addEventListener("afterprint", done);
    return () => window.removeEventListener("afterprint", done);
  }, []);

  const filteredHoldings = useMemo(
    () =>
      holdings.filter((h) => {
        if (filters.type !== "all" && h.type !== filters.type) return false;
        if (
          filters.search.trim() &&
          !h.asset.toLowerCase().includes(filters.search.trim().toLowerCase())
        )
          return false;
        if (filters.result === "gain" && !(h.gain_loss != null && h.gain_loss >= 0)) return false;
        if (filters.result === "loss" && !(h.gain_loss != null && h.gain_loss < 0)) return false;
        if (filters.dateFrom || filters.dateTo) {
          if (!h.purchase_date) return false;
          if (filters.dateFrom && h.purchase_date < filters.dateFrom) return false;
          if (filters.dateTo && h.purchase_date > filters.dateTo) return false;
        }
        return true;
      }),
    [holdings, filters]
  );

  const isFiltered =
    filters.search !== "" ||
    filters.type !== "all" ||
    filters.result !== "all" ||
    filters.dateFrom !== null ||
    filters.dateTo !== null;
  const filterSummary = [
    (filters.dateFrom || filters.dateTo) &&
    `Purchased: ${filters.dateFrom ?? "any"} to ${filters.dateTo ?? "any"}`,
    filters.type !== "all" && `Type: ${filters.type === "etf" ? "Stocks / ETFs" : "Crypto"}`,
    filters.search.trim() && `Search: "${filters.search.trim()}"`,
    filters.result !== "all" && `Result: ${filters.result === "gain" ? "Gains only" : "Losses only"}`,
  ]
    .filter(Boolean)
    .join(", ");

  const handlePrint = () => {
    setPrinting(true);
    setTimeout(() => window.print(), 300);
  };

  const symbol = CURRENCY_SYMBOLS[currency] ?? currency;
  const totalValue = convert(
    filteredHoldings.reduce((s, h) => s + (h.current_value ?? 0), 0),
    currency
  );
  const totalGainLoss = convert(
    filteredHoldings.reduce((s, h) => s + (h.gain_loss ?? 0), 0),
    currency
  );

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
          Filters: {filterSummary || "none"} | Showing {filteredHoldings.length} of {holdings.length} holdings
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
          holdings={filteredHoldings}
          onAddClick={handleAddClick}
          currency={currency}
          onCurrencyChange={setCurrency}
          currencies={currencies}
          convert={convert}
          loading={ratesLoading}
        />
      </div>

      <FilterBar filters={filters} onChange={setFilters} />

      <div className={isFiltered ? "no-print" : undefined}>
        <GainLossChart holdings={holdings} currency={currency} convert={convert} />
      </div>
      <AllocationChart holdings={filteredHoldings} currency={currency} convert={convert} />
      <PortfolioTable
        holdings={filteredHoldings}
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
