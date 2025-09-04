/**
 * Componente que muestra una tarjeta de un producto.
 *
 *? @param {{ nombre_producto: string, categoria_nombre: string, pvp_producto: number, imagen_producto?: string }} producto - Información del producto.
 *? @param {function} onAddToCart - Función que se llama cuando se agrega el producto al carrito. Recibe el producto como parámetro.
 *? @param {function} onImageClick - Función que se llama cuando se hace clic en la imagen del producto. Recibe la URL de la imagen como parámetro.
 */
export default function ProductCard({ producto, onAddToCart, onImageClick }) {
  return (
    <div className="bg-white shadow-md p-3 rounded-lg text-center hover:shadow-lg transition-shadow w-full max-w-xs mx-auto flex flex-col">
      <div className="h-12 flex items-center justify-center">
        <h3 className="font-bold break-words line-clamp-2 px-1">
          {producto.nombre_producto}
        </h3>
      </div>
      <p className="text-sm">{producto.categoria_nombre || "Sin Categoría"}</p>
      <p className="text-lg">${producto.pvp_producto}</p>
      {producto.imagen_producto && (
        <img
          src={producto.imagen_producto}
          alt={producto.nombre_producto}
          className="mx-auto my-2 rounded-md cursor-pointer"
          style={{ width: "90px", height: "90px", objectFit: "cover" }}
          onClick={() => onImageClick(producto.imagen_producto)}
        />
      )}

      <button
        onClick={() => onAddToCart(producto)}
        className="mt-1 bg-[#712b39] text-white py-1 px-3 rounded-lg hover:bg-[#5e242e] transition-colors"
      >
        Agregar
      </button>
    </div>
  );
}
