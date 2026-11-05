import { parseApiResponse } from "../utils/apiError";

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
  const data = await parseApiResponse(res);
  return {
    pacienteData: data.paciente,
    historial: data.historial,
  };
}

export async function buscarPacientePorApellidoAPI(apellido) {
  const res = await fetch(`${BASE_URL}/pacientes/?apellido=${apellido}`, {
    headers: getAuthHeaders(),
  });
  return await parseApiResponse(res);
}

export async function guardarFichaCompletaAPI(paciente, ficha) {
  const res = await fetch(`${BASE_URL}/fichas-medicas/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ paciente, ficha }),
  });

  await parseApiResponse(res);
}
