"use client";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Menu,
  X,
  Stethoscope,
  ShoppingBag,
  CreditCard,
  Package,
  ArrowDownLeft,
  FileSpreadsheet,
  Layers,
  UserPlus,
  LogOut,
  User,
  Search,
  LayoutDashboard,
} from "lucide-react";

export default function Header({
  title = "Prodeóptica",
  search,
  setSearch,
  menuOpen,
  setMenuOpen,
  handleLogout,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("usuario_info");
      if (stored) {
        setUsuario(JSON.parse(stored));
      }
    } catch (e) {}
  }, []);

  const navItems = [
    { label: "Dashboard Resumen", path: "/dashboard", icon: LayoutDashboard },
    { label: "Punto de Venta", path: "/dashboard?tab=pos", icon: ShoppingBag },
    { label: "Fichas Médicas", path: "/ficha-medica", icon: Stethoscope },
    { label: "Ventas y Abonos", path: "/abonos", icon: CreditCard },
    { label: "Gestión de Productos", path: "/inventario", icon: Package },
    { label: "Entradas Inventario", path: "/ingresos", icon: ArrowDownLeft },
    { label: "Kardex", path: "/kardex", icon: Layers },
    { label: "Registros / CRUD", path: "/CRUD", icon: FileSpreadsheet },
    { label: "Registrar Usuario", path: "/register", icon: UserPlus },
  ];

  return (
    <header className="relative z-40 bg-[#712b39] text-white shadow-md">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Lado izquierdo: Botón Menú + Título */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 rounded-lg hover:bg-white/10 active:scale-95 transition"
            aria-label="Menú principal de navegación"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight">{title}</h1>
            <p className="text-[11px] text-white/70 hidden sm:block">Sistema de Gestión Óptica</p>
          </div>
        </div>

        {/* Centro: Barra de búsqueda opcional */}
        {setSearch !== undefined && (
          <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar productos por nombre, código o marca..."
                value={search || ""}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 bg-white text-gray-900 placeholder-gray-400 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#712b39] shadow-inner"
              />
            </div>
          </div>
        )}

        {/* Lado derecho: Información del usuario activo */}
        <div className="flex items-center gap-3">
          {usuario && (
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold leading-tight truncate max-w-[150px]">
                {usuario.first_name || usuario.username_usuario || usuario.username}
              </span>
              <span className="text-[10px] text-white/80 font-medium">
                {usuario.rol || "Personal"} • Sucursal {usuario.sucursal || 1}
              </span>
            </div>
          )}
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white shadow-inner">
            <User className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Menú Lateral Desplegable */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40"
            onClick={() => setMenuOpen(false)}
          />
          <nav className="absolute top-full left-0 w-72 bg-white text-gray-800 shadow-2xl rounded-br-2xl border-r border-b border-gray-200 z-50 overflow-hidden animate-in slide-in-from-left duration-200">
            <div className="p-3 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#712b39] text-white flex items-center justify-center text-xs font-bold">
                P
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-gray-900 truncate">Prodeóptica</p>
                <p className="text-[10px] text-gray-500">Módulos de Sistema</p>
              </div>
            </div>

            <ul className="py-2 text-sm">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path || (item.path !== "/" && pathname?.startsWith(item.path));

                return (
                  <li key={item.path}>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        router.push(item.path);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 font-medium text-left transition ${
                        isActive
                          ? "bg-rose-50/80 text-[#712b39] font-bold border-l-4 border-[#712b39]"
                          : "hover:bg-gray-100 text-gray-700 hover:text-[#712b39]"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? "text-[#712b39]" : "text-gray-500"}`} />
                      <span>{item.label}</span>
                    </button>
                  </li>
                );
              })}

              <li className="border-t border-gray-100 mt-2 pt-2">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-red-600 font-semibold text-left transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar Sesión</span>
                </button>
              </li>
            </ul>
          </nav>
        </>
      )}
    </header>
  );
}
