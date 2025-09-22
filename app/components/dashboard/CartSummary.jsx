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
    // Si el valor está vacío, lo guardamos como string vacío
    if (value === "") {
      setDiscount("");
    } else if (value === "0") {
      // Permitir solo 0
      setDiscount(0);
    } else {
      // Convertir a número y verificar que sea positivo
      const numValue = Number(value);
      if (!isNaN(numValue) && numValue > 0) {
        setDiscount(numValue);
      }
    }
  };

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
            className="flex justify-between items-center mb-2 p-2 lg:p-3 bg-gray-100 rounded-lg"
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
          Descuento:
        </label>
        <input
          type="number"
          value={discount}
          onChange={handleDiscountChange}
          onKeyPress={(e) => {
            // Prevenir la entrada del signo negativo
            if (e.key === '-' || e.key === 'e' || e.key === 'E') {
              e.preventDefault();
            }
          }}
          min="0"
          placeholder="0"
          className="w-full border rounded p-2 lg:p-3 mb-3"
        />

        <h3 className="text-base lg:text-lg font-bold">
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
