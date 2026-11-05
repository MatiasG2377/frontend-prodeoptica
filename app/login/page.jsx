"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import LoginForm from "../components/login/LoginForm";
import { toastSuccess } from "../utils/toastAlert";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mostrar mensaje de sesión expirada si viene el parámetro
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("session_expired")) {
      Swal.fire({
        icon: "warning",
        title: "Sesión expirada",
        text: "Tu sesión ha expirado. Por favor inicia sesión nuevamente.",
        confirmButtonColor: "#712b39",
      });
    }
  }, []);

  const redirectToAdminLogin = () => {
    const adminBase = BASE_URL.replace(/\/api\/?$/, "");
    window.location.href = `${adminBase}/admin/login/?next=/admin/`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const res = await fetch(`${BASE_URL}/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Usuario o contraseña incorrectos");
      }

      // ✅ Guardar tokens y datos del usuario
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      localStorage.setItem("usuario_info", JSON.stringify(data.usuario));

      // Feedback rápido no bloqueante y redirección fluida
      toastSuccess(`¡Bienvenido, ${data.usuario.first_name || data.usuario.username_usuario || "usuario"}!`);
      router.push("/dashboard");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error de acceso",
        text: error.message || "No se pudo iniciar sesión.",
        confirmButtonColor: "#712b39",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 relative px-4">
      <button
        onClick={redirectToAdminLogin}
        className="absolute top-4 right-4 px-4 py-2 text-xs md:text-sm font-semibold rounded-lg transition border-2 border-[#712b39] text-[#712b39] hover:bg-[#712b39] hover:text-white active:scale-95 shadow-sm"
      >
        Acceso Administrador
      </button>

      <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 w-full max-w-sm border border-gray-100">
        <div className="flex justify-center mb-6">
          <img src="/img/logo.webp" alt="Logo de Prodeóptica" className="h-16 object-contain" />
        </div>
        <h1 className="text-2xl font-black mb-1 text-center text-[#712b39] tracking-tight">
          Iniciar Sesión
        </h1>
        <p className="text-xs text-center text-gray-500 mb-6">
          Ingresa tus credenciales del sistema
        </p>

        <LoginForm
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
          handleSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />

        <p className="text-xs text-center text-gray-500 mt-6 pt-4 border-t border-gray-100">
          ¿Eres un nuevo empleado? Contacta a tu administrador.
        </p>
      </div>
    </div>
  );
}
