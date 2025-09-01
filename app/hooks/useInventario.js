"use client";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  fetchProductos,
  fetchProductosBuscados,
  fetchCategorias,
  fetchProveedores,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from "../services/productoService";

export default function useInventario() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [formData, setFormData] = useState({
    nombre_producto: "",
    codigo_producto: "",
    descripcion_producto: "",
    marca_producto: "",
    categoria_producto: "",
    pvp_producto: "",
    costo_producto: "",
    cantidad_producto: "",
    minimo_producto: "",
    maximo_producto: "",
    controla_stock: false,
    proveedor_producto: "",
    imagen_producto: "",
  });
  const [file, setFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Debounce de búsqueda
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedSearch === "") {
      cargarProductos();
    } else {
      buscarProductos(debouncedSearch);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    cargarCategorias();
    cargarProveedores();
  }, []);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      const data = await fetchProductos();
      setProductos(data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al cargar los productos.",
        confirmButtonColor: "#7d2a3f",
      });
    } finally {
      setLoading(false);
    }
  };

  const buscarProductos = async (search) => {
    try {
      setLoading(true);
      const data = await fetchProductosBuscados(search);
      setProductos(data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al buscar los productos.",
        confirmButtonColor: "#7d2a3f",
      });
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  const cargarCategorias = async () => {
    try {
      const data = await fetchCategorias();
      setCategorias(data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al cargar las categorías.",
        confirmButtonColor: "#7d2a3f",
      });
    }
  };

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

  const resetForm = () => {
    setFormData({
      nombre_producto: "",
      codigo_producto: "",
      descripcion_producto: "",
      marca_producto: "",
      categoria_producto: "",
      pvp_producto: "",
      costo_producto: "",
      cantidad_producto: "",
      minimo_producto: "",
      maximo_producto: "",
      controla_stock: false,
      proveedor_producto: "",
      imagen_producto: "",
    });
    setFile(null);
  };

  const handleAddOrUpdateProducto = async () => {
    const nombreValido =
      formData.nombre_producto && formData.nombre_producto.trim() !== "";
    const pvpValido =
      formData.pvp_producto !== null &&
      formData.pvp_producto !== "" &&
      !isNaN(parseFloat(formData.pvp_producto));

    if (!nombreValido || !pvpValido) {
      Swal.fire({
        icon: "warning",
        title: "Campos obligatorios incompletos",
        text: "Por favor, completa el nombre del producto y el PVP.",
        confirmButtonColor: "#712b39",
      });
      return;
    }

    try {
      // Payload original
      const payload = {
        nombre_producto: formData.nombre_producto,
        codigo_producto: formData.codigo_producto,
        descripcion_producto: formData.descripcion_producto,
        marca_producto: formData.marca_producto,
        categoria_producto: parseInt(formData.categoria_producto) || null,
        pvp_producto: parseFloat(formData.pvp_producto),
        costo_producto: parseFloat(formData.costo_producto),
        cantidad_producto: parseInt(formData.cantidad_producto),
        minimo_producto: parseInt(formData.minimo_producto),
        maximo_producto: parseInt(formData.maximo_producto),
        controla_stock: !!formData.controla_stock,
        proveedor_producto: parseInt(formData.proveedor_producto) || null,
        imagen_producto: formData.imagen_producto, // inicializamos con valor existente
      };

      // Si hay archivo, usamos FormData para enviar imagen
      let bodyToSend;
      if (file) {
        const form = new FormData();
        Object.entries(payload).forEach(([key, value]) => {
          if (value !== null && value !== undefined) form.append(key, value);
        });
        form.append("imagen", file);
        bodyToSend = form;
      } else {
        bodyToSend = payload;
      }

      if (selectedProducto) {
        await actualizarProducto(selectedProducto.id, bodyToSend);
        Swal.fire({
          icon: "success",
          title: "Producto actualizado",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        await crearProducto(bodyToSend);
        Swal.fire({
          icon: "success",
          title: "Producto creado",
          showConfirmButton: false,
          timer: 1500,
        });
      }

      cargarProductos();
      setModalVisible(false);
      setSelectedProducto(null);
      resetForm();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al guardar",
        text: error?.detail || "Ocurrió un error. Verifica los datos enviados.",
        confirmButtonColor: "#712b39",
      });
    }
  };

  const handleEditProducto = (producto) => {
    setSelectedProducto(producto);
    setFormData({
      ...producto,
      categoria_producto:
        producto.categoria_producto?.id || producto.categoria_producto || "",
      proveedor_producto:
        producto.proveedor_producto?.id || producto.proveedor_producto || "",
      controla_stock: producto.controla_stock || false,
    });
    setModalVisible(true);
  };

  const handleDeleteProducto = async (id) => {
    const confirmResult = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el producto permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#712b39",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirmResult.isConfirmed) {
      try {
        await eliminarProducto(id);
        Swal.fire({
          icon: "success",
          title: "Producto eliminado",
          confirmButtonColor: "#712b39",
        });
        cargarProductos();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo eliminar el producto.",
          confirmButtonColor: "#712b39",
        });
      }
    }
  };

  const handleOpenModal = () => {
    setSelectedProducto(null);
    resetForm();
    setModalVisible(true);
  };

  return {
    productos,
    categorias,
    proveedores,
    selectedProducto,
    formData,
    setFormData,
    file,
    setFile,
    modalVisible,
    setModalVisible,
    searchTerm,
    setSearchTerm,
    handleOpenModal,
    handleAddOrUpdateProducto,
    handleEditProducto,
    handleDeleteProducto,
    loading,
  };
}
