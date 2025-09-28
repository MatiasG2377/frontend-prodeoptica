"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

import Header from "../components/common/Header";
import Sidebar from "../components/dashboard/Sidebar";
import ProductGrid from "../components/dashboard/ProductGrid";
import CartSummary from "../components/dashboard/CartSummary";
import ImageModal from "../components/dashboard/ImageModal";
import ProtectedRoute from "../components/auth/ProtectedRoute";

import useDashboard from "../hooks/useDashboard";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { calculateTotal } from "../utils/cartHelpers";

export default function DashboardPage() {
  const router = useRouter();
  const { cart, addToCart, removeFromCart } = useCart();
  const { logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [discount, setDiscount] = useState(0); // ✅ Nuevo estado

  const {
    categorias,
    selectedCategoria,
    setSelectedCategoria,
    search,
    setSearch,
    loading,
    productos,
    modalImage,
    setModalImage,
  } = useDashboard();

  const handleFinalizeSale = () => {
    if (cart.length === 0) {
      Swal.fire({
        title: "Carrito vacío",
        text: "Agrega al menos un producto antes de finalizar la venta.",
        icon: "warning",
        confirmButtonColor: "#712b39",
      });
      return;
    }

    // Bloquear si el descuento supera el subtotal
    if ((Number(discount) || 0) > subtotal) {
      Swal.fire({
        title: "Descuento inválido",
        text: "El descuento no puede ser mayor al valor total de la compra.",
        icon: "error",
        confirmButtonColor: "#712b39",
      });
      return;
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("discount", appliedDiscount); // ✅ guardar descuento limitado al subtotal
    router.push("/venta");
  };

  const subtotal = calculateTotal(cart);
  const appliedDiscount = Math.min(Number(discount) || 0, subtotal); // ✅ No permitir descuento mayor al subtotal
  const total = subtotal - appliedDiscount; // ✅ Aplicar descuento limitado
  const canFinalize = (Number(discount) || 0) <= subtotal; // ✅ Habilitar botón solo si el descuento es válido

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen">
        <Header
          title="Ventas"
          search={search}
          setSearch={setSearch}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          handleLogout={logout}
        />

        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            categorias={categorias}
            selectedCategoria={selectedCategoria}
            setSelectedCategoria={setSelectedCategoria}
          />

          <div className="flex-1 bg-gray-100 overflow-y-auto p-4">
            <h2 className="text-2xl font-bold mb-2 text-[#712b39]">
              Productos
            </h2>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#712b39]" />
              </div>
            ) : (
              <ProductGrid
                productos={productos}
                onAddToCart={addToCart}
                onImageClick={setModalImage}
              />
            )}
          </div>

          <CartSummary
            cart={cart}
            onRemove={removeFromCart}
            onFinalize={handleFinalizeSale}
            total={total}
            // ✅ Pasamos el descuento y su setter al componente
            discount={discount}
            setDiscount={setDiscount}
            canFinalize={canFinalize}
          />
        </div>

        {modalImage && (
          <ImageModal image={modalImage} onClose={() => setModalImage(null)} />
        )}
      </div>
    </ProtectedRoute>
  );
}
