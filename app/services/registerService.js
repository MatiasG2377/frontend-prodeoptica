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

export async function registerAccount({ username, email, password }) {
  const res = await fetch(`${BASE_URL}/register/`, {
    method: "POST",
    headers: getAuthHeaders(), // puede funcionar sin token también
    body: JSON.stringify({ username, email, password }),
  });
  return await parseApiResponse(res);
}

export async function createUsuario(data) {
  const res = await fetch(`${BASE_URL}/usuarios/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return await parseApiResponse(res);
}

export async function getSucursales() {
  const res = await fetch(`${BASE_URL}/sucursales/`, {
    headers: getAuthHeaders(),
  });
  const data = await parseApiResponse(res);
  return Array.isArray(data) ? data : data.results ?? [];
}
