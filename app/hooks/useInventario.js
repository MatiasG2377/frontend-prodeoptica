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

  // Debounce
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
      console.error("Error cargando productos:", error);
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
      console.error("Error buscando productos:", error);
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
      console.error("Error cargando categorías:", error);
    }
  };

  const cargarProveedores = async () => {
    try {
      const data = await fetchProveedores();
      setProveedores(data);
    } catch (error) {
      console.error("Error cargando proveedores:", error);
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

  const uploadImageToCloudinary = async () => {
    if (!file) return formData.imagen_producto;
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    const cloudData = new FormData();
    cloudData.append("file", file);
    cloudData.append("upload_preset", uploadPreset);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: cloudData }
    );
    const data = await res.json();
    return data.secure_url;
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
      const imageUrl = await uploadImageToCloudinary();
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
        imagen_producto: imageUrl,
      };

      if (selectedProducto) {
        await actualizarProducto(selectedProducto.id, payload);
        Swal.fire({
          icon: "success",
          title: "Producto actualizado",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        await crearProducto(payload);
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
      console.error(error);
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
