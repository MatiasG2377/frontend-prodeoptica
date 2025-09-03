const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const getAuthHeaders = (isFormData = false) => {
  // Verificar si estamos en el navegador
  if (typeof window === "undefined") {
    return !isFormData ? { "Content-Type": "application/json" } : {};
  }

  const token = localStorage.getItem("access_token");
  if (!token) {
    return !isFormData ? { "Content-Type": "application/json" } : {};
  }

  return {
    ...(!isFormData && { "Content-Type": "application/json" }),
    Authorization: `Bearer ${token}`,
  };
};

export const fetchProductos = async () => {
  const res = await fetch(`${BASE_URL}/productos/`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
      }
      throw { 
        response: { 
          status: res.status, 
          data: { 
            detail: 'Su sesión ha expirado. Por favor, inicie sesión nuevamente.',
            code: 'token_expired'
          } 
        } 
      };
    }
    throw data;
  }
  return data.results || data;
};

export const fetchProductosBuscados = async (query) => {
  const res = await fetch(
    `${BASE_URL}/productos/buscar/?q=${encodeURIComponent(query)}`,
    { headers: getAuthHeaders() }
  );
  const data = await res.json();
  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
      }
      throw { 
        response: { 
          status: res.status, 
          data: { 
            detail: 'Su sesión ha expirado. Por favor, inicie sesión nuevamente.',
            code: 'token_expired'
          } 
        } 
      };
    }
    throw data;
  }
  return Array.isArray(data) ? data : data.results || [];
};

export const fetchCategorias = async () => {
  const res = await fetch(`${BASE_URL}/categorias/`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
      }
      throw { 
        response: { 
          status: res.status, 
          data: { 
            detail: 'Su sesión ha expirado. Por favor, inicie sesión nuevamente.',
            code: 'token_expired'
          } 
        } 
      };
    }
    throw data;
  }
  return data.results || data;
};

export const fetchProveedores = async () => {
  const res = await fetch(`${BASE_URL}/proveedores/`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
      }
      throw { 
        response: { 
          status: res.status, 
          data: { 
            detail: 'Su sesión ha expirada. Por favor, inicie sesión nuevamente.',
            code: 'token_expired'
          } 
        } 
      };
    }
    throw data;
  }
  return data.results || data;
};

export const crearProducto = async (payload) => {
  const isFormData = payload instanceof FormData;
  const res = await fetch(`${BASE_URL}/productos/`, {
    method: "POST",
    headers: getAuthHeaders(isFormData),
    body: payload, // FormData directamente
  });
  const data = await res.json();
  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      // Limpiar el token inválido
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
      }
      throw { 
        response: { 
          status: res.status, 
          data: { 
            detail: 'Su sesión ha expirado. Por favor, inicie sesión nuevamente.',
            code: 'token_expired'
          } 
        } 
      };
    }
    throw data;
  }
  return data;
};

export const actualizarProducto = async (id, payload) => {
  const isFormData = payload instanceof FormData;
  const res = await fetch(`${BASE_URL}/productos/${id}/`, {
    method: "PATCH",
    headers: getAuthHeaders(isFormData),
    body: payload,
  });
  const data = await res.json();
  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      // Limpiar el token inválido
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
      }
      throw { 
        response: { 
          status: res.status, 
          data: { 
            detail: 'Su sesión ha expirado. Por favor, inicie sesión nuevamente.',
            code: 'token_expired'
          } 
        } 
      };
    }
    throw data;
  }
  return data;
};

export const eliminarProducto = async (id) => {
  const res = await fetch(`${BASE_URL}/productos/${id}/`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
      }
      throw { 
        response: { 
          status: res.status, 
          data: { 
            detail: 'Su sesión ha expirada. Por favor, inicie sesión nuevamente.',
            code: 'token_expired'
          } 
        } 
      };
    }
    throw new Error(data.detail || "No se pudo eliminar el producto");
  }
};
