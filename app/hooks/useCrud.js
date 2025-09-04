import Swal from "sweetalert2";
import { useState, useEffect, useCallback } from "react";
import {
  getAllItems,
  createItem,
  updateItem,
  deleteItemById,
} from "../services/crudService";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export function useCrud(apiUrl) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!apiUrl) return;
    try {
      setLoading(true);
      const json = await getAllItems(apiUrl);
      setData(json);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al cargar los datos.",
        confirmButtonColor: "#7d2a3f",
      });
    } finally {
      setLoading(false);
    }
  }, [apiUrl]); // <-- apiUrl como dependencia

  useEffect(() => {
    fetchData();
  }, [apiUrl, fetchData]);

  const validate = (item) => {
    if (apiUrl.includes("proveedores")) {
      if (!item.nombre_proveedor || item.nombre_proveedor.trim() === "") {
        return "El nombre del proveedor es obligatorio.";
      }
    }
    if (apiUrl.includes("laboratorios")) {
      if (!item.nombre_laboratorio || item.nombre_laboratorio.trim() === "") {
        return "El nombre del laboratorio es obligatorio.";
      }
    }
    return null;
  };

  const addItem = async (item) => {
    const error = validate(item);
    if (error) {
      Swal.fire({
        icon: "warning",
        title: "Validación",
        text: error,
        confirmButtonColor: "#712b39",
      });
      return;
    }

    try {
      await createItem(apiUrl, item);
      await fetchData();
      Swal.fire({
        icon: "success",
        title: "Agregado",
        text: "Registro agregado correctamente.",
        confirmButtonColor: "#712b39",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err?.detail || "No se pudo agregar.",
        confirmButtonColor: "#712b39",
      });
    }
  };

  const editItem = async (id, item) => {
    const error = validate(item);
    if (error) {
      Swal.fire({
        icon: "warning",
        title: "Validación",
        text: error,
        confirmButtonColor: "#712b39",
      });
      return;
    }

    try {
      await updateItem(apiUrl, id, item);
      await fetchData();
      Swal.fire({
        icon: "success",
        title: "Actualizado",
        text: "Registro actualizado.",
        confirmButtonColor: "#712b39",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err?.detail || "No se pudo actualizar.",
        confirmButtonColor: "#712b39",
      });
    }
  };

  const deleteItem = async (id) => {
    try {
      await deleteItemById(apiUrl, id);
      await fetchData();
      Swal.fire({
        icon: "success",
        title: "Eliminado",
        text: "Registro eliminado.",
        confirmButtonColor: "#712b39",
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo eliminar.",
        confirmButtonColor: "#712b39",
      });
    }
  };

  return { data, loading, addItem, editItem, deleteItem };
}
