import { useState } from "react";
import { Button } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AuthPage } from "./components/AuthPage";
import { usePortfolio } from "./hooks/usePortfolio";
import { PortfolioHeader } from "./components/PortfolioHeader";
import { PortfolioTable } from "./components/PortfolioTable";
import { PortfolioFormModal } from "./components/PortfolioFormModal";
import type { EnrichedHolding, HoldingFormValues } from "./types/portfolio";

function PortfolioApp() {
  const { logout } = useAuth();
  const { holdings, loading, addHolding, editHolding, removeHolding } = usePortfolio();
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
    if (editingHolding) {
      await editHolding(editingHolding.id, values);
    } else {
      await addHolding(values);
    }
    setModalOpen(false);
  };

  return (
    <div style={{ padding: 32, maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <Button icon={<LogoutOutlined />} onClick={logout}>
          Log Out
        </Button>
      </div>
      <PortfolioHeader holdings={holdings} onAddClick={handleAddClick} />
      <PortfolioTable
        holdings={holdings}
        loading={loading}
        onEdit={handleEditClick}
        onDelete={removeHolding}
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