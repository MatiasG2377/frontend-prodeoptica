import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

import {
  fetchProductos,
  fetchKardexByProducto,
} from "../services/kardexService";

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Custom hook to manage the state and logic for the Kardex page.
 *
 * This hook provides functionalities to:
 * - Fetch and filter a list of products.
 * - Handle the search for products by name.
 * - Select a product to view its Kardex movements.
 * - Manage loading states and display alerts for user feedback.
 *
 * The hook ensures that the user is authenticated by checking for an access token
 * and redirects to the login page if not present.
 *
 * @returns {Object} An object containing:
 *   - productos: Array of all products.
 *   - filteredProductos: Array of products filtered by the search term.
 *   - searchTerm: The current search term.
 *   - kardexMovimientos: Array of movements for the selected product.
 *   - isLoading: Boolean indicating if data is currently being loaded.
 *   - handleSearch: Function to search products by name.
 *   - handleSelectProducto: Function to select a product and fetch its Kardex movements.
 */

/*******  c9cd2964-056e-4db3-be97-295486afef2f  *******/ export default function useKardex() {
  const router = useRouter();
  const [productos, setProductos] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [kardexMovimientos, setKardexMovimientos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetchProductos()
      .then((data) => {
        setProductos(data);
        setFilteredProductos(data);
      })
      .catch(() =>
        Swal.fire(
          "Error",
          "No se pudo cargar el listado de productos.",
          "error"
        )
      );
  }, []);

  const handleSearch = (term) => {
    const value = term.toLowerCase();
    setSearchTerm(value);
    if (!Array.isArray(productos)) return setFilteredProductos([]);
    const filtered = productos.filter((p) =>
      p.nombre_producto.toLowerCase().includes(value)
    );
    setFilteredProductos(filtered);
  };

  const handleSelectProducto = async (productoId) => {
    setIsLoading(true);
    try {
      const data = await fetchKardexByProducto(productoId);
      if (!data.length) throw new Error("No hay movimientos");
      setKardexMovimientos(data);
      Swal.fire({
        icon: "success",
        title: "Éxito",
        text: "Movimientos del Kardex cargados correctamente.",
        confirmButtonColor: "#712b39", // color del botón OK
      });
    } catch {
      setKardexMovimientos([]);
      Swal.fire(
        "Información",
        "No hay movimientos registrados para este producto.",
        "info"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    productos,
    filteredProductos,
    searchTerm,
    kardexMovimientos,
    isLoading,
    handleSearch,
    handleSelectProducto,
  };
}
