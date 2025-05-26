"use client";
import { useRouter } from "next/navigation";
import useInventario from "../hooks/useInventario";
import HeaderInventario from "../components/inventario/HeaderInventario";
import CardProducto from "../components/inventario/CardProducto";
import FormularioProducto from "../components/inventario/FormularioProducto";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import ProtectedRoute from "../components/auth/ProtectedRoute";
export default function InventoryManagementPage() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const { logout } = useAuth();

  const {
    categorias,
    proveedores,
    formData,
    setFormData,
    file,
    setFile,
    modalVisible,
    setModalVisible,
    searchTerm,
    setSearchTerm,
    handleOpenModal,
    handleAddOrUpdateProducto,
    handleEditProducto,
    handleDeleteProducto,
    loading,
    productos, // Ahora usamos productos directamente
  } = useInventario();

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen">
        <HeaderInventario
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onOpenModal={handleOpenModal}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          router={router}
          handleLogout={logout}
        />

        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 bg-gray-100 overflow-y-auto p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* 🔥 Protección extra aquí */}
              {loading ? (
                <div className="col-span-4 flex justify-center items-center h-48">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-[#712b39] border-opacity-50"></div>
                </div>
              ) : productos && productos.length > 0 ? (
                productos.map((producto) => (
                  <CardProducto
                    key={producto.id}
                    producto={producto}
                    categorias={categorias}
                    onEdit={handleEditProducto}
                    onDelete={handleDeleteProducto}
                  />
                ))
              ) : (
                <p className="text-center text-gray-500 col-span-4">
                  No se encontraron productos.
                </p>
              )}
            </div>
          </div>
        </div>

        {modalVisible && (
          <FormularioProducto
            isOpen={modalVisible}
            onClose={() => setModalVisible(false)}
            formData={formData}
            setFormData={setFormData}
            categorias={categorias}
            proveedores={proveedores}
            file={file}
            setFile={setFile}
            onSubmit={handleAddOrUpdateProducto}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
