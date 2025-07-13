"use client";

import { useState } from "react";
import { CrudTable } from "../components/CRUD/crud-table";
import { DashboardGrid } from "../components/CRUD/dashboard-grid";
import Header from "../components/common/Header2";
import { useAuth } from "../hooks/useAuth"; // Asegúrate que este hook esté funcionando

// Datos de ejemplo
const initialData = {
  proveedor: [
    {
      id: "1",
      nombre: "Producto A",
      categoria: "Categoría 1",
      precio: 25.99,
      stock: 100,
      descripcion: "Descripción del producto A",
    },
    {
      id: "2",
      nombre: "Producto B",
      categoria: "Categoría 2",
      precio: 15.5,
      stock: 50,
      descripcion: "Descripción del producto B",
    },
  ],
  laboratorio: [
    { id: "1", nombre: "Categoría 1", descripcion: "Primera categoría" },
    { id: "2", nombre: "Categoría 2", descripcion: "Segunda categoría" },
  ],
};

// Configuración de columnas para cada tabla
const tableConfigs = {
  proveedor: {
    name: "Proveedores",
    columns: [
      { key: "id", label: "ID" },
      { key: "nombre", label: "Nombre" },
      { key: "categoria", label: "Categoría", type: "select" },
      { key: "precio", label: "Precio", type: "number" },
      { key: "stock", label: "Stock", type: "number" },
      { key: "descripcion", label: "Descripción", type: "textarea" },
    ],
  },
  laboratorio: {
    name: "Laboratorios",
    columns: [
      { key: "id", label: "ID" },
      { key: "nombre", label: "Nombre" },
      { key: "descripcion", label: "Descripción", type: "textarea" },
    ],
  },
};

export default function CrudSystem() {
  const [currentView, setCurrentView] = useState(null);
  const [data, setData] = useState(initialData);
  const [menuOpen, setMenuOpen] = useState(false); // ✅ control del menú
  const { logout } = useAuth(); // ✅ logout del Header

  const handleAdd = (tableName, item) => {
    setData((prev) => ({
      ...prev,
      [tableName]: [...prev[tableName], item],
    }));
  };

  const handleEdit = (tableName, id, updatedItem) => {
    setData((prev) => ({
      ...prev,
      [tableName]: prev[tableName].map((item) =>
        item.id === id ? { ...item, ...updatedItem } : item
      ),
    }));
  };

  const handleDelete = (tableName, id) => {
    setData((prev) => ({
      ...prev,
      [tableName]: prev[tableName].filter((item) => item.id !== id),
    }));
  };

  const handleBackToDashboard = () => {
    setCurrentView(null);
  };

  // Mostrar el dashboard si no hay tabla seleccionada
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

  // Mostrar tabla CRUD de la entidad actual
  const currentConfig = tableConfigs[currentView];
  const currentData = data[currentView];

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
        data={currentData}
        columns={currentConfig.columns}
        onAdd={(item) => handleAdd(currentView, item)}
        onEdit={(id, item) => handleEdit(currentView, id, item)}
        onDelete={(id) => handleDelete(currentView, id)}
        onBack={handleBackToDashboard}
      />
    </div>
  );
}
