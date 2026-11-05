"use client";
import React from "react";
import { Package, Calculator, ArrowRight, CheckCircle2 } from "lucide-react";

/**
 * Componente que renderiza el formulario para registrar un ingreso de productos al inventario.
 */
export default function FormularioIngreso({
  filteredProductos = [],
  proveedores = [],
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
  isLoading,
  handleIngreso,
}) {
  const stockActual = Number(selectedProducto?.cantidad_producto) || 0;
  const cant = Number(cantidadIngreso) || 0;
  const costo = Number(costoUnitario) || 0;
  const totalEstimado = cant * costo;
  const stockResultante = stockActual + cant;

  return (
    <div className="w-full bg-white shadow-md rounded-2xl p-6 sm:p-8 mt-6 border border-gray-100">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Buscar y seleccionar producto */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-4 relative">
          <label className="block text-gray-800 font-bold mb-2 text-sm">
            Seleccionar Producto <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#712b39]"
              placeholder="Buscar producto por nombre..."
              value={searchProducto}
              onChange={(e) => {
                if (e.target.value.length <= 60) {
                  setSearchProducto(e.target.value);
                }
              }}
              maxLength={60}
            />
          </div>
          <div className="text-[11px] text-gray-400 text-right mt-1">
            {searchProducto?.length || 0}/60 caracteres
          </div>

          {filteredProductos.length > 0 && !selectedProducto && (
            <ul className="absolute z-30 w-full mt-1 max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-xl divide-y divide-gray-100">
              {filteredProductos.map((producto) => (
                <li
                  key={producto.id}
                  className="p-3 cursor-pointer hover:bg-gray-50 flex items-center justify-between text-sm transition"
                  onClick={() => {
                    setSelectedProducto(producto);
                    setSearchProducto(producto.nombre_producto);
                  }}
                >
                  <span className="font-medium text-gray-800">{producto.nombre_producto}</span>
                  <span className="text-xs text-gray-500 font-semibold bg-gray-100 px-2 py-0.5 rounded-full">
                    Stock: {producto.cantidad_producto || 0}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {selectedProducto && (
            <div className="mt-3 p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    {selectedProducto.nombre_producto}
                  </p>
                  <p className="text-xs text-emerald-800">
                    Stock actual: <strong>{stockActual}</strong> unidades • PVP actual: ${parseFloat(selectedProducto.pvp_producto || 0).toFixed(2)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedProducto(null);
                  setSearchProducto("");
                }}
                className="text-xs text-gray-500 hover:text-red-600 font-semibold underline px-2 py-1"
              >
                Cambiar
              </button>
            </div>
          )}
        </div>

        {/* Proveedor */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-2">
          <label className="block text-gray-800 font-bold mb-2 text-sm">
            Seleccionar Proveedor <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#712b39]"
            value={selectedProveedor || ""}
            onChange={(e) => setSelectedProveedor(e.target.value)}
          >
            <option value="">Seleccionar proveedor...</option>
            {proveedores.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre_proveedor}
              </option>
            ))}
          </select>
        </div>

        {/* Cantidad y Costo */}
        <div className="col-span-1">
          <label className="block text-gray-800 font-bold mb-2 text-sm">
            Cantidad a Ingresar <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#712b39]"
            placeholder="0"
            value={cantidadIngreso}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || (parseInt(value) >= 0 && value >= 0)) {
                setCantidadIngreso(value);
              }
            }}
            min="1"
            onKeyDown={(e) => {
              if (e.key === "-" || e.key === "e" || e.key === "E") {
                e.preventDefault();
              }
            }}
          />
        </div>

        <div className="col-span-1">
          <label className="block text-gray-800 font-bold mb-2 text-sm">
            Costo Unitario ($) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#712b39]"
            placeholder="0.00"
            value={costoUnitario}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || (parseFloat(value) >= 0 && value >= 0)) {
                setCostoUnitario(value);
              }
            }}
            min="0"
            step="0.01"
            onKeyDown={(e) => {
              if (e.key === "-" || e.key === "e" || e.key === "E") {
                e.preventDefault();
              }
            }}
          />
        </div>

        {/* Tarjeta de cálculo y proyección reactiva */}
        {selectedProducto && (cant > 0 || costo > 0) && (
          <div className="col-span-1 sm:col-span-2 lg:col-span-4 bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white shadow-xs flex items-center justify-center text-[#712b39]">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-gray-500 font-medium">Proyección de Stock:</span>
                <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
                  <span>{stockActual} u.</span>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                  <span className="text-emerald-700 font-black">{stockResultante} unidades</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-gray-500 font-medium">Inversión Total de Entrada:</span>
              <p className="text-xl font-black text-[#712b39]">
                ${totalEstimado.toFixed(2)}
              </p>
            </div>
          </div>
        )}

        {/* Motivo */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-4">
          <label className="block text-gray-800 font-bold mb-2 text-sm">
            Motivo / Factura del Ingreso
          </label>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#712b39]"
            rows={2}
            placeholder="Ej: Factura Proveedor N° 001-002-12345, reposición de inventario mensual"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
          />
        </div>
      </div>

      {/* Botón */}
      <div className="mt-6">
        <button
          onClick={handleIngreso}
          disabled={isLoading || !selectedProducto || cant <= 0 || costo <= 0 || !selectedProveedor}
          className="w-full bg-[#712b39] hover:bg-[#5e242e] text-white py-3 px-6 rounded-xl font-bold shadow-md hover:shadow-lg active:scale-98 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Registrando entrada..." : "Registrar Ingreso al Inventario"}
        </button>
      </div>
    </div>
  );
}
