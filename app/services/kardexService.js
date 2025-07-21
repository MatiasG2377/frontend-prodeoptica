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
  if (!res.ok) throw new Error("Error al cargar los productos");
  const data = await res.json();
  return Array.isArray(data) ? data : data.results || [];
}

export async function fetchKardexByProducto(productoId) {
  const res = await fetch(`${BASE_URL}/kardex/historial/${productoId}/`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("No hay movimientos registrados");
  return await res.json();
}
