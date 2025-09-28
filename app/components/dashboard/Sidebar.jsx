/**
 * Sidebar que muestra las categorías.
 *
 *? @param {Array} categorias - Listado de categorías.
 *? @param {Number} selectedCategoria - ID de la categoría seleccionada.
 *? @param {Function} setSelectedCategoria - Función para asignar la categoría seleccionada.
 *? @returns {ReactElement} Componente Sidebar.
 */
export default function Sidebar({
  categorias,
  selectedCategoria,
  setSelectedCategoria,
}) {
  return (
    <div
      className="hidden md:flex md:w-1/5 bg-[#712b39] text-white flex-col border-r border-black h-full"
      style={{ minWidth: "200px" }}
    >
      <div className="flex-1 flex items-center">
        <ul className="w-full">
          <li
            className={`p-4 cursor-pointer text-center ${
              selectedCategoria === null
                ? "bg-[#fcda11] text-black font-bold"
                : "hover:bg-[#5e242e]"
            }`}
            onClick={() => setSelectedCategoria(null)}
          >
            Todas las Categorías
          </li>
          {categorias.map((categoria) => (
            <li
              key={categoria.id}
              className={`p-4 cursor-pointer text-center ${
                selectedCategoria === categoria.id
                  ? "bg-[#fcda11] text-black font-bold"
                  : "hover:bg-[#5e242e]"
              }`}
              onClick={() => setSelectedCategoria(categoria.id)}
            >
              {categoria.nombre_categoria}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
