import { parseApiResponse } from "../utils/apiError";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchAbonos = async () => {
  const res = await fetch(`${API_URL}/abonos/`);
  const data = await parseApiResponse(res);
  return data
    .map((abono) => {
      const total = parseFloat(abono.venta?.total_venta || 0);
      const pagado = parseFloat(abono.monto);
      const restante = total - pagado;
      return { ...abono, restante };
    })
    .filter((abono) => abono.restante > 0.0001);
};

export const buscarUsuariosPorNombre = async (nombre) => {
  const token = localStorage.getItem("access_token");
  if (!token) throw { status: 401, detail: "Tu sesión expiró o no iniciaste sesión." };

  const res = await fetch(
    `${API_URL}/clientes/buscar/?q=${encodeURIComponent(nombre)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return await parseApiResponse(res);
};

export const fetchAbonosPorFechas = async (fechaInicio, fechaFin) => {
  const params = new URLSearchParams();
  if (fechaInicio) params.append("fecha_inicio", fechaInicio);
  if (fechaFin) params.append("fecha_fin", fechaFin);

  const res = await fetch(`${API_URL}/abonos/fecha/?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  });

  const data = await parseApiResponse(res);
  return data.results || data;
};

export const fetchAbonoPorVenta = async (ventaId) => {
  const res = await fetch(`${API_URL}/abonos/por-venta/${ventaId}/`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  });

  return await parseApiResponse(res);
};

export const actualizarAbono = async (abonoId, payload) => {
  const res = await fetch(`${API_URL}/abonos/${abonoId}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
    body: JSON.stringify(payload),
  });

  return await parseApiResponse(res);
};
