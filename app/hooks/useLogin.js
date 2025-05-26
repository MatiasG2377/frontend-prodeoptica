import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

/**
 * Hook para manejar el login de un usuario.
 *
 * Retorna un objeto con las siguientes propiedades:
 * - username: string, el nombre de usuario ingresado.
 * - password: string, la contrase a ingresada.
 * - setUsername: function, cambia el valor de username.
 * - setPassword: function, cambia el valor de password.
 * - handleSubmit: function, se encarga de realizar el login y redirigir al usuario
 *   al panel principal si el login es exitoso.
 */
export function useLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  /**
   * Obtiene el ID del usuario con el nombre de usuario especificado.
   *
   * @param {string} username - El nombre de usuario del usuario.
   *
   * @return {number|null} El ID del usuario o null en caso de error.
   */
  const fetchUserId = async (username) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/usuarios/obtener-id/?username=${username}`,
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

  /**
   * Maneja el envío del formulario de inicio de sesión.
   *
   * Previene el comportamiento por defecto del formulario y realiza una petición
   * al endpoint de login. Si el login es exitoso, guarda los tokens de acceso y
   * actualización en el almacenamiento local, obtiene el ID del usuario y redirige
   * al usuario al panel principal. Muestra mensajes de error en caso de fallos.
   *
   *? @param {Object} e - El evento de envío del formulario.
   */

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://127.0.0.1:8000/api/login/", {
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
