// services/apiService.js
import { parseApiResponse } from "../utils/apiError";

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
  return await parseApiResponse(res);
}

export async function createItem(endpoint, item) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(item),
  });

  return await parseApiResponse(res);
}

export async function updateItem(endpoint, id, item) {
  const res = await fetch(`${endpoint}${id}/`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(item),
  });

  return await parseApiResponse(res);
}

export async function deleteItemById(endpoint, id) {
  const res = await fetch(`${endpoint}${id}/`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  await parseApiResponse(res);
  return true;
}
