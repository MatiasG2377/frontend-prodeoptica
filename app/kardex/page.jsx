"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { FaDownload } from "react-icons/fa";
import {
  Layers,
  ArrowDownLeft,
  ArrowUpRight,
  DollarSign,
  Package,
  RotateCcw,
  Search,
  Filter,
} from "lucide-react";

import useKardex from "../hooks/useKardex";
import { useAuth } from "../hooks/useAuth";
import { downloadPDF, downloadExcel } from "../utils/exportKardex";
import Header from "../components/common/Header2";
import KardexSearch from "../components/kardex/kardexSearch";
import KardexTable from "../components/kardex/kardexTable";
import KardexDownloadModal from "../components/kardex/kardexDownloadModal";
import ProtectedRoute from "../components/auth/ProtectedRoute";

export default function KardexPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState(null);

  // Estados de filtros para movimientos
  const [filtroTipo, setFiltroTipo] = useState("todos"); // "todos", "entrada", "salida", "ajuste"
  const [filtroPeriodo, setFiltroPeriodo] = useState("todos"); // "todos", "7dias", "mes", "30dias"
  const [filtroReferencia, setFiltroReferencia] = useState("");

  const { logout } = useAuth();

  const {
    productos,
    filteredProductos,
    searchTerm,
    kardexMovimientos,
    isLoading,
    handleSearch,
    handleSelectProducto,
  } = useKardex();

  const handleSelectWithDetails = (id) => {
    if (Array.isArray(productos)) {
      const prod = productos.find((p) => p.id === id);
      setSelectedProducto(prod || null);
    }
    handleSelectProducto(id);
  };

  // Movimientos filtrados según controles de usuario
  const movimientosFiltrados = useMemo(() => {
    if (!Array.isArray(kardexMovimientos)) return [];

    const ahora = new Date();

    return kardexMovimientos.filter((m) => {
      // 1. Filtro Tipo
      if (filtroTipo !== "todos") {
        const tipo = (m.tipo_kardex || "").toLowerCase();
        if (filtroTipo === "entrada" && !tipo.includes("entrada") && !tipo.includes("ingreso") && !tipo.includes("compra")) {
          return false;
        }
        if (filtroTipo === "salida" && !tipo.includes("salida") && !tipo.includes("venta") && !tipo.includes("egreso")) {
          return false;
        }
        if (filtroTipo === "ajuste" && !tipo.includes("ajuste")) {
          return false;
        }
      }

      // 2. Filtro Período
      if (filtroPeriodo !== "todos" && m.fecha_kardex) {
        const fechaMov = new Date(m.fecha_kardex);
        const diffDias = (ahora - fechaMov) / (1000 * 60 * 60 * 24);

        if (filtroPeriodo === "7dias" && diffDias > 7) return false;
        if (filtroPeriodo === "30dias" && diffDias > 30) return false;
        if (filtroPeriodo === "mes") {
          if (
            fechaMov.getMonth() !== ahora.getMonth() ||
            fechaMov.getFullYear() !== ahora.getFullYear()
          ) {
            return false;
          }
        }
      }

      // 3. Filtro Referencia
      if (filtroReferencia.trim()) {
        const term = filtroReferencia.toLowerCase();
        const ref = (m.referencia_kardex || "").toLowerCase();
        if (!ref.includes(term)) return false;
      }

      return true;
    });
  }, [kardexMovimientos, filtroTipo, filtroPeriodo, filtroReferencia]);

  // Resumen contable acumulado de los movimientos del Kardex
  const resumenContable = useMemo(() => {
    if (!Array.isArray(kardexMovimientos) || kardexMovimientos.length === 0) {
      return {
        totalEntradas: 0,
        totalSalidas: 0,
        saldoStock: selectedProducto?.cantidad_producto || 0,
        saldoValorizado: 0,
      };
    }

    let totalEntradas = 0;
    let totalSalidas = 0;

    kardexMovimientos.forEach((m) => {
      const tipo = (m.tipo_kardex || "").toLowerCase();
      const cant = Number(m.cantidad_kardex) || 0;
      if (tipo.includes("entrada") || tipo.includes("ingreso") || tipo.includes("compra")) {
        totalEntradas += cant;
      } else if (tipo.includes("salida") || tipo.includes("venta") || tipo.includes("egreso")) {
        totalSalidas += cant;
      }
    });

    // El último registro en orden cronológico refleja el saldo actual
    const ultimoMov = kardexMovimientos[kardexMovimientos.length - 1];
    const saldoStock = ultimoMov?.saldo_cantidad_kardex ?? selectedProducto?.cantidad_producto ?? 0;
    const saldoValorizado = parseFloat(ultimoMov?.saldo_costo_kardex || 0);

    return {
      totalEntradas,
      totalSalidas,
      saldoStock,
      saldoValorizado,
    };
  }, [kardexMovimientos, selectedProducto]);

  const limpiarFiltrosMov = () => {
    setFiltroTipo("todos");
    setFiltroPeriodo("todos");
    setFiltroReferencia("");
  };

  const hayFiltrosActivos =
    filtroTipo !== "todos" ||
    filtroPeriodo !== "todos" ||
    filtroReferencia.trim() !== "";

  const handleDownloadBoth = () => {
    downloadPDF(movimientosFiltrados);
    downloadExcel(movimientosFiltrados);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-gray-100">
        <Header
          title="Kardex de Inventario"
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          handleLogout={logout}
        />

        <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
          {/* BUSCADOR DE PRODUCTOS */}
          <KardexSearch
            searchTerm={searchTerm}
            onSearch={handleSearch}
            productos={filteredProductos}
            onSelect={handleSelectWithDetails}
            selectedProducto={selectedProducto}
          />

          {/* TARJETAS RESUMEN DE SALDOS DEL PRODUCTO AUDITADO */}
          {selectedProducto && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Stock / Saldo Actual
                </span>
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black text-[#712b39]">
                    {resumenContable.saldoStock} uds
                  </h3>
                  <div className="w-9 h-9 rounded-xl bg-red-50 text-[#712b39] flex items-center justify-center font-bold">
                    <Package className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Total Entradas (Compras)
                </span>
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black text-emerald-700">
                    +{resumenContable.totalEntradas} uds
                  </h3>
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                    <ArrowDownLeft className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Total Salidas (Ventas)
                </span>
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black text-rose-700">
                    -{resumenContable.totalSalidas} uds
                  </h3>
                  <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Saldo Valorizado ($)
                </span>
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black text-gray-900">
                    ${resumenContable.saldoValorizado.toFixed(2)}
                  </h3>
                  <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* BARRA DE HERRAMIENTAS Y FILTROS DE MOVIMIENTOS */}
          <div className="bg-white p-5 rounded-2xl shadow-xs border border-gray-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-[#712b39] flex items-center gap-2">
                  <Layers className="w-5 h-5" />
                  <span>Movimientos Auditados del Kardex</span>
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Auditoría detallada de transacciones, costos unitarios y comprobantes
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                {hayFiltrosActivos && (
                  <button
                    type="button"
                    onClick={limpiarFiltrosMov}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition active:scale-95"
                    title="Restablecer filtros"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Limpiar filtros</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  disabled={movimientosFiltrados.length === 0}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#712b39] text-[#712b39] hover:bg-[#712b39] hover:text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
                >
                  <FaDownload className="text-sm" />
                  <span>Descargar Reporte</span>
                </button>
              </div>
            </div>

            {/* Fila de Filtros */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-gray-100">
              {/* 1. Tipo de Movimiento */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Tipo de Movimiento
                </label>
                <select
                  value={filtroTipo}
                  onChange={(e) => setFiltroTipo(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs sm:text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#712b39] focus:bg-white transition cursor-pointer"
                >
                  <option value="todos">Todos los Movimientos</option>
                  <option value="entrada">📥 Entradas / Compras</option>
                  <option value="salida">📤 Salidas / Ventas</option>
                  <option value="ajuste">⚙ Ajustes de Inventario</option>
                </select>
              </div>

              {/* 2. Período / Fecha */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Rango de Fecha
                </label>
                <select
                  value={filtroPeriodo}
                  onChange={(e) => setFiltroPeriodo(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs sm:text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#712b39] focus:bg-white transition cursor-pointer"
                >
                  <option value="todos">Todo el Historial</option>
                  <option value="7dias">Últimos 7 días</option>
                  <option value="mes">Este Mes en Curso</option>
                  <option value="30dias">Últimos 30 días</option>
                </select>
              </div>

              {/* 3. Búsqueda por Referencia */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Buscar por Comprobante / Ref.
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Ej: Factura #, Proveedor..."
                    value={filtroReferencia}
                    onChange={(e) => setFiltroReferencia(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#712b39] focus:bg-white transition"
                  />
                </div>
              </div>
            </div>

            {/* Contador de movimientos */}
            {kardexMovimientos.length > 0 && (
              <div className="text-[11px] text-gray-500 flex items-center justify-between pt-1">
                <span>
                  Mostrando <strong>{movimientosFiltrados.length}</strong> de{" "}
                  <strong>{kardexMovimientos.length}</strong> movimientos registrados
                </span>
                {hayFiltrosActivos && (
                  <span className="text-[#712b39] font-bold">Filtros aplicados</span>
                )}
              </div>
            )}

            {/* TABLA DE MOVIMIENTOS */}
            <div className="pt-2">
              <KardexTable
                movimientos={movimientosFiltrados}
                isLoading={isLoading}
              />
            </div>

            {/* MODAL DE DESCARGA */}
            {isModalOpen && (
              <KardexDownloadModal
                onClose={() => setIsModalOpen(false)}
                onPDF={() => {
                  downloadPDF(movimientosFiltrados);
                  setIsModalOpen(false);
                }}
                onExcel={() => {
                  downloadExcel(movimientosFiltrados);
                  setIsModalOpen(false);
                }}
                onBoth={() => {
                  handleDownloadBoth();
                  setIsModalOpen(false);
                }}
              />
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
