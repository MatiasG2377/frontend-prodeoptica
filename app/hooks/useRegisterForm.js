// hooks/useRegisterForm.js
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

/**
 * Hook para manejar el estado y la lógica para registrar usuarios.
 *
 * Proporciona los siguientes estados y funciones:
 *
 * - `username`: El nombre de usuario.
 * - `setUsername`: Función para cambiar el nombre de usuario.
 * - `email`: El correo electrónico del usuario.
 * - `setEmail`: Función para cambiar el correo electrónico del usuario.
 * - `password`: La contraseña del usuario.
 * - `setPassword`: Función para cambiar la contraseña del usuario.
 * - `nombreUsuario`: El nombre del usuario.
 * - `setNombreUsuario`: Función para cambiar el nombre del usuario.
 * - `apellidoUsuario`: El apellido del usuario.
 * - `setApellidoUsuario`: Función para cambiar el apellido del usuario.
 * - `telefonoUsuario`: El teléfono del usuario.
 * - `setTelefonoUsuario`: Función para cambiar el teléfono del usuario.
 * - `rolUsuario`: El rol del usuario.
 * - `setRolUsuario`: Función para cambiar el rol del usuario.
 * - `sucursalUsuario`: La sucursal del usuario.
 * - `setSucursalUsuario`: Función para cambiar la sucursal del usuario.
 * - `sucursales`: Un array de sucursales.
 * - `handleSubmit`: Función asíncrona para registrar un usuario.
 *
 * Devuelve un objeto con los estados y funciones mencionados.
 */
export function useRegisterForm(router) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [apellidoUsuario, setApellidoUsuario] = useState("");
  const [telefonoUsuario, setTelefonoUsuario] = useState("");
  const [rolUsuario, setRolUsuario] = useState("Usuario");
  const [sucursalUsuario, setSucursalUsuario] = useState("");
  const [sucursales, setSucursales] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/sucursales/")
      .then((res) => res.json())
      .then((data) => {
        // Asegúrate de que data es un array o extrae lo que necesitas
        if (Array.isArray(data)) {
          setSucursales(data);
        } else if (Array.isArray(data.results)) {
          setSucursales(data.results);
        } else {
          console.error("Formato inesperado de sucursales:", data);
          setSucursales([]);
        }
      })
      .catch(() =>
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar las sucursales.",
          confirmButtonColor: "#712b39",
        })
      );
  }, []);

  /**
   * Función asíncrona para registrar un usuario.
   *
   * Registra un usuario con los datos proporcionados y crea un nuevo usuario
   * en la base de datos con los datos adicionales proporcionados.
   *
   *? @param {Event} e - El evento de envío del formulario.
   *
   *? @throws {Error} Si no se pudo registrar el usuario.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const registerRes = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (!registerRes.ok) throw await registerRes.json();

      const usuarioRes = await fetch("http://127.0.0.1:8000/api/usuarios/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username_usuario: username,
          nombre_usuario: nombreUsuario,
          apellido_usuario: apellidoUsuario,
          email_usuario: email,
          telefono_usuario: telefonoUsuario,
          rol_usuario: rolUsuario,
          sucursal_usuario: sucursalUsuario,
          activo_usuario: true,
        }),
      });

      const usuarioData = await usuarioRes.json();

      if (!usuarioRes.ok) {
        console.error("Error al registrar usuario:", usuarioData);
        throw usuarioData;
      }

      Swal.fire({
        icon: "success",
        title: "Éxito",
        text: "Usuario registrado exitosamente.",
        confirmButtonColor: "#712b39",
      }).then(() => router.push("/login"));
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo registrar el usuario.",
        confirmButtonColor: "#712b39",
      });
    }
  };

  return {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    nombreUsuario,
    setNombreUsuario,
    apellidoUsuario,
    setApellidoUsuario,
    telefonoUsuario,
    setTelefonoUsuario,
    rolUsuario,
    setRolUsuario,
    sucursalUsuario,
    setSucursalUsuario,
    sucursales,
    handleSubmit,
  };
}
