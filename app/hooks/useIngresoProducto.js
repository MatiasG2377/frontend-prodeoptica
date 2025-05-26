import { useState, useEffect } from "react";
import Swal from "sweetalert2";

/**
 * Hook para manejar el estado de la página de ingreso de productos.
 *
 * Este hook proporciona los estados y funciones necesarias para manejar
 * el formulario de ingreso de productos y sus dependencias.
 *
 *? @param {Router} router - El router de Next.js para manejar la navegación.
 *? @return {Object} Un objeto con los siguientes campos:
 *   - productos: Un array de productos.
 *   - filteredProductos: Un array de productos filtrados por el usuario.
 *   - proveedores: Un array de proveedores.
 *   - selectedProveedor: El ID del proveedor seleccionado.
 *   - setSelectedProveedor: Función para actualizar el proveedor seleccionado.
 *   - searchProducto: El texto de búsqueda del producto.
 *   - setSearchProducto: Función para actualizar el texto de búsqueda.
 *   - selectedProducto: El producto seleccionado.
 *   - setSelectedProducto: Función para actualizar el producto seleccionado.
 *   - cantidadIngreso: La cantidad a ingresar.
 *   - setCantidadIngreso: Función para actualizar la cantidad a ingresar.
 *   - costoUnitario: El costo unitario.
 *   - setCostoUnitario: Función para actualizar el costo unitario.
 *   - motivo: El motivo del ingreso.
 *   - setMotivo: Función para actualizar el motivo del ingreso.
 *   - fechaCaducidad: La fecha de caducidad.
 *   - setFechaCaducidad: Función para actualizar la fecha de caducidad.
 *   - descripcion: La descripción del producto.
 *   - setDescripcion: Función para actualizar la descripción del producto.
 *   - marca: La marca del producto.
 *   - setMarca: Función para actualizar la marca del producto.
 *   - metodoValoracion: El método de valoración.
 *   - setMetodoValoracion: Función para actualizar el método de valoración.
 *   - isLoading: Un booleano que indica si el formulario está cargando.
 *   - handleSearchProducto: Función para buscar productos.
 *   - handleIngreso: Función para registrar un ingreso.
 */
export default function useIngresoProducto(router) {
  const [productos, setProductos] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [selectedProveedor, setSelectedProveedor] = useState(null);
  const [searchProducto, setSearchProducto] = useState("");
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [cantidadIngreso, setCantidadIngreso] = useState(0);
  const [costoUnitario, setCostoUnitario] = useState("");
  const [motivo, setMotivo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [marca, setMarca] = useState("");
  const [metodoValoracion, setMetodoValoracion] = useState("Promedio");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchProveedores();
  }, []);

  /**
   * Fetches the list of products from the API and updates the state.
   *
   * Hace una petición GET a la ruta `/api/producto/` de la API y establece
   * el estado `productos` y `filteredProductos` con los datos de la respuesta.
   */
  const fetchProductos = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/productos/");
    const data = await res.json();
    const productosData = Array.isArray(data) ? data : data.results;
    setProductos(productosData);
    setFilteredProductos(productosData);
  };

  /**
   * Fetches the list of providers from the API and updates the state.
   *
   * Hace una petición GET a la ruta `/api/proveedor/` de la API y establece
   * el estado `proveedores` con los datos de la respuesta.
   */

  const fetchProveedores = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/proveedores/");
    const data = await res.json();
    setProveedores(data);
  };

  /**
   * Busca productos en la lista de productos y actualiza el estado
   * `filteredProductos` con los resultados de la búsqueda.
   *
   *? @param {string} term - El término de búsqueda.
   */
  const handleSearchProducto = async (term) => {
    setSearchProducto(term);
    if (!term.trim()) {
      setFilteredProductos([]);
      return;
    }

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/productos/buscar/?q=${term}`
      );
      const data = await res.json();
      setFilteredProductos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al buscar productos:", error);
      setFilteredProductos([]);
    }
  };

  /**
   * Restaura los valores del formulario de ingreso de productos a sus valores iniciales.
   *
   * Establece la cantidad de ingreso, costo unitario, motivo, fecha de caducidad,
   * descripción, marca, proveedor seleccionado, término de búsqueda y producto seleccionado
   * a sus valores por defecto.
   */

  const resetFormulario = () => {
    setCantidadIngreso(0);
    setCostoUnitario("");
    setMotivo("");
    setDescripcion("");
    setMarca("");
    setSelectedProveedor(null);
    setSearchProducto("");
    setSelectedProducto(null);
  };

  /**
   * Registra un ingreso de productos en el inventario.
   *
   * Primero verifica si el usuario está autenticado. Si no lo está, muestra un
   * mensaje de error y no hace nada más.
   *
   * Luego verifica si se han completado todos los campos obligatorios del
   * formulario. Si no es así, muestra un mensaje de error y no hace nada más.
   *
   * Si todo está bien, actualiza el producto seleccionado en la base de datos
   * con la nueva cantidad y registra un movimiento de inventario con el tipo
   * "Entrada". También registra un kardex con el tipo "Entrada" y el costo
   * unitario y total del producto. Si se proporciona una fecha de caducidad,
   * registra un lote con esa fecha y lo asocia al kardex.
   *
   * Si ocurre un error al registrar el ingreso, muestra un mensaje de error
   * con la descripción del error.
   *
   *? @return {Promise<void>} Nada.
   */
  const handleIngreso = async () => {
    const usuarioId = localStorage.getItem("userId");
    if (!usuarioId) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Usuario no autenticado. Inicie sesión nuevamente.",
        confirmButtonColor: "#712b39",
      });

      return;
    }

    if (
      !selectedProducto ||
      !cantidadIngreso ||
      !costoUnitario ||
      !selectedProveedor
    ) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor, complete todos los campos obligatorios.",
        confirmButtonColor: "#712b39",
      });

      return;
    }

    setIsLoading(true);

    try {
      const cantidad = parseInt(cantidadIngreso, 10);
      const costo = parseFloat(costoUnitario);
      const productoActualizado = {
        ...selectedProducto,
        cantidad_producto: selectedProducto.cantidad_producto + cantidad,
        descripcion_producto:
          descripcion || selectedProducto.descripcion_producto,
        marca_producto: marca || selectedProducto.marca_producto,
        metodo_valoracion: metodoValoracion,
      };

      await fetch(
        `http://127.0.0.1:8000/api/productos/${selectedProducto.id}/`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productoActualizado),
        }
      );

      await fetch("http://127.0.0.1:8000/api/movimiento/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          producto_movimientoInventario: selectedProducto.id,
          usuario_movimientoInventario: usuarioId,
          tipo_movimientoInventario: "Entrada",
          cantidad_movimientoInventario: cantidad,
          motivo_movimientoInventario: motivo,
        }),
      });

      const kardexPayload = {
        producto_kardex: selectedProducto.id,
        tipo_kardex: "Entrada",
        cantidad_kardex: cantidad,
        costo_unitario_kardex: costo.toFixed(2),
        costo_total_kardex: (cantidad * costo).toFixed(2),
        saldo_cantidad_kardex: productoActualizado.cantidad_producto,
        saldo_costo_kardex: (
          productoActualizado.cantidad_producto * costo
        ).toFixed(2),
        referencia_kardex: motivo,
      };

      await fetch("http://127.0.0.1:8000/api/kardex/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(kardexPayload),
      });

      Swal.fire({
        icon: "success",
        title: "Éxito",
        text: "Ingreso registrado correctamente.",
        confirmButtonColor: "#712b39",
      });
      resetFormulario();
      fetchProductos();
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al registrar el ingreso.",
        confirmButtonColor: "#712b39",
      });
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchProducto.trim()) {
        handleSearchProducto(searchProducto);
      } else {
        setFilteredProductos([]);
      }
    }, 400); // debounce de 400ms

    return () => clearTimeout(timeoutId); // limpia el timeout si cambia el input antes de que termine
  }, [searchProducto]);

  return {
    productos,
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
    descripcion,
    setDescripcion,
    marca,
    setMarca,
    metodoValoracion,
    setMetodoValoracion,
    isLoading,
    handleSearchProducto,
    handleIngreso,
  };
}
