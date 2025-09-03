"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import LoginForm from "../components/login/LoginForm";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Mostrar mensaje de sesión expirada si viene el parámetro
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('session_expired')) {
      Swal.fire({
        icon: 'warning',
        title: 'Sesión expirada',
        text: 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.',
        confirmButtonColor: '#712b39',
      });
    }
  }, []);

  const redirectToAdminLogin = () => {
    // Este sí queda en localhost porque solo lo usarías en local para Django admin
    window.location.href = "http://127.0.0.1:8000/admin/login/?next=/admin/";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${BASE_URL}/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Para el endpoint de login, siempre mostramos credenciales incorrectas
        // independientemente del código de estado del error
        throw new Error("Usuario o contraseña incorrectos");
      }

      // ✅ Guardar tokens y datos del usuario
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      localStorage.setItem("usuario_info", JSON.stringify(data.usuario));

      Swal.fire({
        icon: "success",
        title: "Sesión iniciada",
        text: `Bienvenido, ${data.usuario.username_usuario}`,
        confirmButtonColor: "#712b39",
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/dashboard");
        }
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "No se pudo iniciar sesión.",
        confirmButtonColor: "#712b39",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 relative">
      <button
        onClick={redirectToAdminLogin}
        className="absolute top-4 right-4 px-4 py-2 text-sm rounded-lg transition border-2 border-[#712b39] text-[#712b39] hover:bg-[#712b39] hover:text-white"
      >
        Acceso Administrador
      </button>

      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <img src="/img/logo.webp" alt="Logo de la empresa" className="h-16" />
        </div>
        <h1 className="text-2xl font-bold mb-6 text-center text-[#712b39]">
          Iniciar Sesión
        </h1>

        <LoginForm
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
          handleSubmit={handleSubmit}
        />

        <p className="text-sm text-center text-gray-600 mt-4">
          ¿Eres un nuevo empleado? Contacta a tu administrador.
        </p>
      </div>
    </div>
  );
}
