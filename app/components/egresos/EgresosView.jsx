"use client";
import { TableSkeleton } from '../common/Skeleton';
import React, { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const categoriasValidas = [
  "Pago a proveedores",
  "Servicios básicos",
  "Nómina",
  "Mantenimiento",
  "Insumos de oficina",
  "Otros",
];

const metodosValidos = [
  "Efectivo",
  "Transferencia",
  "Tarjeta",
  "Crédito empresarial",
];

export default function EgresosView() {
  const [egresos, setEgresos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editando, setEditando] = useState(false);

  const [formData, setFormData] = useState({
    id: null,
    monto_egreso: "",
    descripcion_egreso: "",
    categoria_egreso: "Otros",
    metodo_pago_egreso: "Efectivo",
    usuario_egreso: 1, // Defaulting as requested, optionally from token later
    sucursal_egreso: 1, // Default
  });

  const fetchEgresos = useCallback(async (searchQuery = "") => {
    try {
      setLoading(true);
      const url = searchQuery
        ? `${BASE_URL}/egresos/?search=${searchQuery}`
        : `${BASE_URL}/egresos/`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setEgresos(data.results || data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEgresos(busqueda);
    }, 400);
    return () => clearTimeout(timer);
  }, [busqueda, fetchEgresos]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const method = editando ? "PUT" : "POST";
      const url = editando
        ? `${BASE_URL}/egresos/${formData.id}/`
        : `${BASE_URL}/egresos/`;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          usuario_egreso: formData.usuario_egreso,
          sucursal_egreso: formData.sucursal_egreso,
          monto_egreso: parseFloat(formData.monto_egreso).toFixed(2),
          descripcion_egreso: formData.descripcion_egreso,
          categoria_egreso: formData.categoria_egreso,
          metodo_pago_egreso: formData.metodo_pago_egreso,
        }),
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Éxito",
          text: `Egreso ${editando ? "actualizado" : "creado"} exitosamente`,
          confirmButtonColor: "#712b39",
        });
        setMostrarModal(false);
        fetchEgresos(busqueda);
      } else {
        throw new Error("Error en la petición");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al procesar el egreso.",
        confirmButtonColor: "#7d2a3f",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (egreso) => {
    setFormData({
      id: egreso.id,
      monto_egreso: egreso.monto_egreso,
      descripcion_egreso: egreso.descripcion_egreso,
      categoria_egreso: egreso.categoria_egreso,
      metodo_pago_egreso: egreso.metodo_pago_egreso,
      usuario_egreso: egreso.usuario_egreso?.id || egreso.usuario_egreso || 1,
      sucursal_egreso:
        egreso.sucursal_egreso?.id || egreso.sucursal_egreso || 1,
    });
    setEditando(true);
    setMostrarModal(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#712b39",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${BASE_URL}/egresos/${id}/`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: "Eliminado",
            text: "El egreso ha sido eliminado.",
            confirmButtonColor: "#712b39",
          });
          fetchEgresos(busqueda);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const openNewModal = () => {
    setFormData({
      id: null,
      monto_egreso: "",
      descripcion_egreso: "",
      categoria_egreso: "Otros",
      metodo_pago_egreso: "Efectivo",
      usuario_egreso: 1,
      sucursal_egreso: 1,
    });
    setEditando(false);
    setMostrarModal(true);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#712b39]">Gestión de Egresos</h2>
        <button
          onClick={openNewModal}
          className="bg-[#712b39] text-white px-4 py-2 rounded hover:bg-[#5a222f] transition"
        >
          + Nuevo Egreso
        </button>
      </div>

      <input
        type="text"
        placeholder="Buscar egresos..."
        className="w-full mb-4 border rounded px-4 py-2"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      {loading ? (
        <TableSkeleton rows={5} cols={6} />
      ) : egresos.length === 0 ? (
        <p className="text-gray-500">No hay egresos registrados.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-200 text-sm">
            <thead className="bg-[#712b39] text-white text-left">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Descripción</th>
                <th className="p-3">Categoría</th>
                <th className="p-3">Método Pago</th>
                <th className="p-3">Monto</th>
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {egresos.map((egreso) => (
                <tr key={egreso.id} className="border-b transition">
                  <td className="p-3">{egreso.id}</td>
                  <td className="p-3">{egreso.descripcion_egreso}</td>
                  <td className="p-3">{egreso.categoria_egreso}</td>
                  <td className="p-3">{egreso.metodo_pago_egreso}</td>
                  <td className="p-3 font-semibold">
                    ${parseFloat(egreso.monto_egreso).toFixed(2)}
                  </td>
                  <td className="p-3 text-center space-x-2">
                    <button
                      onClick={() => handleEdit(egreso)}
                      className="border border-[#712b39] text-[#712b39] px-3 py-1 rounded hover:bg-[#712b39] hover:text-white transition font-medium"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(egreso.id)}
                      className="border border-red-500 text-red-500 px-3 py-1 rounded hover:bg-red-500 hover:text-white transition font-medium"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {mostrarModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-1/3 shadow-xl max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-[#712b39]">
              {editando ? "Editar Egreso" : "Nuevo Egreso"}
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Monto</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  name="monto_egreso"
                  value={formData.monto_egreso}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-[#712b39]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  Descripción
                </label>
                <input
                  type="text"
                  required
                  name="descripcion_egreso"
                  value={formData.descripcion_egreso}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-[#712b39]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  Categoría
                </label>
                <select
                  required
                  name="categoria_egreso"
                  value={formData.categoria_egreso}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-[#712b39]"
                >
                  {categoriasValidas.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  Método de Pago
                </label>
                <select
                  required
                  name="metodo_pago_egreso"
                  value={formData.metodo_pago_egreso}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-[#712b39]"
                >
                  {metodosValidos.map((met) => (
                    <option key={met} value={met}>
                      {met}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setMostrarModal(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#712b39] text-white px-4 py-2 rounded hover:bg-[#5a222f]"
                >
                  {loading ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
