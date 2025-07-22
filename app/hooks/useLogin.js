import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export function useLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const { access, refresh, usuario } = await res.json();

        // Guardar tokens e ID del usuario directamente
        localStorage.setItem("access_token", access);
        localStorage.setItem("refresh_token", refresh);
        localStorage.setItem("userId", usuario.id);

        Swal.fire({
          icon: "success",
          title: "Inicio de sesión exitoso",
          text: "Serás redirigido al panel principal.",
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          router.push("/dashboard");
        });
      } else {
        const error = await res.json();
        Swal.fire({
          icon: "error",
          title: "Error de autenticación",
          text: error.detail || "Credenciales inválidas.",
          confirmButtonColor: "#712b39",
        });
      }
    } catch (err) {
      Swal.fire("Error", "Problema al intentar iniciar sesión.", "error");
    }
  };

  return {
    username,
    password,
    setUsername,
    setPassword,
    handleSubmit,
  };
}
