"use client";
import { useEffect, useState, useMemo } from "react";
import Swal from "sweetalert2";
import { parseApiResponse, getErrorMessage } from "../utils/apiError";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const getAuthHeaders = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export default function useDashboard() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalImage, setModalImage] = useState(null);

  // Normalizar la URL de la imagen y campos
  const normalizarProducto = (producto) => {
    let url = producto.imagen_url || producto.imagen_producto || producto.imagen || null;

    if (url && url.startsWith("/media")) {
      url = `${BASE_URL.replace("/api", "")}${url}`;
    }

    return {
      ...producto,
      imagen_producto: url,
    };
  };

  // Cargar categorías al montar
  useEffect(() => {
    let isMounted = true;
    fetch(`${BASE_URL}/categorias/`, { headers: getAuthHeaders() })
      .then((res) => parseApiResponse(res))
      .then((data) => {
        if (isMounted) {
          const list = Array.isArray(data) ? data : data.results || [];
          setCategorias(list);
        }
      })
      .catch((err) => {
        if (err?.status === 401 || err?.status === 403) return;
        console.warn("No se pudieron cargar categorías iniciales:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: getErrorMessage(err),
          confirmButtonColor: "#7d2a3f",
        });
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Cargar productos con debounce de 300ms
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchProductos = async () => {
      setLoading(true);
      try {
        let url = "";

        if (search.trim()) {
          url = `${BASE_URL}/productos/buscar/?q=${encodeURIComponent(search.trim())}`;
        } else if (selectedCategoria) {
          url = `${BASE_URL}/productos/filtrar_por_categoria/?categoria=${selectedCategoria}`;
        } else {
          url = `${BASE_URL}/productos/disponibles/`;
        }

        const res = await fetch(url, { headers: getAuthHeaders(), signal });
        const data = await parseApiResponse(res);
        const rawProductos = Array.isArray(data) ? data : data.results || [];
        const productosNormalizados = rawProductos.map(normalizarProducto);

        setProductos(productosNormalizados);
      } catch (error) {
        if (error.name === "AbortError") {
          // petición cancelada por debounce, no es un error real
        } else if (error?.status === 401 || error?.status === 403) {
          // sesión expirada, el interceptor global ya redirige
        } else {
          console.error("Error al obtener productos:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: getErrorMessage(error),
            confirmButtonColor: "#7d2a3f",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(fetchProductos, 300);
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [search, selectedCategoria]);

  const filteredProductos = useMemo(() => {
    return productos.filter(
      (p) => !p.controla_stock || Number(p.cantidad_producto) > 0
    );
  }, [productos]);

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
