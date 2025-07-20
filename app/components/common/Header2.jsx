"use client";
import { useRouter } from "next/navigation";

export default function Header({ title, menuOpen, setMenuOpen, handleLogout }) {
  const router = useRouter();

  return (
    <div className="relative">
      <div className="flex justify-between items-center bg-[#712b39] text-white p-4 shadow-md border-b border-black">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-xl font-bold"
        >
          ☰
        </button>
        <h1 className="text-2xl font-bold mx-auto">{title}</h1>
        <div className="w-6" /> {/* Espaciador visual */}
      </div>

      {menuOpen && (
        <div className="absolute top-16 left-0 bg-white shadow-lg rounded-lg w-64 z-50">
          <ul className="flex flex-col text-black">
            <li
              className="p-4 hover:bg-gray-200 cursor-pointer"
              onClick={() => router.push("/ficha-medica")}
            >
              Fichas Médicas
            </li>
            <li
              className="p-4 hover:bg-gray-200 cursor-pointer"
              onClick={() => router.push("/dashboard")}
            >
              Venta
            </li>
            <li
              className="p-4 hover:bg-gray-200 cursor-pointer"
              onClick={() => router.push("/abonos")}
            >
              Ventas y Abonos
            </li>
            <li
              className="p-4 hover:bg-gray-200 cursor-pointer"
              onClick={() => router.push("/inventario")}
            >
              Gestión de Productos
            </li>
            <li
              className="p-4 hover:bg-gray-200 cursor-pointer"
              onClick={() => router.push("/ingresos")}
            >
              Entradas al Inventario
            </li>
            <li
              className="p-4 hover:bg-gray-200 cursor-pointer"
              onClick={() => router.push("/CRUD")}
            >
              Gestión de registros
            </li>
            <li
              className="p-4 hover:bg-gray-200 cursor-pointer"
              onClick={() => router.push("/kardex")}
            >
              Kardex
            </li>
            <li
              className="p-4 hover:bg-gray-200 cursor-pointer"
              onClick={() => router.push("/register")}
            >
              Registrar usuario
            </li>
            <li
              className="p-4 hover:bg-gray-200 cursor-pointer"
              onClick={handleLogout}
            >
              Cerrar Sesión
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
