// services/registerService.js
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function registerAccount({ username, email, password }) {
  const res = await fetch(`${BASE_URL}/api/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function createUsuario(data) {
  const res = await fetch(`${BASE_URL}/api/usuarios/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function getSucursales() {
  const res = await fetch(`${BASE_URL}/api/sucursales/`);
  const data = await res.json();
  return Array.isArray(data) ? data : data.results ?? [];
}
