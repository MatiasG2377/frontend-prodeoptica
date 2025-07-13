import { CalendarDays, DollarSign, User, MinusCircle, Info } from "lucide-react";

export default function AbonoFila({ abono, onAbonar, onEditar, onVerVenta, loading }) {
  const total = parseFloat(abono.venta?.total_venta || 0);
  const pagado = parseFloat(abono.monto);
  const restante = abono.tieneAbono ? total - pagado : 0;

  return (
    <tr className="border-b hover:bg-gray-50 transition">
      <td className="p-3 flex items-center gap-2">
        <User className="w-4 h-4 text-gray-500" />
        {abono.cliente?.nombre_cliente || abono.venta?.cliente_venta?.nombre_cliente || "—"}
      </td>

      <td className="p-3">
        <button
          className="text-[#712b39] underline hover:opacity-80"
          onClick={() => onVerVenta(abono.venta)}
          disabled={!abono.venta}
        >
          #{abono.venta?.id || "—"}
        </button>
      </td>

      <td className="p-3 text-gray-800 font-medium">${total.toFixed(2)}</td>

      <td className="p-3 text-red-500 font-medium">${restante.toFixed(2)}</td>

      <td className="p-3 text-green-600 font-medium flex items-center gap-1">
        <DollarSign className="w-4 h-4" /> {pagado.toFixed(2)}
      </td>

      <td className="p-3 whitespace-nowrap">
        <div className="flex items-center gap-2 text-gray-500">
          <CalendarDays className="w-4 h-4" />
          {new Date(abono.fecha).toLocaleDateString()}
        </div>
      </td>

      <td className="p-3">{abono.metodo_pago}</td>

      <td className="p-3 text-center space-x-2">
      {abono.tieneAbono && !abono.completado && (
  <>
    <button
      onClick={() => onAbonar(abono)}
      className="text-yellow-600 hover:text-yellow-800 transition"
      disabled={loading}
    >
      <MinusCircle className="w-5 h-5 mx-auto" />
    </button>
    <button
      onClick={() => onEditar(abono)}
      className="text-blue-600 hover:text-blue-800 transition"
      disabled={loading}
    >
      <Info className="w-5 h-5 mx-auto" />
    </button>
  </>
)}
{abono.completado && (
  <span className="text-green-600 font-semibold">Completado</span>
)}

      </td>
    </tr>
  );
}
