const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const getAuthHeaders = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const buscarClienteYPaciente = async (ci) => {
  const res = await fetch(`${BASE_URL}/api/cliente-paciente/buscar/?ci=${ci}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw await res.json();
  return await res.json();
};

export const crearClientePaciente = async (payload) => {
  const res = await fetch(`${BASE_URL}/api/cliente-paciente/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw await res.json();
  return await res.json();
};

export const actualizarCliente = async (id, data) => {
  const res = await fetch(`${BASE_URL}/api/clientes/${id}/`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await res.json();
  return await res.json();
};

export const actualizarPaciente = async (id, data) => {
  const res = await fetch(`${BASE_URL}/api/pacientes/${id}/`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await res.json();
  return await res.json();
};

export const crearVenta = async (ventaData) => {
  const res = await fetch(`${BASE_URL}/api/ventas/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(ventaData),
  });
  if (!res.ok) throw await res.json();
  return await res.json();
};

export const crearArticuloVenta = async (data) => {
  const res = await fetch(`${BASE_URL}/api/articulos-venta/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await res.json();
  return await res.json();
};

export const actualizarStockProducto = async (id, data) => {
  const res = await fetch(`${BASE_URL}/api/productos/${id}/`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await res.json();
  return await res.json();
};

export const registrarMovimientoKardex = async (data) => {
  const res = await fetch(`${BASE_URL}/api/kardex/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await res.json();
  return await res.json();
};

export const registrarAbono = async (data) => {
  const res = await fetch(`${BASE_URL}/api/abonos/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await res.json();
  return await res.json();
};
