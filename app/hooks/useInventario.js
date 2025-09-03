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
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
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
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

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

  const handleSessionExpired = () => {
    if (window.__isRedirectingToLogin) return true;
    window.__isRedirectingToLogin = true;
    
    // Limpiar token
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem("access_token");
    }
    
    // Redirigir al login
    window.location.href = "/login?session_expired=1";
    return true;
  };

  const cargarProductos = async () => {
    try {
      setLoading(true);
      const data = await fetchProductos();
      setProductos(data.map(normalizarProducto));
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        handleSessionExpired();
        return;
      }
      
      console.error('Error cargando productos:', error);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al cargar los productos.",
        confirmButtonColor: "#7d2a3f",
      });
    } finally {
      setLoading(false);
    }
  };
  const normalizarProducto = (producto) => ({
    ...producto,
    imagen_producto: producto.imagen_url || null, // ⚡ usa la URL que ya viene del backend
  });

  const buscarProductos = async (search) => {
    try {
      setLoading(true);
      const data = await fetchProductosBuscados(search);
      setProductos(data.map(normalizarProducto));
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        handleSessionExpired();
        return;
      }
      
      console.error('Error buscando productos:', error);
      await Swal.fire({
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
      console.error('Error al cargar categorías:', error);
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        handleSessionExpired();
        return;
      }
      
      await Swal.fire({
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
      console.error('Error al cargar proveedores:', error);
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        handleSessionExpired();
        return;
      }
      
      await Swal.fire({
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
      // Crear un FormData completamente nuevo
      const form = new FormData();

      // Agregar campos como strings simples
      form.append("nombre_producto", formData.nombre_producto || "");
      form.append("codigo_producto", formData.codigo_producto || "");
      form.append("descripcion_producto", formData.descripcion_producto || "");
      form.append("marca_producto", formData.marca_producto || "");
      form.append("categoria_producto", formData.categoria_producto || "");
      form.append("pvp_producto", formData.pvp_producto || 0);
      form.append("costo_producto", formData.costo_producto || 0);
      form.append("cantidad_producto", formData.cantidad_producto || 0);
      form.append("minimo_producto", formData.minimo_producto || 0);
      form.append("maximo_producto", formData.maximo_producto || 0);
      form.append("controla_stock", formData.controla_stock ? "1" : "0");
      form.append("proveedor_producto", formData.proveedor_producto || "");

      // Agregar la imagen al final si existe
      if (file) {
        form.append("imagen", file);
      }

      const loadingSwal = Swal.fire({
        title: 'Eliminando...',
        text: 'Por favor espera mientras eliminamos el producto.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      try {
        await eliminarProducto(id);
        await loadingSwal.close();
        await cargarProductos();
        await Swal.fire({
          title: "¡Eliminado!",
          text: "El producto ha sido eliminado correctamente.",
          icon: "success",
          confirmButtonColor: "#712b39",
          timer: 2000,
          timerProgressBar: true,
        });
      } catch (error) {
        await loadingSwal.close();
        throw error; // Re-lanzar el error para manejarlo en el catch externo
      }
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        return handleSessionExpired();
      }
      
      const errorMessage = error.response?.data?.detail || 
                         error.message || 
                         "No se pudo eliminar el producto. Por favor, inténtalo de nuevo.";
      
      await Swal.fire({
        title: "Error",
        text: errorMessage,
        icon: "error",
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
        // Mostrar loader mientras se elimina
        const loadingSwal = Swal.fire({
          title: 'Eliminando...',
          text: 'Por favor espera mientras eliminamos el producto.',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        try {
          await eliminarProducto(id);
          await loadingSwal.close();
          await cargarProductos();
          await Swal.fire({
            title: "¡Eliminado!",
            text: "El producto ha sido eliminado correctamente.",
            icon: "success",
            confirmButtonColor: "#712b39",
            timer: 2000,
            timerProgressBar: true,
          });
        } catch (error) {
          await loadingSwal.close();
          throw error; // Re-lanzar el error para manejarlo en el catch externo
        }
      } catch (error) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          return handleSessionExpired();
        }
        
        const errorMessage = error.response?.data?.detail || 
                           error.message || 
                           "No se pudo eliminar el producto. Por favor, inténtalo de nuevo.";
        
        await Swal.fire({
          title: "Error",
          text: errorMessage,
          icon: "error",
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
