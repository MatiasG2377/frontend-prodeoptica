"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { LayoutDashboard, ShoppingBag } from "lucide-react";

import Header from "../components/common/Header";
import Sidebar from "../components/dashboard/Sidebar";
import ProductGrid from "../components/dashboard/ProductGrid";
import CartSummary from "../components/dashboard/CartSummary";
import ImageModal from "../components/dashboard/ImageModal";
import DashboardResumen from "../components/dashboard/DashboardResumen";
import ProtectedRoute from "../components/auth/ProtectedRoute";

import useDashboard from "../hooks/useDashboard";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { calculateTotal } from "../utils/cartHelpers";

export default function DashboardPage() {
  const router = useRouter();
  const { cart, addToCart, removeFromCart, updateCartItem } = useCart();
  const { logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDashboardTab, setActiveDashboardTab] = useState("resumen"); // "resumen" | "pos"

  // Detectar si el usuario navegó solicitando directamente el Punto de Venta (?tab=pos)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("tab") === "pos") {
        setActiveDashboardTab("pos");
      }
    }
  }, []);

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

    const hasInvalidDiscount = cart.some((item) => {
      const gross = item.pvp_producto * item.cantidad;
      return (Number(item.descuento) || 0) > gross;
    });

    if (hasInvalidDiscount) {
      Swal.fire({
        title: "Descuento inválido",
        text: "Uno de los descuentos aplicados supera el valor del producto.",
        icon: "error",
        confirmButtonColor: "#712b39",
      });
      return;
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.removeItem("discount");
    router.push("/venta");
  };

  const subtotal = Number(calculateTotal(cart));
  const total = subtotal;
  const canFinalize = cart.every(
    (item) => (Number(item.descuento) || 0) <= item.pvp_producto * item.cantidad
  );

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen">
        <Header
          title={activeDashboardTab === "resumen" ? "Dashboard Principal" : "Punto de Venta"}
          search={activeDashboardTab === "pos" ? search : undefined}
          setSearch={activeDashboardTab === "pos" ? setSearch : undefined}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          handleLogout={logout}
        />

        {/* SELECTOR DE VISTAS (DASHBOARD RESUMEN vs PUNTO DE VENTA) */}
        <div className="bg-white border-b border-gray-200 px-4 py-2.5 flex items-center justify-between shrink-0 shadow-2xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveDashboardTab("resumen")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition active:scale-95 ${
                activeDashboardTab === "resumen"
                  ? "bg-[#712b39] text-white shadow-xs"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Resumen y Estadísticas</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveDashboardTab("pos")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition active:scale-95 relative ${
                activeDashboardTab === "pos"
                  ? "bg-[#712b39] text-white shadow-xs"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Catálogo & Punto de Venta</span>
              {cart.length > 0 && (
                <span className="ml-1 px-2 py-0.5 rounded-full text-[11px] font-black bg-amber-400 text-gray-900 shadow-xs">
                  {cart.length}
                </span>
              )}
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs text-gray-400">
            <span>Prodeóptica Admin v2.0</span>
          </div>
        </div>

        {/* CONTENIDO PRINCIPAL SEGÚN LA PESTAÑA ACTIVA */}
        {activeDashboardTab === "resumen" ? (
          <div className="flex-1 bg-gray-100 overflow-y-auto">
            <div className="max-w-7xl mx-auto py-2">
              <DashboardResumen onGoToPOS={() => setActiveDashboardTab("pos")} />
            </div>
          </div>
        ) : (
          <div className="flex flex-1 overflow-hidden">
            <Sidebar
              categorias={categorias}
              selectedCategoria={selectedCategoria}
              setSelectedCategoria={setSelectedCategoria}
            />

            <div className="flex-1 bg-gray-100 overflow-y-auto p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl sm:text-2xl font-bold text-[#712b39]">
                  Catálogo de Productos
                </h2>
                {selectedCategoria && (
                  <button
                    onClick={() => setSelectedCategoria(null)}
                    className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-full transition"
                  >
                    Limpiar filtro de categoría ✕
                  </button>
                )}
              </div>

              {/* Selector de categorías en mobile / tablet */}
              {Array.isArray(categorias) && categorias.length > 0 && (
                <div className="flex md:hidden items-center gap-2 overflow-x-auto pb-3 mb-2">
                  <button
                    type="button"
                    onClick={() => setSelectedCategoria(null)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-xs ${
                      selectedCategoria === null
                        ? "bg-[#712b39] text-white shadow"
                        : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                    }`}
                  >
                    Todas
                  </button>
                  {categorias.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategoria(cat.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-xs ${
                        selectedCategoria === cat.id
                          ? "bg-[#712b39] text-white shadow"
                          : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                      }`}
                    >
                      {cat.nombre_categoria}
                    </button>
                  ))}
                </div>
              )}

              <ProductGrid
                productos={productos}
                loading={loading}
                onAddToCart={addToCart}
                onImageClick={setModalImage}
              />
            </div>

            <CartSummary
              cart={cart}
              onRemove={removeFromCart}
              onUpdateItem={updateCartItem}
              onFinalize={handleFinalizeSale}
              total={total}
              canFinalize={canFinalize}
            />
          </div>
        )}

        {modalImage && (
          <ImageModal image={modalImage} onClose={() => setModalImage(null)} />
        )}
      </div>
    </ProtectedRoute>
  );
}
