import { calculateCartTotal } from "../../utils/ventaHelpers";

export default function CartResumenVenta({
  cart,
  discount = 0, // ✅ nuevo prop, viene desde VentaPage
  isSubmitting,
  handleSubmit,
  handleCancel,
}) {
  const grossSubtotal = cart.reduce((acc, item) => acc + (item.pvp_producto * (item.cantidad || 1)), 0);
  const totalDiscount = cart.reduce((acc, item) => acc + (Number(item.descuento) || 0), 0);
  const total = grossSubtotal - totalDiscount;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Productos Seleccionados</h2>

      {/* Lista de productos */}
      <ul className="divide-y divide-gray-200">
        {cart.map((item, index) => (
          <li key={index} className="py-2 flex justify-between items-center">
            <span className="font-bold">
              {item.nombre_producto} (x{item.cantidad || 1})
            </span>
            <div className="text-right">
              <span>
                ${(item.pvp_producto * (item.cantidad || 1)).toFixed(2)}
              </span>
              {(Number(item.descuento) || 0) > 0 && (
                <div className="text-xs text-red-500">
                  Desc: -${Number(item.descuento).toFixed(2)}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>

      {/* Subtotal, descuento y total */}
      <div className="mt-4 text-right">
        <h3 className="text-lg font-semibold">
          Subtotal: ${grossSubtotal.toFixed(2)}
        </h3>
        <h3 className="text-lg font-semibold text-red-600">
          Descuento Total: -${totalDiscount.toFixed(2)}
        </h3>
        <h3 className="text-xl font-bold mt-2">
          Total: ${(total < 0 ? 0 : total).toFixed(2)}
        </h3>

        {/* Botones */}
        <button
          id="submitButton"
          onClick={handleSubmit}
          className={`mt-4 bg-[#712b39] text-white py-2 px-4 rounded-lg hover:bg-[#5e242e] transition-colors ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Registrando..." : "Registrar Venta"}
        </button>

        <button
          onClick={handleCancel}
          className="mt-2 ml-4 bg-gray-300 text-black py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
