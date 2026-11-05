import { parseApiResponse } from "../utils/apiError";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const getAuthHeaders = () => {
  if (typeof window === 'undefined') return {};

  const token = localStorage.getItem("access_token");
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export async function fetchProductos() {
  const res = await fetch(`${BASE_URL}/productos/`, {
    headers: getAuthHeaders()
  });
  const data = await parseApiResponse(res);
  return Array.isArray(data) ? data : data.results || [];
}

export async function fetchKardexByProducto(productoId) {
  const res = await fetch(`${BASE_URL}/kardex/historial/${productoId}/`, {
    headers: getAuthHeaders()
  });
  const data = await parseApiResponse(res);
  return Array.isArray(data) ? data : [];
}
