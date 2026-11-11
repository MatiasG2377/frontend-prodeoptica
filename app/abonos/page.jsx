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
import { useState, useEffect, useCallback } from "react";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import Swal from "sweetalert2";
import HistorialAbonosModal from "../components/abonos/HistorialAbonosModal";
import EgresosView from "../components/egresos/EgresosView";
import CierreCajaView from "../components/caja/CierreCajaView";
import { format, startOfMonth, startOfYear, endOfMonth, endOfYear } from "date-fns";
import { parseApiResponse, getErrorMessage } from "../utils/apiError";

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
  const [activeTab, setActiveTab] = useState("abonos");
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
  const [periodoActivo, setPeriodoActivo] = useState("Historico");

  const formatearFechaLocal = (fechaISO) => {
    return new Date(fechaISO).toLocaleDateString("es-EC", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const seleccionarPeriodo = (periodo) => {
    const hoy = new Date();
    setPeriodoActivo(periodo);

    if (periodo === "Hoy") {
      setFechaInicio(format(hoy, "yyyy-MM-dd"));
      setFechaFin(format(hoy, "yyyy-MM-dd"));
    } else if (periodo === "Este Mes") {
      setFechaInicio(format(startOfMonth(hoy), "yyyy-MM-dd"));
      setFechaFin(format(endOfMonth(hoy), "yyyy-MM-dd"));
    } else if (periodo === "Este Año") {
      setFechaInicio(format(startOfYear(hoy), "yyyy-MM-dd"));
      setFechaFin(format(endOfYear(hoy), "yyyy-MM-dd"));
    } else if (periodo === "Historico") {
      setFechaInicio("");
      setFechaFin("");
    }
  };

  const fetchVentas = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/ventas/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      const data = await parseApiResponse(res);
      setVentas(data.results || data);
    } catch (error) {
      console.error("Error al cargar ventas:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: getErrorMessage(error),
        confirmButtonColor: "#712b39",
      });
    }
  }, []);

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
  }, [debouncedBusqueda, cargarAbonos, fetchVentas, buscarPorNombre]);

  const filtrarPorFechas = useCallback(async () => {
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

      const abonosData = await parseApiResponse(abonosRes);
      const ventasData = await parseApiResponse(ventasRes);

      setAbonos(abonosData.results || abonosData);
      setVentas(ventasData.results || ventasData);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: getErrorMessage(error),
        confirmButtonColor: "#712b39",
      });
    } finally {
      setLoading(false);
    }
  }, [fechaInicio, fechaFin, cargarAbonos, fetchVentas, API_URL, setAbonos]);

  useEffect(() => {
    if (debouncedBusqueda.trim()) return; // Prioritize text search if active
    filtrarPorFechas();
  }, [filtrarPorFechas, debouncedBusqueda]);

  const limpiarFiltrosFecha = () => {
    setFechaInicio("");
    setFechaFin("");
    setPeriodoActivo("Historico");
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
      didOpen: () => {
        const input = Swal.getInput();

        // Bloquea el signo "-" en el teclado
        input.addEventListener("keypress", (e) => {
          if (e.key === "-" || e.key === "+") {
            e.preventDefault();
          }
        });

        // Evita que se pegue un valor negativo
        input.addEventListener("input", () => {
          if (parseFloat(input.value) < 0) {
            input.value = input.value.replace("-", "");
          }
        });
      },
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
          cliente_id: abono.cliente?.id || abono.venta?.cliente?.id,
          venta: abono.venta?.id || abono.venta,
          venta_id: abono.venta?.id || abono.venta,
          monto: montoNuevo,
          fecha: new Date().toISOString(),
          metodo_pago: "Efectivo",
        }),
      });

      await parseApiResponse(res);

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
        text: getErrorMessage(error),
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
          cliente_id: abonoSeleccionado.cliente?.id || abonoSeleccionado.cliente,
          venta: abonoSeleccionado.venta?.id || abonoSeleccionado.venta,
          venta_id: abonoSeleccionado.venta?.id || abonoSeleccionado.venta,
          monto,
        }),
      });

      await parseApiResponse(res);

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
        text: getErrorMessage(error),
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

      const data = await parseApiResponse(res);

      setVentaSeleccionada(venta);
      setArticulosVenta(data);
      setMostrarModalVenta(true);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: getErrorMessage(error),
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

      const data = await parseApiResponse(res);
      setHistorialAbonos(data);
      setMostrarHistorialAbonos(true);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: getErrorMessage(error),
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

        <div className="w-full px-6 py-6 border-b flex gap-4 bg-white">
          <button
            onClick={() => setActiveTab("abonos")}
            className={`px-4 py-2 font-bold transition-colors ${
              activeTab === "abonos"
                ? "text-[#712b39] border-b-2 border-[#712b39]"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Ventas y Abonos
          </button>
          <button
            onClick={() => setActiveTab("egresos")}
            className={`px-4 py-2 font-bold transition-colors ${
              activeTab === "egresos"
                ? "text-[#712b39] border-b-2 border-[#712b39]"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Egresos
          </button>
          <button
            onClick={() => setActiveTab("caja")}
            className={`px-4 py-2 font-bold transition-colors ${
              activeTab === "caja"
                ? "text-[#712b39] border-b-2 border-[#712b39]"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Cierre de Caja
          </button>
        </div>

        <div className="w-full px-6 py-10">
          <div className="w-full bg-white rounded-xl shadow-lg p-6">
            {activeTab === "abonos" && (
              <>
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

                <div className="flex flex-col xl:flex-row gap-4 mb-4 items-start xl:items-center">
                  {/* Filtros Rápidos */}
                  <div className="flex bg-gray-100 p-1 rounded-lg w-full md:w-auto overflow-x-auto">
                    {["Hoy", "Este Mes", "Este Año", "Historico"].map((p) => (
                      <button
                        key={p}
                        onClick={() => seleccionarPeriodo(p)}
                        className={`px-3 py-2 text-sm font-semibold rounded-md transition-all flex-1 text-center whitespace-nowrap ${
                          periodoActivo === p
                            ? "bg-white text-[#712b39] shadow-sm"
                            : "text-gray-500 hover:text-gray-800"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="date"
                      className="border rounded px-4 py-2"
                      value={fechaInicio}
                      onChange={(e) => { setFechaInicio(e.target.value); setPeriodoActivo("Personalizado"); }}
                    />
                    <input
                      type="date"
                      className="border rounded px-4 py-2"
                      value={fechaFin}
                      onChange={(e) => { setFechaFin(e.target.value); setPeriodoActivo("Personalizado"); }}
                    />
                    <button
                      onClick={limpiarFiltrosFecha}
                      className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
                    >
                      Limpiar filtros de fecha
                    </button>
                  </div>
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
              </>
            )}

            {activeTab === "egresos" && <EgresosView />}
            {activeTab === "caja" && <CierreCajaView />}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
