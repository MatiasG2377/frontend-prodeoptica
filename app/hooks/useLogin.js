import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export function useLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const fetchUserId = async (username) => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/usuarios/obtener-id/?username=${username}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("userId", data.id);
        return data.id;
      }
      const error = await res.json();
      throw new Error(error.error || "Error desconocido.");
    } catch (err) {
      Swal.fire(
        "Error",
        err.message || "No se pudo obtener el ID del usuario.",
        "error"
      );
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/api/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const { access, refresh } = await res.json();
        localStorage.setItem("access_token", access);
        localStorage.setItem("refresh_token", refresh);

        const userId = await fetchUserId(username);

        if (userId) {
          Swal.fire({
            icon: "success",
            title: "Inicio de sesión exitoso",
            text: "Serás redirigido al panel principal.",
            timer: 2000,
            showConfirmButton: false,
          }).then(() => {
            router.push("/dashboard");
          });
        }
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
