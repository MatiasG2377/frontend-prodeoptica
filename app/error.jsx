"use client";
import React, { useEffect } from "react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

/**
 * Límite de error global para capturar excepciones no controladas en el App Router.
 * Evita la pantalla blanca de muerte y ofrece un mecanismo de recuperación ('reset').
 */
export default function GlobalError({ error, reset }) {
  useEffect(() => {
    // Registro del error en consola o servicio de monitoreo
    console.error("Error no controlado en la aplicación:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full p-8 rounded-2xl shadow-xl border border-gray-100 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>

        <h2 className="text-xl font-bold text-gray-900 tracking-tight">
          Ocurrió un problema inesperado
        </h2>

        <p className="text-sm text-gray-500 leading-relaxed">
          {error?.message ||
            "No se pudo cargar la vista solicitada. Intenta reintentar la acción o volver al inicio."}
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#712b39] hover:bg-[#5e242e] text-white text-sm font-bold shadow-sm transition active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reintentar</span>
          </button>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold transition active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span>Ir al Inicio</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

