"use client";
/**
 * Componente que renderiza el header de la página de gestión de productos,
 * incluyendo un formulario de búsqueda, un botón para agregar un producto nuevo
 * y un menú desplegable con enlaces a otras páginas del sistema.
 *
 * @param {string} searchTerm - El texto de búsqueda del formulario.
 * @param {function} setSearchTerm - La función para actualizar el estado del formulario de búsqueda.
 * @param {function} onOpenModal - La función para abrir el modal de creación de un nuevo producto.
 * @param {boolean} menuOpen - El estado del menú desplegable.
 * @param {function} setMenuOpen - La función para actualizar el estado del menú desplegable.
 * @param {function} router - La función para redirigir a otra página.
 * @returns {JSX.Element} El componente HeaderInventario.
 */
export default function HeaderInventario({
  searchTerm,
  setSearchTerm,
  onOpenModal,
  menuOpen,
  setMenuOpen,
  router,
  handleLogout,
}) {
  const links = [
    { path: "/ficha-medica", label: "Fichas Médicas" },
    { path: "/dashboard", label: "Venta" },
    { path: "/abonos", label: "Abonos" },
    { path: "/inventario", label: "Gestión de Productos" },
    { path: "/ingresos", label: "Entradas al Inventario" },
    { path: "/registro-clientes", label: "Registro de Clientes" },
    { path: "/visualizacion-reportes", label: "Visualización de Reportes" },
    { path: "/kardex", label: "Kardex" },
    { path: "/register", label: "Registrar usuario" },
  ];

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-4 justify-between items-center bg-[#712b39] text-white p-4 shadow-md border-b border-black">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-xl font-bold"
        >
          ☰
        </button>
        <h1 className="text-2xl font-bold">Gestión de Productos</h1>

        <input
          type="text"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 rounded-lg text-black bg-white w-1/3 shadow-md focus:outline-none focus:ring-2 focus:ring-[#712b39]"
        />

        <button
          onClick={onOpenModal}
          className="bg-[#F4D03F] text-black px-4 py-2 rounded-lg font-bold hover:bg-yellow-600"
        >
          Agregar Producto
        </button>
      </div>

      {menuOpen && (
        <div className="absolute top-20 left-0 bg-white shadow-lg rounded-lg w-64 z-50">
          <ul className="flex flex-col text-black">
            {links.map(({ path, label }) => (
              <li
                key={path}
                className="p-4 hover:bg-gray-200 cursor-pointer"
                onClick={() => router.push(path)}
              >
                {label}
              </li>
            ))}
            <li
              className="p-4 hover:bg-gray-200 cursor-pointer text-red-600 font-semibold"
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
