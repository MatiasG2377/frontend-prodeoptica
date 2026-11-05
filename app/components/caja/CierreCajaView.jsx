"use client";
import { CardSkeleton } from '../common/Skeleton';
import React, { useState, useEffect, useCallback } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import * as XLSX from "xlsx";
import { format, startOfMonth, startOfYear, endOfMonth, endOfYear } from "date-fns";
import Swal from "sweetalert2";

ChartJS.register(ArcElement, Tooltip, Legend);

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export default function CierreCajaView() {
  const [fechaInicio, setFechaInicio] = useState(format(new Date(), "yyyy-MM-dd"));
  const [fechaFin, setFechaFin] = useState(format(new Date(), "yyyy-MM-dd"));
  const [loading, setLoading] = useState(false);
  const [periodoActivo, setPeriodoActivo] = useState("Hoy");

  const [resumen, setResumen] = useState({
    ingresos: { efectivo: 0, transferencia: 0, tarjeta: 0, total: 0 },
    egresos: { efectivo: 0, transferencia: 0, tarjeta: 0, total: 0 },
    totalCajaFija: 0,
    balanceGeneral: 0,
  });

  const cargarDatos = useCallback(async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (fechaInicio) params.append("fecha_inicio", fechaInicio);
      if (fechaFin) params.append("fecha_fin", fechaFin);
      const queryParams = params.toString() ? `?${params.toString()}` : "";

      const headers = {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      };

      const url = `${BASE_URL}/dashboard/cierre-caja-resumen/${queryParams}`;
      const response = await fetch(url, { headers });
      
      if (!response.ok) throw new Error("Error al obtener el resumen");
      const data = await response.json();

      calcularCierre(data);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudieron cargar los datos", "error");
    } finally {
      setLoading(false);
    }
  }, [fechaInicio, fechaFin]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

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

  const calcularCierre = (data) => {
    const ventas = data.ventas || {};
    const abonos = data.abonos || {};
    const egresos = data.egresos || {};

    let ing = { 
      efectivo: (ventas.Efectivo || 0) + (abonos.Efectivo || 0), 
      transferencia: (ventas.Transferencia || 0) + (abonos.Transferencia || 0), 
      tarjeta: (ventas.Tarjeta || 0) + (abonos.Tarjeta || 0), 
      total: (data.ventas_total_general || 0) + (data.abonos_total_general || 0)
    };
    
    let egr = { 
      efectivo: (egresos.Efectivo || 0), 
      transferencia: (egresos.Transferencia || 0), 
      tarjeta: (egresos.Tarjeta || 0), 
      total: (data.egresos_total_general || 0)
    };

    setResumen({
      ingresos: ing,
      egresos: egr,
      totalCajaFija: ing.efectivo - egr.efectivo,
      balanceGeneral: ing.total - egr.total,
    });
  };

  // Removed descargarExcel as requested

  const chartData = {
    labels: ['Efectivo', 'Transferencia', 'Tarjeta'],
    datasets: [
      {
        data: [resumen.ingresos.efectivo, resumen.ingresos.transferencia, resumen.ingresos.tarjeta],
        backgroundColor: ["#22c55e", "#3b82f6", "#f97316"],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col xl:flex-row justify-between items-center bg-white p-4 rounded-xl shadow gap-4">
        <h2 className="text-xl md:text-2xl font-bold text-[#712b39] w-full xl:w-auto text-center xl:text-left">
          Reporte de Caja
        </h2>
        
        {/* Filtros Rápidos */}
        <div className="flex flex-wrap justify-center bg-gray-100 p-1 rounded-lg w-full xl:w-auto overflow-x-auto">
          {["Hoy", "Este Mes", "Este Año", "Historico"].map((p) => (
            <button
              key={p}
              onClick={() => seleccionarPeriodo(p)}
              className={`px-3 py-2 text-xs md:text-sm font-semibold rounded-md transition-all flex-1 text-center whitespace-nowrap ${
                periodoActivo === p
                  ? "bg-white text-[#712b39] shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Filtros Personalizados */}
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full xl:w-auto justify-center">
          <input
            type="date"
            className="border rounded-md px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-[#712b39] focus:outline-none w-full sm:w-auto"
            value={fechaInicio}
            onChange={(e) => { setFechaInicio(e.target.value); setPeriodoActivo("Personalizado"); }}
          />
          <span className="text-gray-500 hidden sm:block">-</span>
          <input
            type="date"
            className="border rounded-md px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-[#712b39] focus:outline-none w-full sm:w-auto"
            value={fechaFin}
            onChange={(e) => { setFechaFin(e.target.value); setPeriodoActivo("Personalizado"); }}
          />
        </div>
      </div>

      {loading ? (
        <div className="py-4">
          <CardSkeleton count={3} />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="bg-gray-50 p-4 md:p-6 border-b text-center relative">
            <h1 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tight">Reporte Consolidado</h1>
            <p className="text-gray-500 mt-2 text-sm md:text-base font-medium">
              Periodo: {fechaInicio ? format(new Date(fechaInicio), "dd/MM/yyyy") : "Inicio"} al {fechaFin ? format(new Date(fechaFin), "dd/MM/yyyy") : "Actualidad"}
            </p>
          </div>

          <div className="p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
            {/* Tarjeta Caja Fija */}
            <div className="md:col-span-2 xl:col-span-3 bg-[#712b39] text-white rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row justify-between items-center sm:items-end shadow-md gap-4 text-center sm:text-left">
              <div>
                <h3 className="text-white/80 font-semibold uppercase tracking-wider text-xs md:text-sm">Balance de Efectivo</h3>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mt-2">Caja Fija</h2>
                <p className="mt-2 text-white/90 text-sm md:text-base">Ingresos físicos menos egresos físicos</p>
              </div>
              <div className="w-full sm:w-auto bg-black/10 p-4 rounded-xl sm:bg-transparent sm:p-0 sm:border-none border-t border-white/20 sm:mt-0 mt-4">
                <p className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight">${resumen.totalCajaFija.toFixed(2)}</p>
              </div>
            </div>

            {/* Desglose Ingresos */}
            <div className="border rounded-2xl p-5 md:p-6 bg-white shadow-sm space-y-4">
              <div className="flex flex-col xs:flex-row justify-between items-center xs:items-end border-b pb-4 gap-2 text-center xs:text-left">
                <h3 className="text-lg md:text-xl font-bold text-gray-800">Cuentas Ingreso</h3>
                <span className="text-xl md:text-2xl font-black text-green-600">+${resumen.ingresos.total.toFixed(2)}</span>
              </div>
              <ul className="space-y-3 pt-2 text-sm md:text-base">
                <li className="flex justify-between text-gray-600">
                  <span className="font-medium flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></span> Efectivo</span>
                  <span className="font-semibold text-gray-800">${resumen.ingresos.efectivo.toFixed(2)}</span>
                </li>
                <li className="flex justify-between text-gray-600">
                  <span className="font-medium flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></span> Transf.</span>
                  <span className="font-semibold text-gray-800">${resumen.ingresos.transferencia.toFixed(2)}</span>
                </li>
                <li className="flex justify-between text-gray-600">
                  <span className="font-medium flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0"></span> Tarjeta</span>
                  <span className="font-semibold text-gray-800">${resumen.ingresos.tarjeta.toFixed(2)}</span>
                </li>
              </ul>
            </div>

            {/* Desglose Egresos */}
            <div className="border rounded-2xl p-5 md:p-6 bg-white shadow-sm space-y-4">
              <div className="flex flex-col xs:flex-row justify-between items-center xs:items-end border-b pb-4 gap-2 text-center xs:text-left">
                <h3 className="text-lg md:text-xl font-bold text-gray-800">Cuentas Egreso</h3>
                <span className="text-xl md:text-2xl font-black text-red-600">-${resumen.egresos.total.toFixed(2)}</span>
              </div>
              <ul className="space-y-3 pt-2 text-sm md:text-base">
                <li className="flex justify-between text-gray-600">
                  <span className="font-medium flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0"></span> Efectivo</span>
                  <span className="font-semibold text-gray-800">${resumen.egresos.efectivo.toFixed(2)}</span>
                </li>
                <li className="flex justify-between text-gray-600">
                  <span className="font-medium flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></span> Transf.</span>
                  <span className="font-semibold text-gray-800">${resumen.egresos.transferencia.toFixed(2)}</span>
                </li>
                <li className="flex justify-between text-gray-600">
                  <span className="font-medium flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0"></span> Tarjeta</span>
                  <span className="font-semibold text-gray-800">${resumen.egresos.tarjeta.toFixed(2)}</span>
                </li>
              </ul>
            </div>

            {/* Balance General y Gráfico */}
            <div className="md:col-span-2 xl:col-span-1 border rounded-2xl p-5 md:p-6 bg-white shadow-sm flex flex-col items-center justify-center relative">
              <h3 className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 text-center">Rendimiento Operativo</h3>
              <p className={`text-3xl md:text-4xl font-black mb-4 ${resumen.balanceGeneral >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {resumen.balanceGeneral >= 0 ? '+' : ''}${resumen.balanceGeneral.toFixed(2)}
              </p>
              
              {resumen.ingresos.total > 0 ? (
                <div className="w-32 h-32 md:w-40 md:h-40">
                  <Pie data={chartData} options={{ plugins: { legend: { display: false } } }} />
                  <p className="text-xs text-center text-gray-400 mt-2">Medios de Pago</p>
                </div>
              ) : (
                <p className="text-gray-400 text-sm mt-4 md:mt-10">Sin ingresos en este periodo</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
