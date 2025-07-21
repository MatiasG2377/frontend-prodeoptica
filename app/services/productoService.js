const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const getAuthHeaders = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const fetchProductos = async () => {
  const res = await fetch(`${BASE_URL}/api/productos/`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  return data.results || data;
};

export const fetchProductosBuscados = async (query) => {
  const res = await fetch(
    `${BASE_URL}/api/productos/buscar/?q=${encodeURIComponent(query)}`,
    { headers: getAuthHeaders() }
  );
  const data = await res.json();
  return Array.isArray(data) ? data : data.results || [];
};

export const fetchCategorias = async () => {
  const res = await fetch(`${BASE_URL}/api/categorias/`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  return data.results || data;
};

export const fetchProveedores = async () => {
  const res = await fetch(`${BASE_URL}/api/proveedores/`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  return data.results || data;
};

export const crearProducto = async (payload) => {
  const res = await fetch(`${BASE_URL}/api/productos/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw await res.json();
  return await res.json();
};

export const actualizarProducto = async (id, payload) => {
  const res = await fetch(`${BASE_URL}/api/productos/${id}/`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw await res.json();
  return await res.json();
};

export const eliminarProducto = async (id) => {
  const res = await fetch(`${BASE_URL}/api/productos/${id}/`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("No se pudo eliminar");
};
