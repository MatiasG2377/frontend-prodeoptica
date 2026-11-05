import ProductCard from "./ProductCard";
import { CardSkeleton } from "../common/Skeleton";
import { PackageOpen } from "lucide-react";

export default function ProductGrid({ productos = [], onAddToCart, onImageClick, loading = false }) {
  if (loading) {
    return <CardSkeleton count={8} />;
  }

  if (productos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-2xl shadow-sm border border-gray-100 my-4">
        <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-3 text-gray-400">
          <PackageOpen className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-1">No se encontraron productos</h3>
        <p className="text-sm text-gray-500 max-w-sm">
          Intenta ajustar los términos de búsqueda o selecciona otra categoría en el menú lateral.
        </p>
      </div>
    );
  }

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
