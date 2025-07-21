// services/apiService.js
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const getAuthHeaders = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export async function getAllItems(endpoint) {
  const url = `${BASE_URL}/${endpoint}`;
  const res = await fetch(url, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Error al obtener datos");
  return await res.json();
}

export async function createItem(endpoint, item) {
  const url = `${BASE_URL}/${endpoint}`;
  const res = await fetch(url, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(item),
  });

  if (!res.ok) throw await res.json();
  return await res.json();
}

export async function updateItem(endpoint, id, item) {
  const url = `${BASE_URL}/${endpoint}${id}/`;
  const res = await fetch(url, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(item),
  });

  if (!res.ok) throw await res.json();
  return await res.json();
}

export async function deleteItemById(endpoint, id) {
  const url = `${BASE_URL}/${endpoint}${id}/`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Error al eliminar");
  return true;
}
