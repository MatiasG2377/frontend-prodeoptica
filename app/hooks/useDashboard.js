"use client";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function useDashboard() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalImage, setModalImage] = useState(null);

  // Función para normalizar la URL de la imagen
  const normalizarProducto = (producto) => {
    let url = producto.imagen_url || producto.imagen || null;

    // Si es relativa, agregamos el backend
    if (url && url.startsWith("/media")) {
      url = `${BASE_URL.replace("/api", "")}${url}`;
    }

    return {
      ...producto,
      imagen_producto: url,
    };
  };

  // Cargar categorías
  useEffect(() => {
    fetch(`${BASE_URL}/categorias/`)
      .then((res) => res.json())
      .then(setCategorias)
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un problema al cargar las categorías.",
          confirmButtonColor: "#7d2a3f",
        });
      });
  }, []);

  // Cargar productos
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchProductos = async () => {
      setLoading(true);
      try {
        let url = "";

        if (search.trim()) {
          url = `${BASE_URL}/productos/buscar/?q=${search}`;
        } else if (selectedCategoria) {
          url = `${BASE_URL}/productos/filtrar_por_categoria/?categoria=${selectedCategoria}`;
        } else {
          url = `${BASE_URL}/productos/disponibles/`;
        }

        const res = await fetch(url, { signal });
        const data = await res.json();

        const rawProductos = Array.isArray(data) ? data : data.results;
        const productosNormalizados = rawProductos.map(normalizarProducto);

        setProductos(productosNormalizados);
      } catch (error) {
        if (error.name !== "AbortError") {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un problema al obtener los productos.",
            confirmButtonColor: "#7d2a3f",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(fetchProductos, 400);
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [search, selectedCategoria]);

  // Filtrar productos que controlan stock
  const filteredProductos = productos.filter(
    (p) => !p.controla_stock || Number(p.cantidad_producto) > 0
  );

  return {
    categorias,
    selectedCategoria,
    setSelectedCategoria,
    search,
    setSearch,
    loading,
    productos: filteredProductos,
    modalImage,
    setModalImage,
  };
}
