import {
  CalendarDays,
  User,
  PlusCircle,
  CheckCircle2,
} from "lucide-react";

export default function AbonoFila({
  abono,
  onAbonar,
  onVerVenta,
  onVerHistorialAbonos,
  loading,
}) {
  const total = parseFloat(abono.venta?.total_venta || 0);
  const pagado = parseFloat(abono.monto || 0);
  const restante = Math.max(0, total - pagado);
  const porcentaje = total > 0 ? Math.min(100, Math.round((pagado / total) * 100)) : 100;

  const formatearFechaLocal = (fechaISO) => {
    if (!fechaISO) return "—";
    return new Date(fechaISO).toLocaleDateString("es-EC", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const nombreCliente = abono.cliente
    ? `${abono.cliente.nombre_cliente || ""} ${abono.cliente.apellido_cliente || ""}`.trim()
    : abono.venta?.cliente_venta
    ? `${abono.venta.cliente_venta.nombre_cliente || ""} ${abono.venta.cliente_venta.apellido_cliente || ""}`.trim()
    : "Cliente Mostrador";

  return (
    <tr
      className="border-b hover:bg-gray-50 transition cursor-pointer"
      onClick={() => onVerHistorialAbonos(abono.venta?.id)}
    >
      <td className="p-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[#712b39]">
            <User className="w-4 h-4" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">{nombreCliente}</p>
            {abono.cliente?.ci_cliente && (
              <p className="text-xs text-gray-400">CI: {abono.cliente.ci_cliente}</p>
            )}
          </div>
        </div>
      </td>

      <td className="p-3">
        <button
          className="text-[#712b39] font-bold underline hover:opacity-80 text-sm"
          onClick={(e) => {
            e.stopPropagation();
            onVerVenta(abono.venta);
          }}
          disabled={!abono.venta}
        >
          #{abono.venta?.id || "—"}
        </button>
      </td>

      <td className="p-3 text-gray-800 font-semibold text-sm">
        ${total.toFixed(2)}
      </td>

      <td className="p-3">
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="font-bold text-emerald-600">${pagado.toFixed(2)}</span>
            <span className="text-gray-400">{porcentaje}%</span>
          </div>
          <div className="w-24 bg-gray-200 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                porcentaje === 100 ? 'bg-emerald-500' : 'bg-[#712b39]'
              }`}
              style={{ width: `${porcentaje}%` }}
            />
          </div>
        </div>
      </td>

      <td className="p-3">
        <span className={`text-sm font-bold ${restante > 0 ? 'text-red-500' : 'text-gray-400'}`}>
          ${restante.toFixed(2)}
        </span>
      </td>

      <td className="p-3 whitespace-nowrap">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <CalendarDays className="w-3.5 h-3.5 text-gray-400" />
          {formatearFechaLocal(abono.fecha)}
        </div>
      </td>

      <td className="p-3">
        <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 font-medium border border-gray-200">
          {abono.metodo_pago || "Efectivo"}
        </span>
      </td>

      <td className="p-3 text-center">
        {restante > 0 ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAbonar(abono);
            }}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#712b39] text-white hover:bg-[#5e242e] shadow-sm transition active:scale-95"
            disabled={loading}
            title="Registrar nuevo abono"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Abonar</span>
          </button>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Completado</span>
          </span>
        )}
      </td>
    </tr>
  );
}
