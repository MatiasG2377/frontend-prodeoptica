import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  fetchProductos,
  fetchProveedores,
  updateProducto,
  registrarMovimiento,
  registrarKardex,
  buscarProductos,
} from "../services/ingresoService";

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
    cargarProveedores();
  }, []);

  const cargarProveedores = async () => {
    try {
      const data = await fetchProveedores();
      setProveedores(data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al cargar los proveedores.",
        confirmButtonColor: "#7d2a3f",
      });
    }
  };

  const cargarProductos = async () => {
    try {
      const data = await fetchProductos();
      setProductos(data);
      setFilteredProductos(data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al cargar los productos.",
        confirmButtonColor: "#7d2a3f",
      });
    }
  };

  const handleSearchProducto = async (term) => {
    setSearchProducto(term);
    if (!term.trim()) {
      setFilteredProductos([]);
      return;
    }

    try {
      const data = await buscarProductos(term);
      setFilteredProductos(Array.isArray(data) ? data : []);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al buscar los productos.",
        confirmButtonColor: "#7d2a3f",
      });
      setFilteredProductos([]);
    }
  };

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

  const handleIngreso = async () => {
    if (!selectedProducto) {
      Swal.fire({
        icon: "warning",
        title: "Producto no seleccionado",
        text: "Por favor, selecciona un producto para el ingreso.",
        confirmButtonColor: "#712b39",
      });
      return;
    }

    if (!selectedProveedor) {
      Swal.fire({
        icon: "warning",
        title: "Proveedor no seleccionado",
        text: "Debes seleccionar un proveedor.",
        confirmButtonColor: "#712b39",
      });
      return;
    }

    if (!cantidadIngreso || parseInt(cantidadIngreso) <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Cantidad inválida",
        text: "La cantidad debe ser un número mayor a 0.",
        confirmButtonColor: "#712b39",
      });
      return;
    }

    if (!costoUnitario || parseFloat(costoUnitario) <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Costo inválido",
        text: "El costo unitario debe ser un número mayor a 0.",
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

      await updateProducto(selectedProducto.id, productoActualizado);

      await registrarMovimiento({
        producto_movimientoInventario: selectedProducto.id,
        tipo_movimientoInventario: "Entrada",
        cantidad_movimientoInventario: cantidad,
        motivo_movimientoInventario: motivo,
      });

      await registrarKardex({
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
      });

      Swal.fire({
        icon: "success",
        title: "Éxito",
        text: "Ingreso registrado correctamente.",
        confirmButtonColor: "#712b39",
      });

      resetFormulario();
      cargarProductos();
    } catch (error) {
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
    }, 400);

    return () => clearTimeout(timeoutId);
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
