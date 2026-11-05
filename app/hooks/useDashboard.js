"use client";
import { useEffect, useState, useMemo } from "react";
import Swal from "sweetalert2";

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
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar categorías");
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          const list = Array.isArray(data) ? data : data.results || [];
          setCategorias(list);
        }
      })
      .catch((err) => {
        console.warn("No se pudieron cargar categorías iniciales:", err);
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
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            return;
          }
          throw new Error(`Error ${res.status}: al cargar productos`);
        }

        const data = await res.json();
        const rawProductos = Array.isArray(data) ? data : data.results || [];
        const productosNormalizados = rawProductos.map(normalizarProducto);

        setProductos(productosNormalizados);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error al obtener productos:", error);
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
