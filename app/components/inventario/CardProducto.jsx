/**
 * Componente que muestra una tarjeta de un producto.
 *
 *? @param {{ id: number, nombre_producto: string, categoria_producto: number, pvp_producto: number, imagen_producto?: string, cantidad_producto: number, minimo_producto: number, maximo_producto: number, estado_producto: string }} producto - Información del producto.
 *? @param {Array} categorias - Listado de categorías.
 *? @param {function} onEdit - Función que se llama cuando se hace clic en el botón de editar. Recibe el producto como parámetro.
 *? @param {function} onDelete - Función que se llama cuando se hace clic en el botón de eliminar. Recibe el ID del producto como parámetro.
 *? @returns {ReactElement} Componente CardProducto.
 */
export default function CardProducto({
  producto,
  categorias,
  onEdit,
  onDelete,
}) {
  const categoria = categorias.find(
    (c) => c.id === producto.categoria_producto
  );

  const porcentajeStock = (
    ((producto.cantidad_producto - producto.minimo_producto) /
      (producto.maximo_producto - producto.minimo_producto)) *
    100
  ).toFixed(0);

  return (
    <div className="bg-white shadow-md p-4 rounded-lg text-center hover:shadow-lg transition-shadow flex flex-col h-full">
      <h3 className="font-bold text-gray-800 text-lg mb-1 break-words" title={producto.nombre_producto}>
        {producto.nombre_producto}
      </h3>
      <p className="text-sm">
        {categoria?.nombre_categoria || "Sin Categoría"}
      </p>
      <p className="text-lg">${producto.pvp_producto}</p>
      <p className="text-sm">Cantidad: {producto.cantidad_producto}</p>
      <p className="text-sm">Estado: {producto.estado_producto}</p>

      {producto.imagen_producto && (
        <img
          src={producto.imagen_producto}
          alt={producto.nombre_producto}
          className="mx-auto my-2 rounded-md"
          style={{ width: "90px", height: "90px", objectFit: "cover" }}
        />
      )}

      <div className="flex items-center gap-2 mt-2">
        <i className="fas fa-box text-gray-500"></i>
        <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="absolute h-full bg-[#712b39]"
            style={{ width: `${porcentajeStock}%` }}
          ></div>
        </div>
        <span className="text-sm">{producto.cantidad_producto}</span>
      </div>

      <div className="flex justify-between mt-4">
        <button
          onClick={() => onEdit(producto)}
          className="bg-gray-200 text-black rounded-full p-3 hover:bg-gray-300 transition"
        >
          <i className="fas fa-pen text-xl"></i>
        </button>
        <button
          onClick={() => onDelete(producto.id)}
          className="bg-gray-200 text-black rounded-full p-3 hover:bg-gray-300 transition"
        >
          <i className="fas fa-trash text-xl"></i>
        </button>
      </div>
    </div>
  );
}
