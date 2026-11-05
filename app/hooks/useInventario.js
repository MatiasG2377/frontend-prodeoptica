"use client";
import { use, useCallback, useEffect, useState } from "react";
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
import { getErrorMessage } from "../utils/apiError";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const esSesionExpirada = (error) => error?.status === 401 || error?.status === 403;

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

  const handleSessionExpired = useCallback(() => {
    if (window.__isRedirectingToLogin) return true;
    window.__isRedirectingToLogin = true;

    // Limpiar token
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.removeItem("access_token");
    }

    // Redirigir al login
    window.location.href = "/login?session_expired=1";
    return true;
  }, []);

  const cargarProductos = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchProductos();
      setProductos(data.map(normalizarProducto));
    } catch (error) {
      if (esSesionExpirada(error)) {
        handleSessionExpired();
        return;
      }

      console.error("Error cargando productos:", error);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: getErrorMessage(error),
        confirmButtonColor: "#7d2a3f",
      });
    } finally {
      setLoading(false);
    }
  }, []);
  // Debounce de búsqueda
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  // Cargar datos iniciales
  useEffect(() => {
    const cargarDatos = async () => {
      await cargarProductos();
      await cargarCategorias();
      await cargarProveedores();
    };
    cargarDatos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Efecto para búsqueda
  useEffect(() => {
    if (debouncedSearch === "") {
      cargarProductos();
    } else {
      buscarProductos(debouncedSearch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const normalizarProducto = (producto) => ({
    ...producto,
    imagen_producto: producto.imagen_url || null, // ⚡ usa la URL que ya viene del backend
  });

  const buscarProductos = useCallback(async (search) => {
    try {
      setLoading(true);
      const data = await fetchProductosBuscados(search);
      setProductos(data.map(normalizarProducto));
    } catch (error) {
      if (esSesionExpirada(error)) {
        handleSessionExpired();
        return;
      }

      console.error("Error buscando productos:", error);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: getErrorMessage(error),
        confirmButtonColor: "#7d2a3f",
      });
      setProductos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const cargarCategorias = useCallback(async () => {
    try {
      const data = await fetchCategorias();
      setCategorias(data);
    } catch (error) {
      console.error("Error al cargar categorías:", error);

      if (esSesionExpirada(error)) {
        handleSessionExpired();
        return;
      }

      await Swal.fire({
        icon: "error",
        title: "Error",
        text: getErrorMessage(error),
        confirmButtonColor: "#7d2a3f",
      });
    }
  }, []);

  const cargarProveedores = useCallback(async () => {
    try {
      const data = await fetchProveedores();
      setProveedores(data);
    } catch (error) {
      console.error("Error al cargar proveedores:", error);

      if (esSesionExpirada(error)) {
        handleSessionExpired();
        return;
      }

      await Swal.fire({
        icon: "error",
        title: "Error",
        text: getErrorMessage(error),
        confirmButtonColor: "#7d2a3f",
      });
    }
  }, []);

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

    const loadingSwal = Swal.fire({
      title: "Guardando...",
      text: "Por favor espera mientras guardamos el producto.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const dataToSend = new FormData();
      const CAMPOS_NUMERICOS_OPCIONALES = [
        "costo_producto",
        "cantidad_producto",
        "minimo_producto",
        "maximo_producto",
      ];

      for (const [key, value] of Object.entries(formData)) {
        if (key === "id" || key === "imagen_producto" || value === null || value === undefined) {
          continue;
        }
        if (value === "" && CAMPOS_NUMERICOS_OPCIONALES.includes(key)) {
          continue;
        }

        if (typeof value === 'object' && value.id) {
          dataToSend.append(key, value.id);
        } else if (typeof value === 'boolean') {
          dataToSend.append(key, value ? '1' : '0');
        } else {
          dataToSend.append(key, value);
        }
      }

      if (file) {
        dataToSend.append("imagen", file);
      }

      if (formData.id) {
        await actualizarProducto(formData.id, dataToSend);
      } else {
        await crearProducto(dataToSend);
      }

      await loadingSwal.close();
      await cargarProductos();
      setModalVisible(false);

      await Swal.fire({
        title: formData.id ? "¡Actualizado!" : "¡Creado!",
        text: `El producto ha sido ${
          formData.id ? "actualizado" : "creado"
        } correctamente.`,
        icon: "success",
        confirmButtonColor: "#712b39",
        timer: 2000,
        timerProgressBar: true,
      });

    } catch (error) {
      await loadingSwal.close();
      if (esSesionExpirada(error)) {
        return handleSessionExpired();
      }

      await Swal.fire({
        title: "Error",
        html: getErrorMessage(error).replace(/\n/g, "<br/>"),
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
          title: "Eliminando...",
          text: "Por favor espera mientras eliminamos el producto.",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
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
        if (esSesionExpirada(error)) {
          return handleSessionExpired();
        }

        await Swal.fire({
          title: "Error",
          text: getErrorMessage(error),
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
