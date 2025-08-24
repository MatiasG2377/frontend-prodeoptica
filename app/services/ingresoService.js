const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const getAuthHeaders = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export async function fetchProductos() {
  const res = await fetch(`${BASE_URL}/productos/`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  return Array.isArray(data) ? data : data.results;
}

export async function fetchProveedores() {
  const res = await fetch(`${BASE_URL}/proveedores/`, {
    headers: getAuthHeaders(),
  });
  return await res.json();
}

export async function updateProducto(id, productoActualizado) {
  return await fetch(`${BASE_URL}/productos/${id}/`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(productoActualizado),
  });
}

export async function registrarMovimiento(data) {
  return await fetch(`${BASE_URL}/movimientos-inventario/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
}

export async function registrarKardex(data) {
  return await fetch(`${BASE_URL}/kardex/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
}

export async function buscarProductos(term) {
  const res = await fetch(`${BASE_URL}/productos/buscar/?q=${term}`, {
    headers: getAuthHeaders(),
  });
  return await res.json();
}
