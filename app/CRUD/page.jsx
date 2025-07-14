"use client";

import { useState } from "react";
import { CrudTable } from "../components/CRUD/crud-table";
import { DashboardGrid } from "../components/CRUD/dashboard-grid";
import Header from "../components/common/Header2";
import { useAuth } from "../hooks/useAuth";
import { useCrud } from "../hooks/useCrud";

const tableConfigs = {
  proveedor: {
    name: "Proveedores",
    columns: [
      { key: "id", label: "ID" },
      { key: "nombre_proveedor", label: "Nombre" },
      { key: "correo_proveedor", label: "Correo" },
      { key: "telefono_proveedor", label: "Teléfono" },
      { key: "direccion_proveedor", label: "Dirección", type: "textarea" },
    ],
    endpoint: "http://localhost:8000/api/proveedores/",
  },
  laboratorio: {
    name: "Laboratorios",
    columns: [
      { key: "id", label: "ID" },
      { key: "nombre_laboratorio", label: "Nombre" },
      { key: "direccion_laboratorio", label: "Dirección", type: "textarea" },
      { key: "telefono_laboratorio", label: "Teléfono" },
    ],
    endpoint: "http://localhost:8000/api/laboratorios/",
  },
};

export default function CrudSystem() {
  const [currentView, setCurrentView] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const { logout } = useAuth();

  const currentConfig = currentView ? tableConfigs[currentView] : null;
  const endpoint = currentConfig?.endpoint ?? ""; // evita errores en primer render
  const { data, loading, addItem, editItem, deleteItem } = useCrud(endpoint);

  const handleBackToDashboard = () => setCurrentView(null);

  if (!currentView) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header
          title="Gestión de Registros"
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          handleLogout={logout}
        />
        <DashboardGrid onSelectTable={setCurrentView} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header
        title={`Gestión de ${currentConfig.name}`}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        handleLogout={logout}
      />
      <CrudTable
        tableName={currentConfig.name}
        data={data}
        columns={currentConfig.columns}
        onAdd={addItem}
        onEdit={editItem}
        onDelete={deleteItem}
        onBack={handleBackToDashboard}
      />
    </div>
  );
}
