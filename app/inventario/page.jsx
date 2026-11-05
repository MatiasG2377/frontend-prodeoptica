"use client";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import useInventario from "../hooks/useInventario";
import Header from "../components/common/Header";
import CardProducto from "../components/inventario/CardProducto";
import FormularioProducto from "../components/inventario/FormularioProducto";
import { CardSkeleton } from "../components/common/Skeleton";
import { useAuth } from "../hooks/useAuth";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import {
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  RotateCcw,
  Package,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default function InventoryManagementPage() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const { logout } = useAuth();

  // Estados de filtros
  const [selectedCategoria, setSelectedCategoria] = useState("todas");
  const [stockFilter, setStockFilter] = useState("todos"); // "todos", "con_stock", "bajo_stock", "agotado"
  const [sortBy, setSortBy] = useState("nombre_asc"); // "nombre_asc", "nombre_desc", "precio_asc", "precio_desc", "stock_asc"

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
    productos,
  } = useInventario();

  // Métricas rápidas de inventario
  const metricasStock = useMemo(() => {
    if (!Array.isArray(productos)) return { total: 0, bajo: 0, agotado: 0 };
    let bajo = 0;
    let agotado = 0;
    productos.forEach((p) => {
      const stock = Number(p.cantidad_producto) || 0;
      const min = Number(p.minimo_producto) || 0;
      if (p.controla_stock !== false) {
        if (stock === 0) agotado++;
        else if (stock <= min) bajo++;
      }
    });
    return { total: productos.length, bajo, agotado };
  }, [productos]);

  // Filtrado y ordenamiento de productos
  const productosFiltrados = useMemo(() => {
    if (!Array.isArray(productos)) return [];

    return productos
      .filter((prod) => {
        // 1. Filtro por Categoría
        if (selectedCategoria !== "todas") {
          const catId =
            typeof prod.categoria_producto === "object"
              ? prod.categoria_producto?.id
              : prod.categoria_producto;
          if (String(catId) !== String(selectedCategoria)) {
            return false;
          }
        }

        // 2. Filtro por Nivel de Stock
        const stock = Number(prod.cantidad_producto) || 0;
        const minimo = Number(prod.minimo_producto) || 0;
        const controlaStock = prod.controla_stock !== false;

        if (stockFilter === "agotado") {
          if (stock > 0 || !controlaStock) return false;
        } else if (stockFilter === "bajo_stock") {
          if (stock <= 0 || stock > minimo || !controlaStock) return false;
        } else if (stockFilter === "con_stock") {
          if (stock <= 0 && controlaStock) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "nombre_asc") {
          return (a.nombre_producto || "").localeCompare(b.nombre_producto || "");
        }
        if (sortBy === "nombre_desc") {
          return (b.nombre_producto || "").localeCompare(a.nombre_producto || "");
        }
        if (sortBy === "precio_asc") {
          return (Number(a.pvp_producto) || 0) - (Number(b.pvp_producto) || 0);
        }
        if (sortBy === "precio_desc") {
          return (Number(b.pvp_producto) || 0) - (Number(a.pvp_producto) || 0);
        }
        if (sortBy === "stock_asc") {
          return (Number(a.cantidad_producto) || 0) - (Number(b.cantidad_producto) || 0);
        }
        return 0;
      });
  }, [productos, selectedCategoria, stockFilter, sortBy]);

  const limpiarFiltros = () => {
    setSelectedCategoria("todas");
    setStockFilter("todos");
    setSortBy("nombre_asc");
    setSearchTerm("");
  };

  const hayFiltrosActivos =
    selectedCategoria !== "todas" ||
    stockFilter !== "todos" ||
    sortBy !== "nombre_asc" ||
    Boolean(searchTerm && searchTerm.trim() !== "");

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen">
        <Header
          title="Gestión de Inventario"
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          handleLogout={logout}
        />

        {/* BARRA DE HERRAMIENTAS, FILTROS Y CONTROLES */}
        <div className="bg-white border-b border-gray-200 p-4 shadow-2xs">
          <div className="max-w-7xl mx-auto space-y-3">
            {/* Fila Superior: Título, Métricas y Botón Agregar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-xl font-black text-[#712b39] flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  <span>Catálogo de Productos e Inventario</span>
                </h1>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
                  <span className="font-semibold text-gray-700">
                    Total: {metricasStock.total} productos
                  </span>
                  {metricasStock.bajo > 0 && (
                    <span className="px-2 py-0.5 rounded-full font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      ⚠ {metricasStock.bajo} con stock bajo
                    </span>
                  )}
                  {metricasStock.agotado > 0 && (
                    <span className="px-2 py-0.5 rounded-full font-bold bg-rose-50 text-rose-800 border border-rose-200">
                      ✕ {metricasStock.agotado} agotados
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                {hayFiltrosActivos && (
                  <button
                    type="button"
                    onClick={limpiarFiltros}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition active:scale-95"
                    title="Restablecer todos los filtros"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Limpiar filtros</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleOpenModal}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#712b39] hover:bg-[#5e242e] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nuevo Producto</span>
                </button>
              </div>
            </div>

            {/* Fila Inferior: Buscador + Selectores de Filtro */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-gray-100">
              {/* 1. Buscador */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, código..."
                  value={searchTerm || ""}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#712b39] focus:bg-white transition"
                />
              </div>

              {/* 2. Filtro Categoría */}
              <div className="relative">
                <select
                  value={selectedCategoria}
                  onChange={(e) => setSelectedCategoria(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs sm:text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#712b39] focus:bg-white transition cursor-pointer"
                >
                  <option value="todas">Todas las Categorías</option>
                  {Array.isArray(categorias) &&
                    categorias.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nombre_categoria}
                      </option>
                    ))}
                </select>
              </div>

              {/* 3. Filtro Nivel de Stock */}
              <div className="relative">
                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs sm:text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#712b39] focus:bg-white transition cursor-pointer"
                >
                  <option value="todos">Todos los Estados de Stock</option>
                  <option value="con_stock">🟢 En Stock (&gt; 0)</option>
                  <option value="bajo_stock">🟡 Stock Crítico / Bajo</option>
                  <option value="agotado">🔴 Agotados (= 0)</option>
                </select>
              </div>

              {/* 4. Ordenamiento */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs sm:text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#712b39] focus:bg-white transition cursor-pointer"
                >
                  <option value="nombre_asc">Ordenar: Nombre (A - Z)</option>
                  <option value="nombre_desc">Ordenar: Nombre (Z - A)</option>
                  <option value="precio_asc">Precio: Menor a Mayor</option>
                  <option value="precio_desc">Precio: Mayor a Menor</option>
                  <option value="stock_asc">Menor Stock Primero</option>
                </select>
              </div>
            </div>

            {/* Contador de resultados */}
            <div className="text-[11px] text-gray-500 flex items-center justify-between pt-1">
              <span>
                Mostrando <strong>{productosFiltrados.length}</strong> de{" "}
                <strong>{productos.length}</strong> productos registrados
              </span>
              {hayFiltrosActivos && (
                <span className="text-[#712b39] font-bold">Filtros aplicados</span>
              )}
            </div>
          </div>
        </div>

        {/* GRILLA DE PRODUCTOS */}
        <div className="flex-1 bg-gray-100 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <CardSkeleton count={8} />
            ) : productosFiltrados.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {productosFiltrados.map((producto) => (
                  <CardProducto
                    key={producto.id}
                    producto={producto}
                    categorias={categorias}
                    onEdit={handleEditProducto}
                    onDelete={handleDeleteProducto}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-xs max-w-lg mx-auto mt-8">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-gray-800">
                  No se encontraron productos
                </h3>
                <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                  {hayFiltrosActivos
                    ? "Intenta modificar o limpiar los filtros seleccionados para ver más resultados."
                    : "No hay productos registrados en el sistema."}
                </p>
                {hayFiltrosActivos && (
                  <button
                    type="button"
                    onClick={limpiarFiltros}
                    className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-[#712b39] text-white rounded-xl text-xs font-bold transition active:scale-95 shadow-xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restablecer filtros</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* MODAL CREAR / EDITAR PRODUCTO */}
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
