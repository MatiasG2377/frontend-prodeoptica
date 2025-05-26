"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/common/Header2";
import FormularioIngreso from "../components/ingresos/FormularioIngreso";
import { useAuth } from "../hooks/useAuth";
import useIngresoProducto from "../hooks/useIngresoProducto";
import { useEffect } from "react";
import ProtectedRoute from "../components/auth/ProtectedRoute";
/**
 * Página de ingreso de productos al inventario.
 *
 * Esta página permite gestionar las entradas de productos al inventario.
 * Incluye un formulario para buscar y seleccionar productos, especificar
 * cantidad, costo unitario, motivo de ingreso, fecha de caducidad y otros
 * detalles relevantes. También gestiona el estado del menú y la autenticación
 * del usuario.
 *
 *? @return {JSX.Element} La página de ingreso de productos.
 */

export default function IngresoProductosPage() {
  const router = useRouter();
  const { logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false); // ✅ Control del menú

  const {
    productos,
    filteredProductos,
    proveedores,
    selectedProveedor,
    setSelectedProveedor,
    searchProducto,
    setSearchProducto,
    selectedProducto,
    setSelectedProducto,
    cantidadIngreso,
    setCantidadIngreso,
    costoUnitario,
    setCostoUnitario,
    motivo,
    setMotivo,
    descripcion,
    setDescripcion,
    marca,
    setMarca,
    metodoValoracion,
    setMetodoValoracion,
    isLoading,
    handleSearchProducto,
    handleIngreso,
  } = useIngresoProducto(router);

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-gray-100">
        <Header
          title="Entradas al Inventario"
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          handleLogout={logout}
        />

        <FormularioIngreso
          productos={productos}
          filteredProductos={filteredProductos}
          proveedores={proveedores}
          selectedProveedor={selectedProveedor}
          setSelectedProveedor={setSelectedProveedor}
          searchProducto={searchProducto}
          setSearchProducto={setSearchProducto}
          selectedProducto={selectedProducto}
          setSelectedProducto={setSelectedProducto}
          cantidadIngreso={cantidadIngreso}
          setCantidadIngreso={setCantidadIngreso}
          costoUnitario={costoUnitario}
          setCostoUnitario={setCostoUnitario}
          motivo={motivo}
          setMotivo={setMotivo}
          descripcion={descripcion}
          setDescripcion={setDescripcion}
          marca={marca}
          setMarca={setMarca}
          metodoValoracion={metodoValoracion}
          setMetodoValoracion={setMetodoValoracion}
          isLoading={isLoading}
          handleSearchProducto={handleSearchProducto}
          handleIngreso={handleIngreso}
        />
      </div>
    </ProtectedRoute>
  );
}
