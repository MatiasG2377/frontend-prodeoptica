import Swal from "sweetalert2";
import { useAuth } from "../hooks/useAuth";

/**
 * Hook que devuelve una función para hacer fetch autenticado.
 * Si el token está vencido, cierra la sesión automáticamente.
 */
export function useApiFetch() {
  const { accessToken, logout } = useAuth({ redirectToLogin: false });

  const apiFetch = async (url, options = {}) => {
    try {
      const res = await fetch(url, {
        ...options,
        headers: {
          ...(options.headers || {}),
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (res.status === 401) {
        Swal.fire({
          icon: "warning",
          title: "Sesión expirada",
          text: "Por seguridad, se ha cerrado tu sesión.",
          confirmButtonColor: "#712b39",
        });
        logout(); // ⛔️ Token inválido o expirado
        return null;
      }

      return res;
    } catch (error) {
      Swal.fire("Error", "No se pudo conectar con el servidor.", "error");
      return null;
    }
  };

  return apiFetch;
}
