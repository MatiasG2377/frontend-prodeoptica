import { useState, useCallback } from "react";
import Swal from "sweetalert2";
import {
  fetchAbonos,
  buscarUsuariosPorNombre,
  fetchAbonosPorFechas,
  fetchAbonoPorVenta,
  actualizarAbono,
} from "../services/abonoService";
import { parseApiResponse, getErrorMessage } from "../utils/apiError";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export function useAbonos() {
  const [abonos, setAbonos] = useState([]);
  const [loading, setLoading] = useState(false);

  const cargarAbonos = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchAbonos();
      setAbonos(data);
    } catch (error) {
      // No mostrar error si es por sesión expirada (el interceptor ya lo maneja)
      if (error?.status !== 401) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: getErrorMessage(error),
          confirmButtonColor: "#7d2a3f",
        });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const buscarPorNombre = useCallback(async (nombre, setVentas) => {
    try {
      setLoading(true);
      const clientes = await buscarUsuariosPorNombre(nombre);
      if (!clientes) return; // Si hay un error de autenticación, salir silenciosamente
      const clienteIds = clientes.map((c) => c.id);

      if (clienteIds.length === 0) {
        setAbonos([]);
        setVentas([]);
        return;
      }

      const todosLosAbonos = await fetchAbonos().catch(() => []); // Si falla por sesión expirada, devolver array vacío
      if (!todosLosAbonos) return; // Si hubo un error de autenticación, salir
      
      const abonosFiltrados = todosLosAbonos.filter((abono) =>
        clienteIds.includes(abono.cliente?.id || abono.cliente)
      );
      setAbonos(abonosFiltrados);

      const resVentas = await fetch(`${BASE_URL}/ventas/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      const ventas = await parseApiResponse(resVentas);
      const ventasFiltradas = Array.isArray(ventas)
        ? ventas.filter((venta) => clienteIds.includes(venta.cliente_venta?.id || venta.cliente_venta))
        : [];
      setVentas(ventasFiltradas);
    } catch (error) {
      if (error?.status !== 401) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: getErrorMessage(error),
          confirmButtonColor: "#7d2a3f",
        });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const filtrarPorFecha = useCallback(async (fechaInicio, fechaFin, setVentas) => {
    if (!fechaInicio && !fechaFin) {
      cargarAbonos();
      return;
    }

    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (fechaInicio) params.append("fecha_inicio", fechaInicio);
      if (fechaFin) params.append("fecha_fin", fechaFin);

      const abonosRes = await fetch(
        `${BASE_URL}/abonos/fecha/?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      const ventasRes = await fetch(
        `${BASE_URL}/ventas/fecha/?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      const abonosData = await parseApiResponse(abonosRes);
      const ventasData = await parseApiResponse(ventasRes);

      setAbonos(abonosData.results || abonosData);
      setVentas(ventasData.results || ventasData);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: getErrorMessage(error),
        confirmButtonColor: "#7d2a3f",
      });
    } finally {
      setLoading(false);
    }
  }, [cargarAbonos]);

  const obtenerAbonoPorVenta = useCallback(async (ventaId) => {
    return await fetchAbonoPorVenta(ventaId);
  }, []);

  const actualizar = useCallback(async (abonoId, payload) => {
    return await actualizarAbono(abonoId, payload);
  }, []);

  return {
    abonos,
    setAbonos,
    loading,
    setLoading,
    cargarAbonos,
    buscarPorNombre,
    filtrarPorFecha,
    obtenerAbonoPorVenta,
    actualizar,
  };
}
