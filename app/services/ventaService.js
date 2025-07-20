// services/ventaService.js
const API = "http://127.0.0.1:8000/api";
const token = () => localStorage.getItem("access_token");

export const buscarClienteYPaciente = async (ci) => {
  const res = await fetch(`${API}/cliente-paciente/buscar/?ci=${ci}`, {
    headers: { Authorization: `Bearer ${token()}` },
  });
  return await res.json();
};

export const crearClientePaciente = async (payload) => {
  const res = await fetch(`${API}/cliente-paciente/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token()}`,
    },
    body: JSON.stringify(payload),
  });
  return await res.json();
};

export const actualizarCliente = (id, data) =>
  fetch(`${API}/clientes/${id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token()}`,
    },
    body: JSON.stringify(data),
  });

export const actualizarPaciente = (id, data) =>
  fetch(`${API}/pacientes/${id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token()}`,
    },
    body: JSON.stringify(data),
  });

export const crearVenta = async (ventaData) => {
  const res = await fetch(`${API}/ventas/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token()}`,
    },
    body: JSON.stringify(ventaData),
  });
  return await res.json();
};

export const crearArticuloVenta = async (data) =>
  fetch(`${API}/articulos-venta/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token()}`,
    },
    body: JSON.stringify(data),
  });

export const actualizarStockProducto = (id, data) =>
  fetch(`${API}/productos/${id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token()}`,
    },
    body: JSON.stringify(data),
  });

export const registrarMovimientoKardex = (data) =>
  fetch(`${API}/kardex/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token()}`,
    },
    body: JSON.stringify(data),
  });

export const registrarAbono = (data) =>
  fetch(`${API}/abonos/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token()}`,
    },
    body: JSON.stringify(data),
  });
