const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const getAuthHeaders = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Buscar cliente y paciente por CI
export const buscarClienteYPaciente = async (ci) => {
  const res = await fetch(`${BASE_URL}/cliente-paciente/buscar/?ci=${ci}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw await res.json();
  return await res.json();
};

// Crear cliente y paciente (solo ci_cliente es obligatorio, los demás opcionales)
export const crearClientePaciente = async (payload) => {
  const res = await fetch(`${BASE_URL}/cliente-paciente/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw await res.json();
  return await res.json();
};

// Actualizar cliente
export const actualizarCliente = async (id, data) => {
  const res = await fetch(`${BASE_URL}/clientes/${id}/`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await res.json();
  return await res.json();
};

// Actualizar paciente
export const actualizarPaciente = async (id, data) => {
  const res = await fetch(`${BASE_URL}/pacientes/${id}/`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await res.json();
  return await res.json();
};

// Crear venta
export const crearVenta = async (ventaData) => {
  const res = await fetch(`${BASE_URL}/ventas/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(ventaData),
  });
  if (!res.ok) throw await res.json();
  return await res.json();
};

// Crear artículo de venta
export const crearArticuloVenta = async (data) => {
  const res = await fetch(`${BASE_URL}/articulos-venta/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await res.json();
  return await res.json();
};

// Actualizar stock de producto
export const actualizarStockProducto = async (id, data) => {
  const res = await fetch(`${BASE_URL}/productos/${id}/`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await res.json();
  return await res.json();
};

// Registrar movimiento en Kardex
export const registrarMovimientoKardex = async (data) => {
  const res = await fetch(`${BASE_URL}/kardex/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await res.json();
  return await res.json();
};

// Registrar abono
export const registrarAbono = async (data) => {
  const res = await fetch(`${BASE_URL}/abonos/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await res.json();
  return await res.json();
};
