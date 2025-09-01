/**
 * Página de abonos.
 *
 * Esta página muestra la tabla de abonos y permite buscar y filtrar
 * los abonos, mostrar detalles de un abono, registrar un nuevo abono,
 * y mostrar un historial de abonos realizados.
 *
 * - `AbonoTabla`: Componente que muestra la tabla de abonos.
 * - `AbonoModal`: Componente que muestra un formulario para registrar un nuevo abono.
 * - `useAbonos`: Hook que maneja el estado y la lógica para buscar y filtrar abonos.
 * - `ModalDetalleVenta`: Componente que muestra detalles de un abono.
 * - `HistorialAbonosModal`: Componente que muestra un historial de abonos realizados.
 *
 *? @return {JSX.Element} La página de abonos.
 */

"use client";

import Header from "../components/common/Header2";
import AbonoTabla from "../components/abonos/AbonoTabla";
import AbonoModal from "../components/abonos/AbonoModal";
import { useAbonos } from "../hooks/useAbonoRead";
import ModalDetalleVenta from "../components/abonos/ModalDetalleVenta";
import { useAuth } from "../hooks/useAuth";
import { useState, useEffect } from "react";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import Swal from "sweetalert2";
import HistorialAbonosModal from "../components/abonos/HistorialAbonosModal";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AbonosPage() {
  const { logout } = useAuth();
  const API_URL = BASE_URL;
  const [busqueda, setBusqueda] = useState("");
  const [debouncedBusqueda, setDebouncedBusqueda] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [ventas, setVentas] = useState([]);
  const [historialAbonos, setHistorialAbonos] = useState([]);
  const [mostrarHistorialAbonos, setMostrarHistorialAbonos] = useState(false);
  const {
    abonos,
    setAbonos,
    loading,
    setLoading,
    cargarAbonos,
    buscarPorNombre,
  } = useAbonos();
  const [abonoSeleccionado, setAbonoSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [mostrarModalVenta, setMostrarModalVenta] = useState(false);
  const [articulosVenta, setArticulosVenta] = useState([]);
  const formatearFechaLocal = (fechaISO) => {
    return new Date(fechaISO).toLocaleDateString("es-EC", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedBusqueda(busqueda);
    }, 400);

    return () => clearTimeout(timer);
  }, [busqueda]);

  useEffect(() => {
    if (!debouncedBusqueda.trim()) {
      cargarAbonos();
      fetchVentas();
      return;
    }

    buscarPorNombre(debouncedBusqueda, setVentas);
  }, [debouncedBusqueda]);

  const fetchVentas = async () => {
    try {
      const res = await fetch(`${BASE_URL}/ventas/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      if (!res.ok) throw new Error("Error al cargar ventas");

      const data = await res.json();
      setVentas(data.results || data);
    } catch (error) {}
  };

  useEffect(() => {
    cargarAbonos();
    fetchVentas();
  }, []);

  const filtrarPorFechas = async () => {
    if (!fechaInicio && !fechaFin) {
      cargarAbonos();
      fetchVentas();
      return;
    }

    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (fechaInicio) params.append("fecha_inicio", fechaInicio);
      if (fechaFin) params.append("fecha_fin", fechaFin);

      const abonosRes = await fetch(
        `${API_URL}/abonos/fecha/?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      const ventasRes = await fetch(
        `${API_URL}/ventas/fecha/?${params.toString()}`,
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
    } finally {
      setLoading(false);
    }
  };

  const limpiarFiltrosFecha = () => {
    setFechaInicio("");
    setFechaFin("");
    cargarAbonos();
    fetchVentas();
  };

  const handleReducirPendiente = async (abono) => {
    const total = parseFloat(abono.venta?.total_venta || 0);
    const pagado = parseFloat(abono.monto);
    const restante = total - pagado;

    const { value: cantidad } = await Swal.fire({
      title: "¿Cuánto desea abonar?",
      html: `Restante: <strong>$${restante.toFixed(2)}</strong>`,
      input: "number",
      inputAttributes: {
        min: 0,
        step: "0.01",
      },
      inputPlaceholder: "Ingrese el monto a abonar",
      showCancelButton: true,
      confirmButtonColor: "#712b39",
      cancelButtonColor: "#D1D5DB",
      confirmButtonText: "Registrar abono",
      cancelButtonText: "Cancelar",
    });

    if (!cantidad) return;

    const montoNuevo = parseFloat(cantidad);
    const precision = 0.0001;

    if (isNaN(montoNuevo) || montoNuevo <= 0) {
      await Swal.fire({
        icon: "warning",
        title: "Monto inválido",
        text: "Ingrese un monto válido",
        confirmButtonColor: "#712b39",
      });
      return;
    }

    if (montoNuevo - restante > precision) {
      await Swal.fire({
        icon: "warning",
        title: "Monto excedido",
        text: `El monto ingresado ($${montoNuevo.toFixed(
          2
        )}) excede el restante ($${restante.toFixed(2)})`,
        confirmButtonColor: "#712b39",
      });
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/abonos/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          cliente: abono.cliente?.id || abono.venta?.cliente?.id,
          venta: abono.venta?.id || abono.venta,
          monto: montoNuevo,
          fecha: new Date().toISOString(),
          metodo_pago: "Efectivo",
        }),
      });

      if (!res.ok) throw new Error("Error al registrar el abono");

      await cargarAbonos();

      await Swal.fire({
        icon: "success",
        title: "Abono registrado",
        text: `Se registró un abono de $${montoNuevo.toFixed(2)}.`,
        confirmButtonColor: "#712b39",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al procesar el abono.",
        confirmButtonColor: "#712b39",
      });
    } finally {
      setLoading(false);
    }
  };

  const abrirModalEdicion = (abono) => {
    setAbonoSeleccionado({ ...abono });
    setMostrarModal(true);
  };

  const handleChange = (field, value) => {
    setAbonoSeleccionado((prev) => ({ ...prev, [field]: value }));
  };

  const guardarEdicion = async () => {
    try {
      setLoading(true);
      const monto = parseFloat(abonoSeleccionado.monto);

      if (isNaN(monto) || monto < 0) {
        await Swal.fire({
          icon: "warning",
          title: "Monto inválido",
          text: "Por favor ingrese un monto válido.",
          confirmButtonColor: "#712b39",
        });
        return;
      }

      const res = await fetch(`${API_URL}/abonos/${abonoSeleccionado.id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...abonoSeleccionado,
          cliente: abonoSeleccionado.cliente?.id || abonoSeleccionado.cliente,
          venta: abonoSeleccionado.venta?.id || abonoSeleccionado.venta,
          monto,
        }),
      });

      if (!res.ok) throw new Error("Error al actualizar el abono");

      await cargarAbonos();
      setMostrarModal(false);

      await Swal.fire({
        icon: "success",
        title: "Abono actualizado",
        text: "Los cambios se han guardado correctamente.",
        confirmButtonColor: "#712b39",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al actualizar el abono.",
        confirmButtonColor: "#712b39",
      });
    } finally {
      setLoading(false);
    }
  };
  const verDetalleVenta = async (venta) => {
    try {
      const res = await fetch(`${BASE_URL}/ventas/${venta.id}/articulos/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      if (!res.ok) throw new Error("Error al obtener artículos");

      const data = await res.json();

      setVentaSeleccionada(venta);
      setArticulosVenta(data);
      setMostrarModalVenta(true);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al obtener el detalle de la venta.",
        confirmButtonColor: "#7d2a3f",
      });
    }
  };

  const combinarVentasYAbonos = () => {
    const abonosPorVenta = {};

    abonos.forEach((abono) => {
      const ventaId = abono.venta?.id;
      if (!ventaId) return;

      if (!abonosPorVenta[ventaId]) {
        abonosPorVenta[ventaId] = 0;
      }

      abonosPorVenta[ventaId] += parseFloat(abono.monto || 0);
    });

    const resultado = ventas.map((venta) => {
      const abonado = abonosPorVenta[venta.id] || 0;
      const total = parseFloat(venta.total_venta || 0);
      const completado = abonado >= total - 0.0001;

      return {
        id: venta.id,
        venta,
        cliente: venta.cliente_venta,
        monto: abonado,
        fecha: venta.fecha_venta,
        metodo_pago: venta.metodo_venta,
        tieneAbono: abonado > 0,
        completado,
      };
    });

    return resultado;
  };
  const abrirHistorialAbonos = async (ventaId) => {
    try {
      const res = await fetch(`${BASE_URL}/abonos/venta/${ventaId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      if (!res.ok) throw new Error("Error al obtener historial de abonos");

      const data = await res.json();
      setHistorialAbonos(data);
      setMostrarHistorialAbonos(true);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al abrir el historial de abonos.",
        confirmButtonColor: "#7d2a3f",
      });
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen w-full bg-gray-100">
        <Header
          title="Ventas y Abonos"
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          handleLogout={logout}
        />

        <div className="w-full px-6 py-10">
          <div className="w-full bg-white rounded-xl shadow-lg p-6">
            <h1 className="text-3xl font-bold text-[#712b39] mb-6">
              Historial de Ventas y Abonos
            </h1>

            <input
              type="text"
              placeholder="Buscar por nombre de cliente..."
              className="w-full mb-4 border rounded px-4 py-2"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />

            <div className="flex flex-wrap gap-4 mb-4">
              <input
                type="date"
                className="border rounded px-4 py-2"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
              <input
                type="date"
                className="border rounded px-4 py-2"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
              <button
                onClick={filtrarPorFechas}
                className="bg-[#712b39] text-white px-4 py-2 rounded hover:bg-[#5a222f] transition"
              >
                Filtrar por fechas
              </button>
              <button
                onClick={limpiarFiltrosFecha}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
              >
                Limpiar filtros de fecha
              </button>
            </div>

            {loading ? (
              <p className="text-gray-500">Cargando datos...</p>
            ) : (
              <AbonoTabla
                abonos={combinarVentasYAbonos()}
                onAbonar={handleReducirPendiente}
                onEditar={abrirModalEdicion}
                onVerVenta={verDetalleVenta}
                onVerHistorialAbonos={abrirHistorialAbonos}
                loading={loading}
              />
            )}

            {mostrarModal && abonoSeleccionado && (
              <AbonoModal
                abono={abonoSeleccionado}
                loading={loading}
                onClose={() => setMostrarModal(false)}
                onSave={guardarEdicion}
                onChange={handleChange}
              />
            )}
            {mostrarModalVenta && ventaSeleccionada && (
              <ModalDetalleVenta
                visible={mostrarModalVenta}
                onClose={() => setMostrarModalVenta(false)}
                venta={ventaSeleccionada}
                articulos={articulosVenta}
              />
            )}
            {mostrarHistorialAbonos && (
              <HistorialAbonosModal
                visible={mostrarHistorialAbonos}
                abonos={historialAbonos}
                onClose={() => setMostrarHistorialAbonos(false)}
              />
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
