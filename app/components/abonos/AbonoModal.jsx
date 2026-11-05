import React from "react";
import { DollarSign, CreditCard } from "lucide-react";

export default function AbonoModal({ abono = {}, loading, onClose, onSave, onChange }) {
  const total = parseFloat(abono.venta?.total_venta || 0);
  const montoActual = parseFloat(abono.monto || 0);
  const nuevoSaldo = Math.max(0, total - montoActual);
  const nombreCliente = abono.cliente?.nombre_cliente || abono.venta?.cliente_nombre || "Cliente";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="border-b pb-3">
          <h2 className="text-xl font-bold text-[#712b39]">
            Registrar Abono
          </h2>
          <p className="text-sm text-gray-500">
            Venta #{abono.venta?.id || "—"} para <span className="font-semibold text-gray-800">{nombreCliente}</span>
          </p>
        </div>

        {/* Resumen numérico visual */}
        <div className="grid grid-cols-3 gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100 text-center">
          <div>
            <p className="text-xs text-gray-500">Total Venta</p>
            <p className="text-base font-bold text-gray-800">${total.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Monto Abono</p>
            <p className="text-base font-bold text-emerald-600">${montoActual.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Saldo Restante</p>
            <p className={`text-base font-bold ${nuevoSaldo > 0 ? 'text-red-500' : 'text-emerald-700'}`}>
              ${nuevoSaldo.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Monto a Abonar ($)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <DollarSign className="w-5 h-5" />
              </div>
              <input
                type="number"
                step="0.01"
                min="0.01"
                max={total}
                value={abono.monto ?? ""}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  onChange("monto", isNaN(val) ? "" : Math.min(val, total));
                }}
                placeholder="0.00"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#712b39] focus:border-transparent outline-none text-lg font-bold text-gray-900"
                disabled={loading}
              />
            </div>
            {montoActual > total && (
              <p className="text-xs text-red-500 mt-1">El monto no puede superar el total de la venta.</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Método de Pago
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <CreditCard className="w-5 h-5" />
              </div>
              <select
                value={abono.metodo_pago || "Efectivo"}
                onChange={(e) => onChange("metodo_pago", e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#712b39] focus:border-transparent outline-none text-sm font-medium text-gray-800 bg-white"
                disabled={loading}
              >
                <option value="Efectivo">Efectivo</option>
                <option value="Transferencia">Transferencia bancaria</option>
                <option value="Tarjeta">Tarjeta de débito / crédito</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100 transition"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onSave}
            className="px-5 py-2.5 bg-[#712b39] text-white rounded-xl text-sm font-bold hover:bg-[#5e2131] shadow transition disabled:opacity-50"
            disabled={loading || !montoActual || montoActual <= 0}
          >
            {loading ? "Procesando..." : "Guardar Abono"}
          </button>
        </div>
      </div>
    </div>
  );
}
