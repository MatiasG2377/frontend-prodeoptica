"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

import Header from "../components/common/Header";
import Sidebar from "../components/dashboard/Sidebar";
import ProductCard from "../components/dashboard/ProductCard";
import CartSummary from "../components/dashboard/CartSummary";
import ImageModal from "../components/dashboard/ImageModal";

import { useCart } from "../hooks/useCart";
import { calculateTotal } from "../utils/cartHelpers";
import { useAuth } from "../hooks/useAuth";
import ProtectedRoute from "../components/auth/ProtectedRoute";
export default function DashboardPage() {
  const router = useRouter();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const { cart, addToCart, removeFromCart } = useCart();
  const { logout } = useAuth();

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/categorias/");
        if (res.ok) {
          const data = await res.json();
          setCategorias(data);
        } else {
          alert("Error al cargar las categorías.");
        }
      } catch (error) {
        console.error("Error al obtener las categorías:", error);
      }
    };

    fetchCategorias();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchProductos = async () => {
      try {
        setLoading(true); // <- comienza carga

        let url = "";
        if (search.trim() !== "") {
          url = `http://127.0.0.1:8000/api/productos/buscar/?q=${search}`;
        } else if (selectedCategoria) {
          url = `http://127.0.0.1:8000/api/productos/filtrar_por_categoria/?categoria=${selectedCategoria}`;
        } else {
          // Aquí usamos el nuevo endpoint que incluye los que no controlan stock
          url = "http://127.0.0.1:8000/api/productos/disponibles/";
        }

        const res = await fetch(url, { signal });

        if (res.ok) {
          const data = await res.json();
          const productosData = Array.isArray(data) ? data : data.results;
          setProductos(productosData);
        } else {
          alert("Error al cargar los productos");
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error al obtener los productos:", error);
          alert("Hubo un problema al cargar los productos.");
        }
      } finally {
        setLoading(false); // <- termina carga
      }
    };

    const debounceTimeout = setTimeout(fetchProductos, 400);

    return () => {
      clearTimeout(debounceTimeout);
      controller.abort();
    };
  }, [search, selectedCategoria]);

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

    localStorage.setItem("cart", JSON.stringify(cart));
    router.push("/venta");
  };
  const filteredProductos = productos.filter(
    (producto) =>
      !producto.controla_stock || Number(producto.cantidad_producto) > 0
  );

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
                <div className="flex flex-col items-center gap-2">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#712b39] border-opacity-75"></div>
                  <p className="text-[#712b39] text-sm">
                    Cargando productos...
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProductos.map((producto) => (
                  <ProductCard
                    key={producto.id}
                    producto={producto}
                    onAddToCart={addToCart}
                    onImageClick={setModalImage}
                  />
                ))}
              </div>
            )}
          </div>

          <CartSummary
            cart={cart}
            onRemove={removeFromCart}
            onFinalize={handleFinalizeSale}
            total={calculateTotal(cart)}
          />
        </div>

        {modalImage && (
          <ImageModal image={modalImage} onClose={() => setModalImage(null)} />
        )}
      </div>
    </ProtectedRoute>
  );
}
