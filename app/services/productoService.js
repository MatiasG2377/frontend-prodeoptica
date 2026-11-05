import { parseApiResponse } from "../utils/apiError";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const getAuthHeaders = (isFormData = false) => {
  // Verificar si estamos en el navegador
  if (typeof window === "undefined") {
    return !isFormData ? { "Content-Type": "application/json" } : {};
  }

  const token = localStorage.getItem("access_token");
  if (!token) {
    return !isFormData ? { "Content-Type": "application/json" } : {};
  }

  return {
    ...(!isFormData && { "Content-Type": "application/json" }),
    Authorization: `Bearer ${token}`,
  };
};

const limpiarSesionSiExpiro = (error) => {
  if ((error?.status === 401 || error?.status === 403) && typeof window !== "undefined") {
    localStorage.removeItem("access_token");
  }
  throw error;
};

export const fetchProductos = async () => {
  const res = await fetch(`${BASE_URL}/productos/`, {
    headers: getAuthHeaders(),
  });
  try {
    const data = await parseApiResponse(res);
    return data.results || data;
  } catch (error) {
    return limpiarSesionSiExpiro(error);
  }
};

export const fetchProductosBuscados = async (query) => {
  const res = await fetch(
    `${BASE_URL}/productos/buscar/?q=${encodeURIComponent(query)}`,
    { headers: getAuthHeaders() }
  );
  try {
    const data = await parseApiResponse(res);
    return Array.isArray(data) ? data : data.results || [];
  } catch (error) {
    return limpiarSesionSiExpiro(error);
  }
};

export const fetchCategorias = async () => {
  const res = await fetch(`${BASE_URL}/categorias/`, {
    headers: getAuthHeaders(),
  });
  try {
    const data = await parseApiResponse(res);
    return data.results || data;
  } catch (error) {
    return limpiarSesionSiExpiro(error);
  }
};

export const fetchProveedores = async () => {
  const res = await fetch(`${BASE_URL}/proveedores/`, {
    headers: getAuthHeaders(),
  });
  try {
    const data = await parseApiResponse(res);
    return data.results || data;
  } catch (error) {
    return limpiarSesionSiExpiro(error);
  }
};

export const crearProducto = async (payload) => {
  const isFormData = payload instanceof FormData;
  const res = await fetch(`${BASE_URL}/productos/`, {
    method: "POST",
    headers: getAuthHeaders(isFormData),
    body: payload, // FormData directamente
  });
  try {
    return await parseApiResponse(res);
  } catch (error) {
    return limpiarSesionSiExpiro(error);
  }
};

export const actualizarProducto = async (id, payload) => {
  const isFormData = payload instanceof FormData;
  const res = await fetch(`${BASE_URL}/productos/${id}/`, {
    method: "PATCH",
    headers: getAuthHeaders(isFormData),
    body: payload,
  });
  try {
    return await parseApiResponse(res);
  } catch (error) {
    return limpiarSesionSiExpiro(error);
  }
};

export const eliminarProducto = async (id) => {
  const res = await fetch(`${BASE_URL}/productos/${id}/`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  try {
    await parseApiResponse(res);
  } catch (error) {
    return limpiarSesionSiExpiro(error);
  }
};
