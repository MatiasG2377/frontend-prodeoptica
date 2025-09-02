const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const getAuthHeaders = (isFormData = false) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  return {
    // Solo incluir Content-Type si NO es FormData
    ...(!isFormData && { "Content-Type": "application/json" }),
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const fetchProductos = async () => {
  const res = await fetch(`${BASE_URL}/productos/`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  return data.results || data;
};

export const fetchProductosBuscados = async (query) => {
  const res = await fetch(
    `${BASE_URL}/productos/buscar/?q=${encodeURIComponent(query)}`,
    { headers: getAuthHeaders() }
  );
  const data = await res.json();
  return Array.isArray(data) ? data : data.results || [];
};

export const fetchCategorias = async () => {
  const res = await fetch(`${BASE_URL}/categorias/`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  return data.results || data;
};

export const fetchProveedores = async () => {
  const res = await fetch(`${BASE_URL}/proveedores/`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  return data.results || data;
};

export const crearProducto = async (payload) => {
  const isFormData = payload instanceof FormData;
  const res = await fetch(`${BASE_URL}/productos/`, {
    method: "POST",
    headers: getAuthHeaders(isFormData),
    body: payload, // FormData directamente
  });
  if (!res.ok) throw await res.json();
  return res.json();
};

export const actualizarProducto = async (id, payload) => {
  const isFormData = payload instanceof FormData;
  const res = await fetch(`${BASE_URL}/productos/${id}/`, {
    method: "PATCH",
    headers: getAuthHeaders(isFormData),
    body: payload,
  });
  if (!res.ok) throw await res.json();
  return res.json();
};

export const eliminarProducto = async (id) => {
  const res = await fetch(`${BASE_URL}/productos/${id}/`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("No se pudo eliminar");
};
