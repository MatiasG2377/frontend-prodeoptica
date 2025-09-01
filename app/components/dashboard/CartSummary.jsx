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
  setDiscount,
  total,
}) {
  const handleDiscountChange = (e) => {
    const value = e.target.value;
    // ✅ permitimos vacío, pero guardamos 0 si está vacío
    if (value === "") {
      setDiscount("");
    } else {
      setDiscount(Number(value));
    }
  };

  return (
    <div
      className="w-1/4 bg-white p-4 flex flex-col justify-between shadow-lg rounded-l-lg h-full"
      style={{ minWidth: "250px" }}
    >
      <h2 className="text-xl font-bold my-2">Carrito</h2>

      {/* Lista de productos */}
      <div className="flex-1 overflow-auto bg-gray-50 p-2 rounded-md shadow-inner">
        {cart.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center mb-2 p-2 bg-gray-100 rounded-lg"
          >
            <div>
              <p className="font-bold">
                {item.nombre_producto} (x{item.cantidad})
              </p>
              <p className="text-sm text-gray-600">${item.pvp_producto}</p>
            </div>
            <button
              onClick={() => onRemove(index)}
              className="text-red-500 font-bold"
            >
              X
            </button>
          </div>
        ))}
      </div>

      {/* Descuento y total */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Valor del descuento:
        </label>
        <input
          type="number"
          value={discount}
          onChange={handleDiscountChange}
          placeholder="0"
          className="w-full border rounded p-2 mb-3"
        />

        <h3 className="text-lg font-bold">
          Total: ${(total < 0 ? 0 : total).toFixed(2)}
        </h3>

        <button
          onClick={onFinalize}
          className="mt-3 w-full bg-[#712b39] text-white py-2 rounded-lg hover:bg-[#5e242e] transition-colors"
        >
          Finalizar venta
        </button>
      </div>
    </div>
  );
}
