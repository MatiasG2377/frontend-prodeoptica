const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const getAuthHeaders = () => {
  if (typeof window === 'undefined') return {};
  
  const token = localStorage.getItem("access_token");
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export async function fetchProductos() {
  try {
    const res = await fetch(`${BASE_URL}/productos/`, {
      headers: getAuthHeaders()
    });
    
    if (!res.ok) {
      if (res.status === 401) {
        // El interceptor se encargará de manejar la sesión expirada
        return [];
      }
      throw new Error("Error al cargar los productos");
    }
    
    const data = await res.json();
    return Array.isArray(data) ? data : data.results || [];
  } catch (error) {
    console.error('Error en fetchProductos:', error);
    return [];
  }
}

export async function fetchKardexByProducto(productoId) {
  try {
    const res = await fetch(`${BASE_URL}/kardex/historial/${productoId}/`, {
      headers: getAuthHeaders()
    });
    
    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        // Lanzar un error específico para autenticación
        const error = new Error("Authentication error");
        error.status = res.status;
        throw error;
      }
      // Para otros errores, lanzar un error genérico
      throw new Error("No hay movimientos registrados");
    }
    
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error en fetchKardexByProducto:', error);
    // Solo propagar errores de autenticación
    if (error.status === 401 || error.status === 403) {
      throw error;
    }
    // Para otros errores, retornar array vacío
    return [];
  }
}
