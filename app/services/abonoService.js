const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchAbonos = async () => {
  const res = await fetch(`${API_URL}/abonos/`);
  if (!res.ok) throw new Error("Error al obtener los abonos");
  const data = await res.json();
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
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("Token no disponible");

    const res = await fetch(
      `${API_URL}/clientes/buscar/?q=${encodeURIComponent(nombre)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Error en la búsqueda:", errorData);
      throw new Error("Error al buscar clientes por nombre");
    }

    return await res.json();
  } catch (error) {
    console.error("Error al buscar clientes:", error);
    throw error;
  }
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

  if (!res.ok) throw new Error("Error al filtrar abonos");
  const data = await res.json();
  return data.results || data;
};

export const fetchAbonoPorVenta = async (ventaId) => {
  const res = await fetch(`${API_URL}/abonos/por-venta/${ventaId}/`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  });

  if (!res.ok) throw new Error("No se pudo obtener el abono por venta");
  return await res.json();
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

  if (!res.ok) throw new Error("Error al actualizar el abono");
  return await res.json();
};
