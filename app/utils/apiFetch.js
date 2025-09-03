import { useAuth } from "../hooks/useAuth";

/**
 * Hook que devuelve una función para hacer fetch autenticado.
 * El manejo de sesión expirada se maneja por el interceptor global en interceptFetch.js
 */
export function useApiFetch() {
  const { accessToken } = useAuth({ redirectToLogin: false });

  const apiFetch = async (url, options = {}) => {
    try {
      const res = await fetch(url, {
        ...options,
        headers: {
          ...(options.headers || {}),
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
          "Content-Type": "application/json",
        },
      });

      return res;
    } catch (error) {
      console.error('Error en apiFetch:', error);
      throw error; // Dejamos que el interceptor global maneje el error
    }
  };

  return apiFetch;
}
