import { useEffect, useState } from "react";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function useDashboard() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalImage, setModalImage] = useState(null);

  // Cargar categorías
  useEffect(() => {
    fetch(`${BASE_URL}/categorias/`)
      .then((res) => res.json())
      .then(setCategorias)
      .catch((err) => console.error("Error al cargar categorías:", err));
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
        setProductos(Array.isArray(data) ? data : data.results);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error al obtener productos:", error);
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
