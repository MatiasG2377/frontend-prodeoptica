"use client";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

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
  const [debouncedSearch, setDebouncedSearch] = useState(""); // nuevo para debounce
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Debounce de búsqueda
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 400); // espera 400 ms

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  // Cargar productos según búsqueda
  useEffect(() => {
    if (debouncedSearch === "") {
      fetchProductos();
    } else {
      fetchProductosBuscados(debouncedSearch);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    fetchCategorias();
    fetchProveedores();
  }, []);

  const fetchProductos = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/productos/");
      const data = await res.json();
      setProductos(data.results || []);
    } catch (error) {
      console.error("Error cargando productos:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductosBuscados = async (search) => {
    try {
      setLoading(true);
      const res = await fetch(
        `http://127.0.0.1:8000/api/productos/buscar/?q=${encodeURIComponent(
          search
        )}`
      );
      const data = await res.json();
      console.log("Resultado búsqueda backend:", data); // 🔥 Log directo

      if (Array.isArray(data)) {
        setProductos(data);
      } else if (Array.isArray(data.results)) {
        setProductos(data.results);
      } else {
        setProductos([]);
      }
    } catch (error) {
      console.error("Error buscando productos:", error);
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategorias = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/categorias/");
      const data = await res.json();
      setCategorias(data.results || data);
    } catch (error) {
      console.error("Error cargando categorías:", error);
    }
  };

  const fetchProveedores = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/proveedores/");
      const data = await res.json();
      setProveedores(data.results || data);
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

      const method = selectedProducto ? "PUT" : "POST";
      const url = selectedProducto
        ? `http://127.0.0.1:8000/api/productos/${selectedProducto.id}/`
        : "http://127.0.0.1:8000/api/productos/";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: selectedProducto ? "Producto actualizado" : "Producto creado",
          showConfirmButton: false,
          timer: 1500,
        });
        fetchProductos();
        setModalVisible(false);
        setSelectedProducto(null);
        resetForm();
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error(errorData);
        Swal.fire({
          icon: "error",
          title: "Error al guardar",
          text: errorData.detail || "Verifica los datos enviados.",
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo guardar el producto.", "error");
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
      customClass: { popup: "rounded-lg" },
    });

    if (confirmResult.isConfirmed) {
      const res = await fetch(`http://127.0.0.1:8000/api/productos/${id}/`, {
        method: "DELETE",
      });

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Producto eliminado",
          confirmButtonColor: "#712b39",
        });
        fetchProductos();
      } else {
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
