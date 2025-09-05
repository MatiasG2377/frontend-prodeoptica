import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { validarCamposRegistro, sanitizeInput } from "../utils/validaciones";
import { registerAccount, createUsuario, getSucursales } from "../services/registerService";

export function useRegisterForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    nombre: "",
    apellido: "",
    telefono: "",
    rol: "Usuario",
    sucursal: ""
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sucursales, setSucursales] = useState([]);
  const [isLoadingSucursales, setIsLoadingSucursales] = useState(true);

  useEffect(() => {
    const loadSucursales = async () => {
      try {
        setIsLoadingSucursales(true);
        const data = await getSucursales();
        setSucursales(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error al cargar sucursales:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message || "Ocurrió un error al cargar las sucursales",
          confirmButtonColor: "#712b39",
        });
      } finally {
        setIsLoadingSucursales(false);
      }
    };

    loadSucursales();
  }, []);

  // Validate a single field
  const validateField = useCallback((field, value) => {
    const fieldErrors = validarCamposRegistro({ ...formData, [field]: value });
    const error = fieldErrors ? fieldErrors[field] : null;
    
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));

    return !error;
  }, [formData]);

  // Handle field blur
  const handleFieldBlur = useCallback((field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  }, [formData, validateField]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Mark all fields as touched to show all errors
    const allTouched = {};
    Object.keys(formData).forEach(field => {
      allTouched[field] = true;
    });
    setTouched(allTouched);

    // Validate all fields
    const validationErrors = validarCamposRegistro(formData);
    if (validationErrors) {
      setErrors(validationErrors);
      setIsSubmitting(false);
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
      await registerAccount({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      // 2. Crear el perfil de usuario
      await createUsuario({
        username_usuario: formData.username,
        nombre_usuario: formData.nombre,
        apellido_usuario: formData.apellido,
        email_usuario: formData.email,
        telefono_usuario: formData.telefono,
        rol_usuario: formData.rol,
        sucursal: formData.sucursal,
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
      setIsSubmitting(false);
      
      // Determinar el mensaje de error
      let errorMessage = "Ocurrió un error al procesar el registro. Por favor, inténtalo de nuevo.";
      
      if (error && typeof error === 'object' && !Array.isArray(error)) {
        const rawErrorMessage =
          error.username?.[0] ||
          error.email?.[0] ||
          error.username_usuario?.[0] ||
          error.email_usuario?.[0] ||
          error.sucursal_usuario?.[0] ||
          error.detail ||
          JSON.stringify(error);

        if (rawErrorMessage === 'Enter a valid email address.') {
            errorMessage = 'Ingresa un correo electrónico válido.';
        } else if (rawErrorMessage.includes("already exists")) {
            errorMessage = 'Un usuario con este correo o nombre de usuario ya existe.';
        } else {
            errorMessage = rawErrorMessage;
        }

      } else if (error instanceof Error) {
        errorMessage = error.message;
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

  // Handle field changes with sanitization
  const handleChange = useCallback((field, value) => {
    const sanitizedValue = sanitizeInput(field, value);
    setFormData(prev => ({
      ...prev,
      [field]: sanitizedValue
    }));

    // Validate field in real-time if it's been touched
    if (touched[field]) {
      validateField(field, sanitizedValue);
    }
  }, [touched, validateField]);

  return {
    // Form data bindings
    username: formData.username,
    setUsername: (value) => handleChange("username", value),
    email: formData.email,
    setEmail: (value) => handleChange("email", value),
    password: formData.password,
    setPassword: (value) => handleChange("password", value),
    nombreUsuario: formData.nombre,
    setNombreUsuario: (value) => handleChange("nombre", value),
    apellidoUsuario: formData.apellido,
    setApellidoUsuario: (value) => handleChange("apellido", value),
    telefonoUsuario: formData.telefono,
    setTelefonoUsuario: (value) => handleChange("telefono", value),
    rolUsuario: formData.rol,
    setRolUsuario: (value) => handleChange("rol", value),
    sucursalUsuario: formData.sucursal,
    setSucursalUsuario: (value) => handleChange("sucursal", value),
    
    // Form state
    sucursales,
    errors,
    isSubmitting,
    isLoadingSucursales,
    touched,
    
    // Handlers
    handleSubmit,
    onFieldBlur: handleFieldBlur,
    validateField
  };
}
