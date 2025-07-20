import ProductCard from "./ProductCard";

export default function ProductGrid({ productos, onAddToCart, onImageClick }) {
  if (productos.length === 0)
    return (
      <p className="text-gray-500 text-center">No hay productos disponibles.</p>
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {productos.map((producto) => (
        <ProductCard
          key={producto.id}
          producto={producto}
          onAddToCart={onAddToCart}
          onImageClick={onImageClick}
        />
      ))}
    </div>
  );
}
