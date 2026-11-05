/**
 * Componente que muestra una tarjeta de producto optimizada para punto de venta.
 */
export default function ProductCard({ producto, onAddToCart, onImageClick }) {
  const stock = Number(producto.cantidad_producto) || 0;
  const minimo = Number(producto.minimo_producto) || 0;
  const isOutOfStock = stock <= 0;
  const isLowStock = !isOutOfStock && stock <= (minimo || 3);

  return (
    <div className={`bg-white shadow rounded-xl p-3 text-center transition-all duration-200 hover:shadow-lg flex flex-col justify-between border ${
      isOutOfStock ? 'border-red-200 opacity-75' : isLowStock ? 'border-amber-200' : 'border-gray-100'
    }`}>
      <div>
        <div className="flex items-center justify-between gap-1 mb-2">
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 truncate max-w-[140px]">
            {producto.categoria_nombre || producto.categoria_producto_nombre || "General"}
          </span>
          {isOutOfStock ? (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
              Agotado
            </span>
          ) : isLowStock ? (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
              Bajo Stock ({stock})
            </span>
          ) : (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
              Stock: {stock}
            </span>
          )}
        </div>

        <div className="h-12 flex items-center justify-center mb-1">
          <h3 className="font-semibold text-gray-800 text-sm break-words line-clamp-2 px-1">
            {producto.nombre_producto}
          </h3>
        </div>

        {producto.imagen_producto ? (
          <img
            src={producto.imagen_producto}
            alt={producto.nombre_producto}
            className="mx-auto my-2 rounded-lg cursor-pointer hover:scale-105 transition-transform"
            style={{ width: "95px", height: "95px", objectFit: "cover" }}
            onClick={() => onImageClick(producto.imagen_producto)}
          />
        ) : (
          <div className="mx-auto my-2 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 text-xs" style={{ width: "95px", height: "95px" }}>
            Sin imagen
          </div>
        )}

        <div className="my-1">
          <p className="text-xl font-bold text-[#712b39]">${parseFloat(producto.pvp_producto || 0).toFixed(2)}</p>
          {producto.marca_producto && (
            <p className="text-xs text-gray-500 font-medium">{producto.marca_producto}</p>
          )}
        </div>
      </div>

      <button
        onClick={() => !isOutOfStock && onAddToCart(producto)}
        disabled={isOutOfStock}
        className={`mt-2 w-full py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
          isOutOfStock
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-[#712b39] text-white hover:bg-[#5e242e] active:scale-95 shadow-sm'
        }`}
      >
        {isOutOfStock ? 'No disponible' : 'Agregar al carrito'}
      </button>
    </div>
  );
}
