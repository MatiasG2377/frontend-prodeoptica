/**
 * Componente que renderiza un formulario para registrar un ingreso de productos al inventario.
 *
 * Este componente recibe las siguientes props:
 * - `filteredProductos`: Un array de productos filtrados por el usuario.
 * - `proveedores`: Un array de proveedores.
 * - `selectedProveedor`: El ID del proveedor seleccionado.
 * - `setSelectedProveedor`: Función para actualizar el proveedor seleccionado.
 * - `searchProducto`: El texto de búsqueda del producto.
 * - `selectedProducto`: El producto seleccionado.
 * - `setSelectedProducto`: Función para actualizar el producto seleccionado.
 * - `cantidadIngreso`: La cantidad a ingresar.
 * - `setCantidadIngreso`: Función para actualizar la cantidad a ingresar.
 * - `costoUnitario`: El costo unitario.
 * - `setCostoUnitario`: Función para actualizar el costo unitario.
 * - `motivo`: El motivo del ingreso.
 * - `setMotivo`: Función para actualizar el motivo del ingreso.
 * - `fechaCaducidad`: La fecha de caducidad.
 * - `setFechaCaducidad`: Función para actualizar la fecha de caducidad.
 * - `descripcion`: La descripción del producto.
 * - `setDescripcion`: Función para actualizar la descripción del producto.
 * - `marca`: La marca del producto.
 * - `setMarca`: Función para actualizar la marca del producto.
 * - `metodoValoracion`: El método de valoración.
 * - `setMetodoValoracion`: Función para actualizar el método de valoración.
 * - `isLoading`: Un booleano que indica si el formulario está cargando.
 * - `handleSearchProducto`: Función para buscar productos.
 * - `handleIngreso`: Función para registrar un ingreso.
 */

export default function FormularioIngreso({
  filteredProductos,
  proveedores,
  selectedProveedor,
  setSelectedProveedor,
  searchProducto,
  setSearchProducto,
  selectedProducto,
  setSelectedProducto,
  cantidadIngreso,
  setCantidadIngreso,
  costoUnitario,
  setCostoUnitario,
  motivo,
  setMotivo,
  isLoading,
  handleIngreso,
}) {
  return (
    <div className="w-full bg-white shadow-md rounded-lg p-6 sm:p-8 mt-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Buscar y seleccionar producto */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-4">
          <label className="block text-gray-700 font-bold mb-2">
            Seleccionar Producto
          </label>
          <input
            type="text"
            className="w-full p-3 border rounded-lg mb-4"
            placeholder="Buscar producto..."
            value={searchProducto}
            onChange={(e) => {
              if (e.target.value.length <= 60) {
                setSearchProducto(e.target.value);
              }
            }}
            maxLength={60}
          />
          <div className="text-xs text-gray-500 text-right">
            {searchProducto?.length || 0}/60 caracteres
          </div>
          {filteredProductos.length > 0 && (
            <ul className="max-h-40 overflow-y-auto border rounded-lg shadow-md">
              {filteredProductos.map((producto) => (
                <li
                  key={producto.id}
                  className={`p-3 cursor-pointer hover:bg-gray-100 ${
                    selectedProducto?.id === producto.id ? "bg-gray-200" : ""
                  }`}
                  onClick={() => setSelectedProducto(producto)}
                >
                  {producto.nombre_producto}
                </li>
              ))}
            </ul>
          )}
          {selectedProducto && (
            <div className="mt-4">
              <p className="text-lg font-semibold text-gray-700">
                Producto Seleccionado:{" "}
                <span className="text-gray-900">
                  {selectedProducto.nombre_producto}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Proveedor */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-2">
          <label className="block text-gray-700 font-bold mb-2">
            Seleccionar Proveedor
          </label>
          <select
            className="w-full p-3 border rounded-lg mb-4"
            value={selectedProveedor || ""}
            onChange={(e) => setSelectedProveedor(e.target.value)}
          >
            <option value="">Seleccionar proveedor...</option>
            {proveedores.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre_proveedor}
              </option>
            ))}
          </select>
        </div>

        {/* Cantidad y Costo */}
        <div className="col-span-1">
          <label className="block text-gray-700 font-bold mb-2">Cantidad</label>
          <input
            type="number"
            className="w-full p-3 border rounded-lg"
            placeholder="Cantidad a ingresar"
            value={cantidadIngreso}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '' || (parseInt(value) >= 0 && value >= 0)) {
                setCantidadIngreso(value);
              }
            }}
            min="0"
            onKeyDown={(e) => {
              if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                e.preventDefault();
              }
            }}
          />
        </div>
        <div className="col-span-1">
          <label className="block text-gray-700 font-bold mb-2">
            Costo Unitario
          </label>
          <input
            type="number"
            className="w-full p-3 border rounded-lg"
            placeholder="Costo unitario"
            value={costoUnitario}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '' || (parseFloat(value) >= 0 && value >= 0)) {
                setCostoUnitario(value);
              }
            }}
            min="0"
            step="0.01"
            onKeyDown={(e) => {
              if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                e.preventDefault();
              }
            }}
          />
        </div>

        {/* Motivo */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-4">
          <label className="block text-gray-700 font-bold mb-2">
            Motivo del Ingreso
          </label>
          <textarea
            className="w-full p-3 border rounded-lg"
            placeholder="Motivo del ingreso"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
          />
        </div>
      </div>

      {/* Botón */}
      <div className="mt-6">
        <button
          onClick={handleIngreso}
          className={`w-full bg-[#712b39] text-white py-3 rounded-lg hover:bg-[#5e242e] ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Registrando..." : "Registrar Ingreso"}
        </button>
      </div>
    </div>
  );
}
