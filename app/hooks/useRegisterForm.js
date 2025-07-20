import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

import { validarCamposRegistro } from "../utils/validaciones";
import {
  registerAccount,
  createUsuario,
  getSucursales,
} from "../services/registerService";

export function useRegisterForm() {
  const router = useRouter();

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
    getSucursales()
      .then(setSucursales)
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar las sucursales.",
          confirmButtonColor: "#712b39",
        });
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errorMsg = validarCamposRegistro({
      username,
      email,
      password,
      nombre: nombreUsuario,
      apellido: apellidoUsuario,
      telefono: telefonoUsuario,
      sucursal: sucursalUsuario,
    });

    if (errorMsg) {
      Swal.fire({
        icon: "warning",
        title: "Validación",
        text: errorMsg,
        confirmButtonColor: "#712b39",
      });
      return;
    }

    try {
      await registerAccount({ username, email, password });

      await createUsuario({
        username_usuario: username,
        nombre_usuario: nombreUsuario,
        apellido_usuario: apellidoUsuario,
        email_usuario: email,
        telefono_usuario: telefonoUsuario,
        rol_usuario: rolUsuario,
        sucursal_usuario: sucursalUsuario,
        activo_usuario: true,
      });

      Swal.fire({
        icon: "success",
        title: "Éxito",
        text: "Usuario registrado exitosamente.",
        confirmButtonColor: "#712b39",
      }).then(() => router.push("/login"));
    } catch (err) {
      const msg =
        err?.username_usuario?.[0] ||
        err?.email_usuario?.[0] ||
        err?.username?.[0] ||
        err?.email?.[0] ||
        "Error desconocido.";

      Swal.fire({
        icon: "error",
        title: "Registro fallido",
        text: msg,
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
