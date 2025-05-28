
"use client";

import Header from "../components/common/Header2";
import AbonoTabla from "../components/abonos/AbonoTabla";
import AbonoModal from "../components/abonos/AbonoModal";
import { useAbonos } from "../hooks/useAbonoRead";
import { useAuth } from "../hooks/useAuth";
import { useState, useEffect } from "react";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import Swal from "sweetalert2";

export default function AbonosPage() {
  const { logout } = useAuth();
  const API_URL = "http://127.0.0.1:8000/api";
  const [busqueda, setBusqueda] = useState("");
  const [debouncedBusqueda, setDebouncedBusqueda] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const { abonos, setAbonos, loading, setLoading, fetchAbonos } = useAbonos(API_URL);
  const [abonoSeleccionado, setAbonoSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Debounce para búsqueda por nombre
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedBusqueda(busqueda);
    }, 400);

    return () => clearTimeout(timer);
  }, [busqueda]);

  // Buscar abonos por usuario (nombre) cuando cambia debouncedBusqueda
  useEffect(() => {
    const buscarAbonosPorUsuario = async () => {
      if (!debouncedBusqueda.trim()) {
        fetchAbonos(); // Si se limpia la búsqueda, mostrar todos
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/abonos/buscar/?q=${debouncedBusqueda}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        if (!res.ok) throw new Error("Error al buscar usuarios");

        const usuarios = await res.json();
        const usuariosIds = usuarios.map((u) => u.id);

        // Filtrar los abonos actuales para los clientes encontrados
        const abonosFiltrados = abonos.filter((abono) =>
          usuariosIds.includes(abono.cliente?.id || abono.cliente)
        );
        setAbonos(abonosFiltrados);
      } catch (error) {
        console.error("Error en búsqueda de abonos:", error);
      } finally {
        setLoading(false);
      }
    };

    buscarAbonosPorUsuario();
  }, [debouncedBusqueda]);

  // Carga inicial de abonos
  useEffect(() => {
    fetchAbonos();
  }, []);

  // Función para filtrar abonos por fechas cuando se presiona el botón
  const filtrarPorFechas = async () => {
    if (!fechaInicio && !fechaFin) {
      fetchAbonos(); // Si no hay fechas, carga todo
      return;
    }

    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (fechaInicio) params.append("fecha_inicio", fechaInicio);
      if (fechaFin) params.append("fecha_fin", fechaFin);

      const res = await fetch(`${API_URL}/abonos/fecha/?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      if (!res.ok) throw new Error("Error al filtrar abonos por fechas");

      const data = await res.json();
      setAbonos(data.results || data); // si usas paginación, usa data.results
    } catch (error) {
      console.error("Error filtrando abonos por fechas:", error);
    } finally {
      setLoading(false);
    }
  };

  // Función para limpiar filtros de fecha y recargar abonos
  const limpiarFiltrosFecha = () => {
    setFechaInicio("");
    setFechaFin("");
    fetchAbonos();
  };

  // El resto de funciones para editar y abonar

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
      const nuevoMonto = pagado + montoNuevo;
      const actualizado = {
        ...abono,
        cliente: abono.cliente?.id || abono.cliente,
        venta: abono.venta?.id || abono.venta,
        monto: nuevoMonto,
        fecha: new Date().toISOString(),
      };

      const res = await fetch(`${API_URL}/abonos/${abono.id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(actualizado),
      });

      if (!res.ok) throw new Error("Error al actualizar el abono");

      await fetchAbonos();

      await Swal.fire({
        icon: "success",
        title: "Abono actualizado",
        text: `Abono de $${montoNuevo.toFixed(2)} registrado correctamente.`,
        confirmButtonColor: "#712b39",
      });
    } catch (error) {
      console.error("Error al registrar el abono:", error);
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

      await fetchAbonos();
      setMostrarModal(false);

      await Swal.fire({
        icon: "success",
        title: "Abono actualizado",
        text: "Los cambios se han guardado correctamente.",
        confirmButtonColor: "#712b39",
      });
    } catch (error) {
      console.error("Error al actualizar el abono:", error);
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

  return (
    <ProtectedRoute>
      <div className="min-h-screen w-full bg-gray-100">
        <Header
          title="Abonos"
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          handleLogout={logout}
        />

        <div className="w-full px-6 py-10">
          <div className="w-full bg-white rounded-xl shadow-lg p-6">
            <h1 className="text-3xl font-bold text-[#712b39] mb-6">Historial de Abonos</h1>

            <input
              type="text"
              placeholder="Buscar por nombre de usuario..."
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
                abonos={abonos}
                onAbonar={handleReducirPendiente}
                onEditar={abrirModalEdicion}
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
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
