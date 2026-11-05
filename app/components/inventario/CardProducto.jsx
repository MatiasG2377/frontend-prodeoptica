"use client";
import React from "react";
import { Package, Pencil, Trash2 } from "lucide-react";

/**
 * Componente que muestra una tarjeta de un producto en el módulo de Inventario.
 *
 * @param {Object} props
 * @param {Object} props.producto - Información del producto.
 * @param {Array} props.categorias - Listado de categorías.
 * @param {Function} props.onEdit - Callback al pulsar editar.
 * @param {Function} props.onDelete - Callback al pulsar eliminar.
 * @returns {JSX.Element}
 */
export default function CardProducto({
  producto,
  categorias = [],
  onEdit,
  onDelete,
}) {
  const categoria = categorias.find(
    (c) => c.id === producto.categoria_producto
  );

  const stock = Number(producto.cantidad_producto) || 0;
  const min = Number(producto.minimo_producto) || 0;
  const max = Number(producto.maximo_producto) || (min > 0 ? min * 3 : 10);
  const diff = max - min;
  const porcentajeStock = diff > 0
    ? Math.min(100, Math.max(0, Math.round(((stock - min) / diff) * 100)))
    : (stock > 0 ? 100 : 0);

  const isOutOfStock = stock <= 0;
  const isLowStock = !isOutOfStock && stock <= (min || 3);

  return (
    <div className={`bg-white shadow-sm hover:shadow-md p-4 rounded-xl text-center transition-all flex flex-col justify-between h-full border ${
      isOutOfStock ? "border-red-200" : isLowStock ? "border-amber-200" : "border-gray-100"
    }`}>
      <div>
        {/* Cabecera: Categoría y Badge de Stock */}
        <div className="flex items-center justify-between gap-1 mb-2">
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 truncate max-w-[130px]">
            {categoria?.nombre_categoria || producto.categoria_nombre || "General"}
          </span>
          {isOutOfStock ? (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
              Agotado
            </span>
          ) : isLowStock ? (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
              Bajo Stock ({stock})
            </span>
          ) : (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
              Stock: {stock}
            </span>
          )}
        </div>

        {/* Nombre del Producto */}
        <h3
          className="font-bold text-gray-900 text-base mb-1 line-clamp-2 min-h-[44px] flex items-center justify-center break-words"
          title={producto.nombre_producto}
        >
          {producto.nombre_producto}
        </h3>

        {/* Imagen del Producto */}
        {producto.imagen_producto ? (
          <img
            src={producto.imagen_producto}
            alt={producto.nombre_producto}
            className="mx-auto my-2 rounded-lg object-cover"
            style={{ width: "90px", height: "90px" }}
          />
        ) : (
          <div
            className="mx-auto my-2 rounded-lg bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center text-gray-400 text-xs"
            style={{ width: "90px", height: "90px" }}
          >
            Sin imagen
          </div>
        )}

        {/* Precio y Estado */}
        <div className="my-2">
          <p className="text-xl font-black text-[#712b39]">
            ${parseFloat(producto.pvp_producto || 0).toFixed(2)}
          </p>
          <span className={`inline-block text-[11px] px-2 py-0.5 rounded-full font-medium mt-1 ${
            producto.estado_producto === "Inactivo"
              ? "bg-gray-100 text-gray-500"
              : "bg-emerald-50 text-emerald-700"
          }`}>
            {producto.estado_producto || "Activo"}
          </span>
        </div>

        {/* Barra de progreso de stock */}
        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-gray-100">
          <Package className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`absolute h-full rounded-full transition-all duration-300 ${
                isOutOfStock ? "bg-red-500" : isLowStock ? "bg-amber-500" : "bg-[#712b39]"
              }`}
              style={{ width: `${porcentajeStock}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-gray-700 min-w-[28px] text-right">
            {stock}
          </span>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-between items-center gap-2 mt-4 pt-3 border-t border-gray-100">
        <button
          type="button"
          onClick={() => onEdit(producto)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-gray-100 hover:bg-[#712b39] hover:text-white text-gray-700 text-xs font-semibold transition active:scale-95"
          title="Editar producto"
          aria-label={`Editar producto ${producto.nombre_producto}`}
        >
          <Pencil className="w-3.5 h-3.5" />
          <span>Editar</span>
        </button>
        <button
          type="button"
          onClick={() => onDelete(producto.id)}
          className="flex items-center justify-center p-2 rounded-lg bg-red-50 hover:bg-red-600 hover:text-white text-red-600 transition active:scale-95"
          title="Eliminar producto"
          aria-label={`Eliminar producto ${producto.nombre_producto}`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
