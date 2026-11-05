import React from "react";
import Link from "next/link";
import { FileQuestion, ShoppingBag } from "lucide-react";

/**
 * Vista 404 personalizada de Next.js App Router para Prodeóptica.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full p-8 rounded-2xl shadow-xl border border-gray-100 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-[#712b39] flex items-center justify-center mx-auto">
          <FileQuestion className="w-8 h-8" />
        </div>

        <h1 className="text-3xl font-black text-[#712b39] tracking-tight">404</h1>
        <h2 className="text-lg font-bold text-gray-800">
          Página no encontrada
        </h2>

        <p className="text-sm text-gray-500 leading-relaxed">
          La ruta que estás buscando no existe o fue trasladada. Verifica la URL o regresa al Punto de Venta.
        </p>

        <div className="pt-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#712b39] hover:bg-[#5e242e] text-white text-sm font-bold shadow-sm transition active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Volver al Punto de Venta</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

