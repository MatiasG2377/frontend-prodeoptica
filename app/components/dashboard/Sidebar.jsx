"use client";
import React from "react";
import { Tag } from "lucide-react";

/**
 * Sidebar de categorías para el Punto de Venta.
 *
 * @param {Object} props
 * @param {Array} props.categorias - Listado de categorías.
 * @param {number|null} props.selectedCategoria - ID de la categoría seleccionada.
 * @param {Function} props.setSelectedCategoria - Setter para categoría activa.
 * @returns {JSX.Element}
 */
export default function Sidebar({
  categorias = [],
  selectedCategoria,
  setSelectedCategoria,
}) {
  return (
    <aside
      className="hidden md:flex md:w-60 bg-[#712b39] text-white flex-col border-r border-[#5e242e] h-full shadow-lg"
      style={{ minWidth: "220px" }}
    >
      <div className="p-4 border-b border-white/10 flex items-center gap-2">
        <Tag className="w-4 h-4 text-white/80" />
        <h3 className="font-bold text-sm tracking-wide uppercase text-white/90">
          Categorías
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        <button
          type="button"
          className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            selectedCategoria === null
              ? "bg-white text-[#712b39] font-black shadow-md"
              : "hover:bg-white/10 text-white/90"
          }`}
          onClick={() => setSelectedCategoria(null)}
        >
          Todas las Categorías
        </button>

        {categorias.map((categoria) => {
          const isSelected = selectedCategoria === categoria.id;
          return (
            <button
              key={categoria.id}
              type="button"
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isSelected
                  ? "bg-white text-[#712b39] font-black shadow-md"
                  : "hover:bg-white/10 text-white/90"
              }`}
              onClick={() => setSelectedCategoria(categoria.id)}
            >
              {categoria.nombre_categoria}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
