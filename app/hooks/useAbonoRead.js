import { useState } from "react";
import {
  fetchAbonos,
  buscarUsuariosPorNombre,
  fetchAbonosPorFechas,
  fetchAbonoPorVenta,
  actualizarAbono,
} from "../services/abonoService";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export function useAbonos() {
  const [abonos, setAbonos] = useState([]);
  const [loading, setLoading] = useState(false);

  const cargarAbonos = async () => {
    try {
      setLoading(true);
      const data = await fetchAbonos();
      setAbonos(data);
    } catch (error) {
      console.error("Error al cargar abonos:", error);
    } finally {
      setLoading(false);
    }
  };

  const buscarPorNombre = async (nombre, setVentas) => {
    try {
      setLoading(true);
      const clientes = await buscarUsuariosPorNombre(nombre);
      const clienteIds = clientes.map((c) => c.id);

      if (clienteIds.length === 0) {
        setAbonos([]);
        setVentas([]);
        return;
      }

      const todosLosAbonos = await fetchAbonos();
      const abonosFiltrados = todosLosAbonos.filter((abono) =>
        clienteIds.includes(abono.cliente?.id || abono.cliente)
      );
      setAbonos(abonosFiltrados);

      const resVentas = await fetch(`${BASE_URL}/api/ventas/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      const dataVentas = await resVentas.json();
      const ventasFiltradas = (dataVentas.results || dataVentas).filter(
        (venta) =>
          clienteIds.includes(venta.cliente_venta?.id || venta.cliente_venta)
      );

      setVentas(ventasFiltradas);
    } catch (error) {
      console.error("Error buscando por nombre:", error);
    } finally {
      setLoading(false);
    }
  };

  const filtrarPorFecha = async (fechaInicio, fechaFin, setVentas) => {
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
        `${BASE_URL}/api/abonos/fecha/?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      const ventasRes = await fetch(
        `${BASE_URL}/api/ventas/fecha/?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (!abonosRes.ok || !ventasRes.ok)
        throw new Error("Error al filtrar datos por fechas");

      const abonosData = await abonosRes.json();
      const ventasData = await ventasRes.json();

      setAbonos(abonosData.results || abonosData);
      setVentas(ventasData.results || ventasData);
    } catch (error) {
      console.error("Error filtrando abonos y ventas:", error);
    } finally {
      setLoading(false);
    }
  };

  const obtenerAbonoPorVenta = async (ventaId) => {
    return await fetchAbonoPorVenta(ventaId);
  };

  const actualizar = async (abonoId, payload) => {
    return await actualizarAbono(abonoId, payload);
  };

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
