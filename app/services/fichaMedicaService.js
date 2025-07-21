const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const getAuthHeaders = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export async function buscarPacientePorCIAPI(ci) {
  const res = await fetch(`${BASE_URL}/pacientes/?ci=${ci}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Paciente no encontrado");
  const data = await res.json();
  return {
    pacienteData: data.paciente,
    historial: data.historial,
  };
}

export async function buscarPacientePorApellidoAPI(apellido) {
  const res = await fetch(`${BASE_URL}/pacientes/?apellido=${apellido}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("No encontrado");
  return await res.json();
}

export async function guardarFichaCompletaAPI(paciente, ficha) {
  const res = await fetch(`${BASE_URL}/fichas-medicas/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ paciente, ficha }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Error al guardar ficha");
  }
}
