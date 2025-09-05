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
    throw { detail: "El campo 'ci' es obligatorio para la búsqueda." };
  }

  const res = await fetch(`${BASE_URL}/cliente-paciente/buscar/?ci=${ci}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw await res.json();
  return await res.json();
};

// Crear cliente y paciente (valida que ci_cliente esté presente)
export const crearClientePaciente = async (payload) => {
  if (!payload?.ci_cliente || payload.ci_cliente.trim() === "") {
    throw {
      detail:
        "El campo 'ci_cliente' es obligatorio para crear cliente/paciente.",
    };
  }

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
  const formData = new FormData();
  for (const [key, value] of Object.entries(data)) {
    formData.append(key, value);
  }

  const res = await fetch(`${BASE_URL}/productos/${id}/`, {
    method: "PATCH",
    headers: getAuthHeaders(true), // Indicar que es FormData
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error("Error al actualizar el stock:", errorData);
    throw new Error(`Error ${res.status}: ${errorData.detail || res.statusText}`);
  }

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
