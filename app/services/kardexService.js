// utils/kardexService.js
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function fetchProductos() {
  const res = await fetch(`${BASE_URL}/api/productos/`);
  if (!res.ok) throw new Error("Error al cargar los productos");
  const data = await res.json();
  return Array.isArray(data) ? data : data.results || [];
}

export async function fetchKardexByProducto(productoId) {
  const res = await fetch(`${BASE_URL}/api/kardex/historial/${productoId}/`);
  if (!res.ok) throw new Error("No hay movimientos registrados");
  return await res.json();
}
