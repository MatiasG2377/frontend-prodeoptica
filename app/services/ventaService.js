import { parseApiResponse } from "../utils/apiError";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const getAuthHeaders = (isFormData = false) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const headers = {
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
};

// Buscar cliente y paciente por CI (valida que haya CI)
export const buscarClienteYPaciente = async (ci) => {
  if (!ci || ci.trim() === "") {
    throw { status: 400, detail: "Ingresá una cédula para buscar." };
  }

  const res = await fetch(`${BASE_URL}/cliente-paciente/buscar/?ci=${ci}`, {
    headers: getAuthHeaders(),
  });
  return await parseApiResponse(res);
};

// Crear cliente y paciente (ci_cliente es opcional)
export const crearClientePaciente = async (payload) => {
  const res = await fetch(`${BASE_URL}/cliente-paciente/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return await parseApiResponse(res);
};

// Actualizar cliente
export const actualizarCliente = async (id, data) => {
  const res = await fetch(`${BASE_URL}/clientes/${id}/`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return await parseApiResponse(res);
};

// Actualizar paciente
export const actualizarPaciente = async (id, data) => {
  const res = await fetch(`${BASE_URL}/pacientes/${id}/`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return await parseApiResponse(res);
};

// Crear venta
export const crearVenta = async (ventaData) => {
  const res = await fetch(`${BASE_URL}/ventas/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(ventaData),
  });
  return await parseApiResponse(res);
};

// Crear artículo de venta
export const crearArticuloVenta = async (data) => {
  const res = await fetch(`${BASE_URL}/articulos-venta/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return await parseApiResponse(res);
};

// Actualizar stock de producto
export const actualizarStockProducto = async (id, data) => {
  const formData = new FormData();
  for (const [key, value] of Object.entries(data)) {
    formData.append(key, value);
  }

  const res = await fetch(`${BASE_URL}/productos/${id}/`, {
    method: "PATCH",
    headers: getAuthHeaders(true), // Indicar que es FormData
    body: formData,
  });

  return await parseApiResponse(res);
};

// Registrar movimiento en Kardex
export const registrarMovimientoKardex = async (data) => {
  const res = await fetch(`${BASE_URL}/kardex/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return await parseApiResponse(res);
};

// Registrar abono
export const registrarAbono = async (data) => {
  const res = await fetch(`${BASE_URL}/abonos/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return await parseApiResponse(res);
};
