import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { parseApiResponse, getErrorMessage } from "../utils/apiError";

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

      const { access, refresh, usuario } = await parseApiResponse(res);

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
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error de autenticación",
        text: getErrorMessage(err),
        confirmButtonColor: "#712b39",
      });
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
