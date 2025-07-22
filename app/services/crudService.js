// services/apiService.js
const getAuthHeaders = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export async function getAllItems(endpoint) {
  const res = await fetch(endpoint, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Error al obtener datos");
  return await res.json();
}

export async function createItem(endpoint, item) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(item),
  });

  if (!res.ok) throw await res.json();
  return await res.json();
}

export async function updateItem(endpoint, id, item) {
  const res = await fetch(`${endpoint}${id}/`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(item),
  });

  if (!res.ok) throw await res.json();
  return await res.json();
}

export async function deleteItemById(endpoint, id) {
  const res = await fetch(`${endpoint}${id}/`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Error al eliminar");
  return true;
}
