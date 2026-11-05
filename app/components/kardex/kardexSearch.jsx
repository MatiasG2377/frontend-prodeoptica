"use client";
import React from "react";
import { Search, Package, CheckCircle2 } from "lucide-react";

/**
 * Componente que renderiza un buscador inteligente de productos para el Kardex
 * con autocompletado y preview de stock / código.
 */
export default function KardexSearch({
  searchTerm,
  onSearch,
  productos = [],
  onSelect,
  selectedProducto = null,
}) {
  const isTyping = Boolean(searchTerm && searchTerm.trim().length > 0);

  return (
    <div className="bg-white p-5 rounded-2xl shadow-xs border border-gray-200 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div>
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Search className="w-5 h-5 text-[#712b39]" />
            <span>Seleccionar Producto para Auditar Kardex</span>
          </h2>
          <p className="text-xs text-gray-500">
            Escribe el nombre o código del producto para cargar su historial valorado de entradas y salidas.
          </p>
        </div>

        {selectedProducto && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold self-start sm:self-auto">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>
              Producto activo: <strong>{selectedProducto.nombre_producto}</strong>
            </span>
          </div>
        )}
      </div>

      <div className="relative w-full">
        <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          type="text"
          className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#712b39] focus:bg-white transition"
          placeholder="Escribe el nombre o código del producto (ej: Armazón, Ray-Ban, Luna)..."
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      {/* Resultados de búsqueda flotantes / desplegables */}
      {isTyping && (
        <div className="mt-2 bg-white rounded-xl border border-gray-200 shadow-md max-h-56 overflow-y-auto divide-y divide-gray-100">
          {productos.length > 0 ? (
            productos.map((producto) => (
              <div
                key={producto.id}
                className="p-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between transition group"
                onClick={() => onSelect(producto.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-red-50 text-gray-500 group-hover:text-[#712b39] flex items-center justify-center transition">
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800 group-hover:text-[#712b39] transition">
                      {producto.nombre_producto}
                    </p>
                    <p className="text-xs text-gray-400">
                      Cód: {producto.codigo_producto || "S/C"} • Stock actual:{" "}
                      <strong className="text-gray-700">
                        {producto.cantidad_producto ?? "—"}
                      </strong>
                    </p>
                  </div>
                </div>

                <span className="text-xs font-bold text-[#712b39] group-hover:underline">
                  Auditar →
                </span>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-xs text-gray-500">
              No se encontraron productos que coincidan con &ldquo;{searchTerm}&rdquo;.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
