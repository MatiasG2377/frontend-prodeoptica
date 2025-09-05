import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export function useAuth({ redirectToLogin = true } = {}) {
  const router = useRouter();
  const [user, setUser] = useState(null);

  // Memoize the tokens to prevent them from changing between renders
  const { accessToken, refreshToken } = useMemo(() => ({
    accessToken: typeof window !== "undefined" ? localStorage.getItem("access_token") : null,
    refreshToken: typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null
  }), []); // Empty dependency array means these values are computed once on mount

  useEffect(() => {
    if (!accessToken) {
      if (redirectToLogin) {
        // Usar el interceptor para manejar la redirección
        window.location.href = "/login?session_expired=1";
      }
      return;
    }

    try {
      const usuario = JSON.parse(localStorage.getItem("usuario_info"));
      if (usuario?.id && usuario?.username_usuario && usuario?.sucursal) {
        setUser({
          id: usuario.id,
          username: usuario.username_usuario,
          sucursal: usuario.sucursal,
        });
      } else {
        throw new Error("Datos incompletos");
      }
    } catch (error) {
      if (redirectToLogin) {
        // Usar el interceptor para manejar la redirección
        window.location.href = "/login?session_expired=1";
      }
    }
  }, [accessToken, redirectToLogin]);

  const logout = async () => {
    if (!refreshToken) {
      Swal.fire("Error", "No se encontró el token de sesión.", "error");
      router.push("/login");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/logout/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("usuario_info");

      if (res.ok) {
        Swal.fire({
          title: "Sesión cerrada",
          text: "Has cerrado sesión exitosamente.",
          icon: "success",
          confirmButtonColor: "#712b39",
        }).then(() => router.push("/login"));
      } else {
        const data = await res.json();
        Swal.fire("Error", data.detail || "Error al cerrar sesión.", "error");
      }
    } catch (error) {
      Swal.fire("Error", "No se pudo cerrar sesión.", "error");
    }
  };

  return {
    accessToken,
    refreshToken,
    logout,
    isAuthenticated: !!accessToken,
    user,
  };
}
