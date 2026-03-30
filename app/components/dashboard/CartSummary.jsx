/**
 * Componente que muestra el carrito de compras. Se muestra el nombre, cantidad y precio de cada producto,
 * y se puede eliminar cada producto. Al final, se muestra el descuento, el total de la venta y se puede finalizar la venta.
 *
 * @param {Object[]} cart - Arreglo de objetos que representan cada producto en el carrito.
 * @param {function} onRemove - Funcion que se llama cuando se elimina un producto del carrito.
 * @param {function} onFinalize - Funcion que se llama cuando se finaliza la venta.
 * @param {number} discount - Valor del descuento aplicado.
 * @param {function} setDiscount - Funcion para actualizar el descuento.
 * @param {number} total - Total de la venta después del descuento.
 */
export default function CartSummary({
  cart,
  onRemove,
  onFinalize,
  discount,
  onUpdateItem,
  total,
  canFinalize = true,
}) {


  return (
    <div
      className="w-1/4 md:w-1/5 lg:w-1/4 min-w-[200px] md:min-w-[220px] lg:min-w-[250px] bg-white p-3 lg:p-4 flex flex-col justify-between shadow-lg rounded-l-lg h-full"
    >
      <h2 className="text-lg lg:text-xl font-bold my-2">Carrito</h2>

      {/* Lista de productos */}
      <div className="flex-1 overflow-auto bg-gray-50 p-2 rounded-md shadow-inner">
        {cart.map((item, index) => (
          <div
            key={index}
            className="mb-2 p-2 lg:p-3 bg-gray-100 rounded-lg flex flex-col gap-2"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-sm leading-tight text-gray-800">
                  {item.nombre_producto}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Cant: {item.cantidad} | PVP: ${item.pvp_producto}
                </p>
              </div>
              <button
                onClick={() => onRemove(index)}
                className="text-red-500 font-bold ml-2 shrink-0 py-1 px-2 hover:bg-red-100 rounded-md transition-colors"
                title="Eliminar producto"
              >
                X
              </button>
            </div>

            <div className="flex flex-col bg-white p-2 rounded border border-gray-200 shadow-sm mt-1">
              <label className="text-xs text-gray-500 font-medium mb-1">Descuento ($):</label>
              <input
                type="number"
                min="0"
                placeholder="0.00"
                value={item.descuento || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  const maxDesc = item.pvp_producto * item.cantidad;
                  const numVal = Number(val);
                  if (numVal <= maxDesc) {
                    onUpdateItem(index, { descuento: numVal });
                  } else {
                    onUpdateItem(index, { descuento: maxDesc });
                  }
                }}
                onKeyPress={(e) => {
                  if (e.key === '-' || e.key === 'e' || e.key === 'E') e.preventDefault();
                }}
                className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 outline-none focus:ring-1 focus:ring-[#712b39] focus:border-[#712b39] text-sm font-bold text-[#712b39] transition-all"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Descuento y total */}
      <div className="mt-4">


        <h3 className="text-base lg:text-lg font-bold">
          Total: ${(total < 0 ? 0 : total).toFixed(2)}
        </h3>

        <button
          onClick={onFinalize}
          disabled={!canFinalize}
          className="mt-3 w-full bg-[#712b39] text-white py-2 rounded-lg hover:bg-[#5e242e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Finalizar venta
        </button>
      </div>
    </div>
  );
}
