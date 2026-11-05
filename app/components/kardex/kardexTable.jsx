"use client";
import React from "react";
import { TableSkeleton } from "../common/Skeleton";
import { Layers, ArrowDownLeft, ArrowUpRight, ArrowRightLeft } from "lucide-react";

/**
 * Muestra una tabla estilizada con los movimientos del Kardex de un producto.
 *
 * @param {Object} props
 * @param {boolean} props.isLoading - Si se están cargando los movimientos.
 * @param {Array} props.movimientos - Los movimientos del Kardex del producto.
 * @returns {JSX.Element}
 */
export default function KardexTable({ movimientos = [], isLoading = false }) {
  if (isLoading) {
    return <TableSkeleton rows={6} cols={8} />;
  }

  if (!movimientos.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-gray-50 rounded-xl border border-gray-100">
        <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-3 text-gray-400">
          <Layers className="w-6 h-6 text-[#712b39]" />
        </div>
        <h4 className="text-sm font-bold text-gray-700">Sin movimientos registrados</h4>
        <p className="text-xs text-gray-500 mt-1 max-w-sm">
          Selecciona un producto en la barra de búsqueda para auditar sus entradas, salidas y saldos valorados.
        </p>
      </div>
    );
  }

  const renderTipoBadge = (tipo) => {
    const lower = (tipo || "").toLowerCase();
    if (lower.includes("entrada") || lower.includes("ingreso") || lower.includes("compra")) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          <ArrowDownLeft className="w-3 h-3" />
          <span>{tipo}</span>
        </span>
      );
    }
    if (lower.includes("salida") || lower.includes("venta") || lower.includes("egreso")) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
          <ArrowUpRight className="w-3 h-3" />
          <span>{tipo}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
        <ArrowRightLeft className="w-3 h-3" />
        <span>{tipo}</span>
      </span>
    );
  };

  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return "—";
    try {
      const d = new Date(fechaStr);
      return d.toLocaleDateString("es-EC", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return fechaStr;
    }
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-xs">
      <table className="w-full min-w-[760px] border-collapse text-xs md:text-sm">
        <thead>
          <tr className="bg-[#712b39] text-white text-left font-semibold">
            <th className="p-3">Fecha y Hora</th>
            <th className="p-3">Tipo Movimiento</th>
            <th className="p-3 text-right">Cantidad</th>
            <th className="p-3 text-right">Costo Unitario</th>
            <th className="p-3 text-right">Costo Total</th>
            <th className="p-3 text-right">Saldo Cant.</th>
            <th className="p-3 text-right">Saldo Valor</th>
            <th className="p-3">Referencia</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {movimientos.map((mov) => (
            <tr key={mov.id} className="hover:bg-gray-50/80 transition-colors">
              <td className="p-3 text-gray-600 whitespace-nowrap">
                {formatearFecha(mov.fecha_kardex)}
              </td>
              <td className="p-3 whitespace-nowrap">
                {renderTipoBadge(mov.tipo_kardex)}
              </td>
              <td className="p-3 text-right font-bold text-gray-800">
                {mov.cantidad_kardex}
              </td>
              <td className="p-3 text-right text-gray-700">
                ${parseFloat(mov.costo_unitario_kardex || 0).toFixed(2)}
              </td>
              <td className="p-3 text-right font-semibold text-gray-900">
                ${parseFloat(mov.costo_total_kardex || 0).toFixed(2)}
              </td>
              <td className="p-3 text-right font-bold text-[#712b39]">
                {mov.saldo_cantidad_kardex}
              </td>
              <td className="p-3 text-right font-bold text-gray-900">
                ${parseFloat(mov.saldo_costo_kardex || 0).toFixed(2)}
              </td>
              <td className="p-3 text-gray-500 max-w-[160px] truncate" title={mov.referencia_kardex}>
                {mov.referencia_kardex || "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
