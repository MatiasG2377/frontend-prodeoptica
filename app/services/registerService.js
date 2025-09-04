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
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function createUsuario(data) {
  const res = await fetch(`${BASE_URL}/usuarios/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function getSucursales() {
  try {
    const res = await fetch(`${BASE_URL}/sucursales/`, {
      headers: getAuthHeaders(),
    });
    
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.detail || 'Error al cargar las sucursales');
    }
    
    const data = await res.json();
    
    // Handle different possible response formats
    if (Array.isArray(data)) {
      return data;
    } else if (data && Array.isArray(data.results)) {
      return data.results;
    } else if (data && data.data && Array.isArray(data.data)) {
      return data.data;
    }
    
    console.warn('Unexpected response format from /sucursales/', data);
    return [];
  } catch (error) {
    console.error('Error in getSucursales:', error);
    throw error;
  }
}
