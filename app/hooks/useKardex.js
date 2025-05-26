"use client";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

/**
 * Hook que maneja la l gica para mostrar el listado de productos y sus movimientos en el Kardex.
 *
 *? @returns {Object} Un objeto con los siguientes atributos:
 *   - productos: un array con todos los productos.
 *   - filteredProductos: un array con los productos filtrados por el t rmino de b squeda.
 *   - searchTerm: el t rmino de b squeda actual.
 *   - kardexMovimientos: un array con los movimientos del Kardex del producto seleccionado.
 *   - isLoading: un booleano que indica si se est  cargando los productos o los movimientos del Kardex.
 *   - handleSearch: una funci n que se encarga de filtrar los productos por el t rmino de b squeda.
 *   - handleSelectProducto: una funci n que se encarga de cargar los movimientos del Kardex del producto seleccionado.
 */
export default function useKardex() {
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

    /**
     * Fetches the list of products from the API and updates the state.
     *
     * Hace una petición GET a la ruta `/api/producto/` de la API y establece
     * el estado `productos` y `filteredProductos` con los datos de la respuesta.
     *
     * Si ocurre un error al cargar los productos, muestra un mensaje de error en
     * una alerta de SweetAlert2.
     */
    const fetchProductos = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/productos/");
        if (!response.ok) throw new Error("Error al cargar los productos");
        const data = await response.json();
        const productosData = Array.isArray(data) ? data : data.results || [];
        setProductos(productosData);
        setFilteredProductos(productosData);
      } catch (error) {
        console.error(error);
        Swal.fire(
          "Error",
          "No se pudo cargar el listado de productos.",
          "error"
        );
      }
    };

    fetchProductos();
  }, []);

  /**
   * Filtra los productos por el t rmino de b squeda.
   *
   *? @param {string} term - El t rmino de b squeda.
   *
   * Busca en el array `productos` los productos cuyo nombre contiene el término de
   * búsqueda y establece el estado `filteredProductos` con los resultados de la
   * búsqueda.
   */
  const handleSearch = (term) => {
    const value = term.toLowerCase();
    setSearchTerm(value);

    // Protección adicional: si productos no es un array, detenemos
    if (!Array.isArray(productos)) {
      console.error("productos no es un array:", productos);
      setFilteredProductos([]); // o puedes mostrar un error
      return;
    }

    const filtered = productos.filter((p) =>
      p.nombre_producto.toLowerCase().includes(value)
    );
    setFilteredProductos(filtered);
  };

  /**
   * Maneja la selección de un producto y carga sus movimientos en el Kardex.
   *
   * Esta función realiza una solicitud a la API para obtener los movimientos
   * del Kardex para un producto específico. Si no hay movimientos registrados
   * para el producto, se muestra un mensaje de información. En caso de un error
   * de red o en la API, se muestra un mensaje de error.
   *
   *? @param {number} productoId - El ID del producto para el cual se desea
   * obtener los movimientos del Kardex.
   */

  const handleSelectProducto = async (productoId) => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/kardex/historial/${productoId}/`
      );
      if (res.status === 404 || !res.ok) {
        Swal.fire({
          icon: "info",
          title: "Información",
          text: "No hay movimientos registrados para este producto.",
          confirmButtonColor: "#712b39",
        });
        setKardexMovimientos([]);
        return;
      }
      const data = await res.json();
      if (!data.length) {
        Swal.fire({
          icon: "info",
          title: "Información",
          text: "No hay movimientos registrados para este producto.",
          confirmButtonColor: "#712b39",
        });
        setKardexMovimientos([]);
        return;
      }
      setKardexMovimientos(data);
      Swal.fire({
        icon: "success",
        title: "Éxito",
        text: "Movimientos del Kardex cargados correctamente.",
        confirmButtonColor: "#712b39",
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cargar los movimientos del Kardex.",
        confirmButtonColor: "#712b39",
      });
      setKardexMovimientos([]);
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
