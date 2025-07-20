// services/productoService.js
const BASE_URL = "http://127.0.0.1:8000/api";

export const fetchProductos = async () => {
  const res = await fetch(`${BASE_URL}/productos/`);
  const data = await res.json();
  return data.results || data;
};

export const fetchProductosBuscados = async (query) => {
  const res = await fetch(
    `${BASE_URL}/productos/buscar/?q=${encodeURIComponent(query)}`
  );
  const data = await res.json();
  return Array.isArray(data) ? data : data.results || [];
};

export const fetchCategorias = async () => {
  const res = await fetch(`${BASE_URL}/categorias/`);
  const data = await res.json();
  return data.results || data;
};

export const fetchProveedores = async () => {
  const res = await fetch(`${BASE_URL}/proveedores/`);
  const data = await res.json();
  return data.results || data;
};

export const crearProducto = async (payload) => {
  const res = await fetch(`${BASE_URL}/productos/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw await res.json();
  return await res.json();
};

export const actualizarProducto = async (id, payload) => {
  const res = await fetch(`${BASE_URL}/productos/${id}/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw await res.json();
  return await res.json();
};

export const eliminarProducto = async (id) => {
  const res = await fetch(`${BASE_URL}/productos/${id}/`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("No se pudo eliminar");
};
