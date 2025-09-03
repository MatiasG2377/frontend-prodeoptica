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
      // Mostrar loader mientras se procesa el registro
      const loadingSwal = Swal.fire({
        title: 'Procesando registro...',
        html: 'Por favor espera mientras creamos tu cuenta.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // 1. Registrar la cuenta
      await registerAccount({ username, email, password });

      // 2. Crear el perfil de usuario
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

      // Cerrar el loader
      await loadingSwal.close();

      // Mostrar mensaje de éxito con cuenta regresiva
      let timerInterval;
      await Swal.fire({
        icon: "success",
        title: "¡Registro exitoso!",
        html: `Serás redirigido al login en <b>5</b> segundos.`,
        timer: 5000,
        timerProgressBar: true,
        allowOutsideClick: false,
        showConfirmButton: true,
        confirmButtonText: 'Ir al login ahora',
        confirmButtonColor: "#712b39",
        didOpen: () => {
          const timer = Swal.getHtmlContainer().querySelector('b');
          let timeLeft = 5;
          timerInterval = setInterval(() => {
            timeLeft--;
            if (timeLeft >= 0) {
              timer.textContent = timeLeft;
            }
          }, 1000);
        },
        willClose: () => {
          clearInterval(timerInterval);
          router.push("/login");
        }
      }).then((result) => {
        if (result.dismiss === Swal.DismissReason.timer) {
          router.push("/login");
        } else if (result.isConfirmed) {
          router.push("/login");
        }
      });
    } catch (error) {
      // Cerrar loader si está abierto
      Swal.close();
      
      // Determinar el mensaje de error
      let errorMessage = "Ocurrió un error al procesar el registro. Por favor, inténtalo de nuevo.";
      
      if (error.response) {
        // Error de respuesta del servidor
        const { data } = error.response;
        errorMessage = 
          data?.username?.[0] ||
          data?.email?.[0] ||
          data?.username_usuario?.[0] ||
          data?.email_usuario?.[0] ||
          data?.detail ||
          JSON.stringify(data) ||
          errorMessage;
      } else if (error.request) {
        // Error de red
        errorMessage = "No se pudo conectar con el servidor. Verifica tu conexión a internet.";
      }

      // Mostrar error
      await Swal.fire({
        icon: "error",
        title: "Error en el registro",
        text: errorMessage,
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
