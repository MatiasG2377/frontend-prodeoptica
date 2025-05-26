import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export function useAuth({ redirectToLogin = true } = {}) {
  const router = useRouter();
  const [user, setUser] = useState(null);

  const accessToken =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const refreshToken =
    typeof window !== "undefined"
      ? localStorage.getItem("refresh_token")
      : null;

  useEffect(() => {
    if (!accessToken) {
      if (redirectToLogin) router.push("/login");
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
      console.error("Error cargando usuario desde localStorage:", error);
      if (redirectToLogin) router.push("/login");
    }
  }, [accessToken]);

  const logout = async () => {
    if (!refreshToken) {
      Swal.fire("Error", "No se encontró el token de sesión.", "error");
      router.push("/login");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/logout/", {
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
      console.error("Error en logout:", error);
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
