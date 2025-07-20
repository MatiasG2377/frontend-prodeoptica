export async function getAllItems(url) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error("Error al obtener datos");
  return await res.json();
}

export async function createItem(url, item) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(item),
  });

  if (!res.ok) throw await res.json();
  return await res.json();
}

export async function updateItem(url, id, item) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const res = await fetch(`${url}${id}/`, {
    method: "PUT",
    headers,
    body: JSON.stringify(item),
  });

  if (!res.ok) throw await res.json();
  return await res.json();
}

export async function deleteItemById(url, id) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const res = await fetch(`${url}${id}/`, {
    method: "DELETE",
    headers,
  });

  if (!res.ok) throw new Error("Error al eliminar");
  return true;
}
