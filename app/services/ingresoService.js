const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const getAuthHeaders = (isFormData = false) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const headers = {
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
};

export async function fetchProductos() {
  const res = await fetch(`${BASE_URL}/productos/`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  return Array.isArray(data) ? data : data.results;
}

export async function fetchProveedores() {
  const res = await fetch(`${BASE_URL}/proveedores/`, {
    headers: getAuthHeaders(),
  });
  return await res.json();
}

export async function updateProducto(id, productoActualizado) {
  const formData = new FormData();

  for (const [key, value] of Object.entries(productoActualizado)) {
    if (value === null || value === undefined) {
      continue; // No agregar valores nulos o indefinidos
    }

    if (typeof value === "object" && value.id) {
      formData.append(key, value.id);
    } else if (typeof value === "boolean") {
      formData.append(key, value ? "true" : "false");
    } else if (key !== "imagen_url" && key !== "imagen_producto") {
      formData.append(key, value);
    }
  }

  const res = await fetch(`${BASE_URL}/productos/${id}/`, {
    method: "PUT",
    headers: getAuthHeaders(true), // Indicar que es FormData
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({})); // Intenta parsear el error
    console.error("Error al actualizar el producto:", errorData);
    throw new Error(
      `Error ${res.status}: ${errorData.detail || res.statusText}`
    );
  }

  return await res.json();
}

export async function registrarMovimiento(data) {
  return await fetch(`${BASE_URL}/movimientos-inventario/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
}

export async function registrarKardex(data) {
  return await fetch(`${BASE_URL}/kardex/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
}

export async function buscarProductos(term) {
  const res = await fetch(`${BASE_URL}/productos/buscar/?q=${term}`, {
    headers: getAuthHeaders(),
  });
  return await res.json();
}
