import React from "react";
import { Plus, Minus, Trash2, ShoppingBag } from "lucide-react";

/**
 * Componente de Carrito lateral reactivo para punto de venta.
 */
export default function CartSummary({
  cart = [],
  onRemove,
  onFinalize,
  onUpdateItem,
  total = 0,
  canFinalize = true,
}) {
  const handleQuantityChange = (index, delta) => {
    const item = cart[index];
    const newQty = (item.cantidad || 1) + delta;
    if (newQty <= 0) {
      onRemove(index);
      return;
    }
    const maxDesc = item.pvp_producto * newQty;
    const currentDesc = Number(item.descuento) || 0;
    onUpdateItem(index, {
      cantidad: newQty,
      descuento: Math.min(currentDesc, maxDesc),
    });
  };

  return (
    <div className="w-1/4 md:w-1/4 lg:w-1/4 min-w-[260px] max-w-[340px] bg-white p-3 lg:p-4 flex flex-col justify-between shadow-xl border-l border-gray-200 h-full">
      <div className="flex items-center justify-between mb-3 border-b pb-2">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-[#712b39]" />
          <h2 className="text-lg font-bold text-gray-800">Carrito de Venta</h2>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
          {cart.reduce((acc, it) => acc + (it.cantidad || 1), 0)} items
        </span>
      </div>

      {/* Lista de productos */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 text-gray-400">
            <ShoppingBag className="w-10 h-10 mb-2 opacity-30" />
            <p className="text-sm font-medium">El carrito está vacío</p>
            <p className="text-xs text-gray-400 mt-1">
              Haz clic en "Agregar al carrito" en cualquier producto.
            </p>
          </div>
        ) : (
          cart.map((item, index) => {
            const gross = (Number(item.pvp_producto) || 0) * (Number(item.cantidad) || 1);
            const desc = Number(item.descuento) || 0;
            const sub = Math.max(0, gross - desc);

            return (
              <div
                key={index}
                className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex flex-col gap-2 transition hover:bg-gray-100"
              >
                <div className="flex justify-between items-start gap-1">
                  <div className="flex-1">
                    <p className="font-semibold text-xs leading-snug text-gray-800 line-clamp-2">
                      {item.nombre_producto}
                    </p>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      PVP: ${parseFloat(item.pvp_producto).toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => onRemove(index)}
                    className="text-red-400 hover:text-red-600 p-1 hover:bg-red-50 rounded-md transition"
                    title="Eliminar producto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Controles de cantidad y subtotal */}
                <div className="flex items-center justify-between pt-1 border-t border-gray-200">
                  <div className="flex items-center gap-1.5 bg-white border border-gray-300 rounded-lg p-0.5">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(index, -1)}
                      className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 text-gray-700 active:scale-90"
                      title="Disminuir cantidad"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center text-xs font-bold text-gray-800">
                      {item.cantidad}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(index, 1)}
                      className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 text-gray-700 active:scale-90"
                      title="Aumentar cantidad"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="text-xs font-bold text-gray-900">
                    ${sub.toFixed(2)}
                  </span>
                </div>

                {/* Descuento por ítem */}
                <div className="flex items-center gap-2 bg-white px-2 py-1 rounded border border-gray-200 text-xs">
                  <span className="text-[11px] text-gray-500 font-medium">Desc. ($):</span>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    placeholder="0.00"
                    value={item.descuento || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      const maxDesc = item.pvp_producto * item.cantidad;
                      const numVal = Number(val);
                      if (numVal <= maxDesc) {
                        onUpdateItem(index, { descuento: Math.max(0, numVal) });
                      } else {
                        onUpdateItem(index, { descuento: maxDesc });
                      }
                    }}
                    onKeyPress={(e) => {
                      if (e.key === "-" || e.key === "e" || e.key === "E") e.preventDefault();
                    }}
                    className="w-full bg-transparent text-right font-semibold text-[#712b39] outline-none"
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pie con totales y botón */}
      <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>Subtotal artículos:</span>
          <span className="font-semibold text-gray-800">
            ${cart.reduce((acc, it) => acc + (Number(it.pvp_producto) || 0) * (Number(it.cantidad) || 1), 0).toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between items-center text-base font-bold text-gray-900 border-t pt-1">
          <span>Total a Pagar:</span>
          <span className="text-xl text-[#712b39]">
            ${(total < 0 ? 0 : total).toFixed(2)}
          </span>
        </div>

        <button
          onClick={onFinalize}
          disabled={!canFinalize || cart.length === 0}
          className="mt-2 w-full py-2.5 px-4 bg-[#712b39] text-white rounded-xl font-bold shadow hover:bg-[#5e242e] active:scale-98 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Finalizar Venta →
        </button>
      </div>
    </div>
  );
}
