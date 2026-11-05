"use client";
import React, { useEffect, useState } from "react";
import { Search, User, FileText, CheckCircle2 } from "lucide-react";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

export default function ClienteForm({
  clienteData,
  handleInputChange,
  metodoVenta,
  setMetodoVenta,
  laboratorioVenta,
  setLaboratorioVenta,
  progreso = 2,
  onBuscarCliente,
  ordenLaboratorio,
  setOrdenLaboratorio,
  ordenTrabajo,
  setOrdenTrabajo,
}) {
  const [laboratorios, setLaboratorios] = useState([]);
  const [mostrarClinico, setMostrarClinico] = useState(false);

  useEffect(() => {
    const cargarLaboratorios = async () => {
      try {
        const response = await fetch(`${BASE_URL}/laboratorios/`);
        if (!response.ok) {
          throw new Error("Error al cargar laboratorios");
        }
        const data = await response.json();
        setLaboratorios(Array.isArray(data) ? data : data.results || []);
      } catch (err) {
        setLaboratorios([]);
      }
    };

    cargarLaboratorios();
  }, []);

  const inputClass =
    "w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#712b39] focus:border-transparent transition shadow-2xs";

  const isCiValida = (clienteData?.ci_cliente || "").trim().length === 10;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md mb-6 border border-gray-100">
      {/* Barra de progreso */}
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-[#712b39] h-2 rounded-full transition-all duration-300"
            style={{ width: `${(progreso / 3) * 100}%` }}
          />
        </div>
        <div className="text-xs font-semibold text-gray-500 text-center mt-2">
          {progreso === 1 && "Paso 1: Selección de productos"}
          {progreso === 2 && "Paso 2: Datos del cliente y facturación"}
          {progreso === 3 && "Paso 3: Confirmación de la venta"}
        </div>
      </div>

      {/* Sección 1: Datos de Facturación y Venta */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
          <User className="w-5 h-5 text-[#712b39]" />
          <h2 className="text-lg font-bold text-gray-900">
            Datos de Facturación y Cliente
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {/* Cédula con búsqueda */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Cédula / RUC / ID
            </label>
            <div className="flex">
              <input
                type="text"
                name="ci_cliente"
                value={clienteData.ci_cliente || ""}
                onChange={handleInputChange}
                className={`${inputClass} rounded-r-none`}
                placeholder="Ingrese 10 dígitos de cédula"
                maxLength={13}
              />
              <button
                type="button"
                onClick={() => onBuscarCliente(clienteData.ci_cliente)}
                className="bg-[#712b39] text-white px-3 py-2.5 rounded-r-lg hover:bg-[#5e242e] transition flex items-center justify-center disabled:opacity-50"
                disabled={!clienteData.ci_cliente?.trim()}
                title="Buscar cliente registrado"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
            {isCiValida && (
              <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Cédula de 10 dígitos ingresada
              </p>
            )}
          </div>

          {/* Método de Venta */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Método de Pago <span className="text-red-500">*</span>
            </label>
            <select
              value={metodoVenta}
              onChange={(e) => setMetodoVenta(e.target.value)}
              className={inputClass}
            >
              <option value="Efectivo">Efectivo</option>
              <option value="Tarjeta">Tarjeta (Débito / Crédito)</option>
              <option value="Transferencia">Transferencia Bancaria</option>
              <option value="Crédito-empresarial">Crédito Empresarial</option>
            </select>
          </div>

          {/* Nombre y Apellidos */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Nombres del Cliente <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nombre_cliente"
              value={clienteData.nombre_cliente || ""}
              onChange={handleInputChange}
              className={inputClass}
              placeholder="Ej: Juan Carlos"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Apellidos del Cliente
            </label>
            <input
              type="text"
              name="apellidos_paciente"
              value={clienteData.apellidos_paciente || ""}
              onChange={handleInputChange}
              className={inputClass}
              placeholder="Ej: Pérez Andrade"
            />
          </div>

          {/* Teléfono y Correo */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Teléfono / Celular
            </label>
            <input
              type="text"
              name="telefono_cliente"
              value={clienteData.telefono_cliente || ""}
              onChange={handleInputChange}
              className={inputClass}
              placeholder="Ej: 0991234567"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              name="correo_cliente"
              value={clienteData.correo_cliente || ""}
              onChange={handleInputChange}
              className={inputClass}
              placeholder="cliente@ejemplo.com"
            />
          </div>

          {/* Dirección */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Dirección de Domicilio
            </label>
            <input
              type="text"
              name="direccion_cliente"
              value={clienteData.direccion_cliente || ""}
              onChange={handleInputChange}
              className={inputClass}
              placeholder="Calle principal, secundaria y número"
            />
          </div>
        </div>
      </div>

      {/* Sección 2: Órdenes y Ficha Clínica (Colapsable) */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => setMostrarClinico(!mostrarClinico)}
          className="w-full flex items-center justify-between p-3.5 bg-gray-50 hover:bg-gray-100 transition text-left"
        >
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#712b39]" />
            <span className="text-sm font-bold text-gray-800">
              Datos de Laboratorio y Ficha Clínica (Opcional)
            </span>
          </div>
          <span className="text-xs font-semibold text-[#712b39]">
            {mostrarClinico ? "Ocultar ▲" : "Desplegar ▼"}
          </span>
        </button>

        {mostrarClinico && (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white border-t border-gray-200">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Laboratorio Asignado:
              </label>
              <select
                value={laboratorioVenta || ""}
                onChange={(e) => setLaboratorioVenta(e.target.value)}
                className={inputClass}
              >
                <option value="">Seleccionar laboratorio...</option>
                {laboratorios.map((lab) => (
                  <option key={lab.id} value={lab.id}>
                    {lab.nombre_laboratorio}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Orden de Laboratorio:
              </label>
              <input
                type="text"
                value={ordenLaboratorio || ""}
                onChange={(e) => setOrdenLaboratorio(e.target.value)}
                className={inputClass}
                placeholder="N° orden de laboratorio"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Orden de Trabajo Interna:
              </label>
              <input
                type="text"
                value={ordenTrabajo || ""}
                onChange={(e) => setOrdenTrabajo(e.target.value)}
                className={inputClass}
                placeholder="N° orden de trabajo"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Fecha de Nacimiento:
              </label>
              <input
                type="date"
                name="fecha_nacimiento"
                value={clienteData.fecha_nacimiento || ""}
                onChange={handleInputChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Ocupación:
              </label>
              <input
                type="text"
                name="ocupacion_paciente"
                value={clienteData.ocupacion_paciente || ""}
                onChange={handleInputChange}
                className={inputClass}
                placeholder="Ej: Estudiante, Ingeniero..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Información Adicional:
              </label>
              <input
                type="text"
                name="informacion_cliente"
                value={clienteData.informacion_cliente || ""}
                onChange={handleInputChange}
                className={inputClass}
                placeholder="Notas de facturación o preferencias"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Antecedentes Médicos / Observaciones Clínicas:
              </label>
              <textarea
                name="antecedentes_paciente"
                value={clienteData.antecedentes_paciente || ""}
                onChange={handleInputChange}
                rows={2}
                className={inputClass}
                placeholder="Patologías previas, cirugías oculares, molestias..."
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
