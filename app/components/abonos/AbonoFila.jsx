import {
  CalendarDays,
  DollarSign,
  User,
  MinusCircle,
  Info,
} from "lucide-react";

export default function AbonoFila({
  abono,
  onAbonar,
  onEditar,
  onVerVenta,
  onVerHistorialAbonos,
  loading,
}) {
  const total = parseFloat(abono.venta?.total_venta || 0);
  const pagado = parseFloat(abono.monto);
  const restante = abono.tieneAbono ? total - pagado : 0;
  const formatearFechaLocal = (fechaISO) => {
    return new Date(fechaISO).toLocaleDateString("es-EC", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <tr
      className="border-b hover:bg-gray-50 transition cursor-pointer"
      onClick={() => onVerHistorialAbonos(abono.venta?.id)}
    >
      <td className="p-3 flex items-center gap-2">
        <User className="w-4 h-4 text-gray-500" />
        {abono.cliente
          ? `${abono.cliente.nombre_cliente || ""} ${
              abono.cliente.apellido_cliente || ""
            }`.trim()
          : abono.venta?.cliente_venta
          ? `${abono.venta.cliente_venta.nombre_cliente || ""} ${
              abono.venta.cliente_venta.apellido_cliente || ""
            }`.trim()
          : "—"}
      </td>
      <td className="p-3">
        <button
          className="text-[#712b39] underline hover:opacity-80"
          onClick={(e) => {
            e.stopPropagation(); // Evita que se active el clic del <tr>
            onVerVenta(abono.venta);
          }}
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
          {formatearFechaLocal(abono.fecha)}
        </div>
      </td>
      <td className="p-3">{abono.metodo_pago}</td>
      <td className="p-3 text-center space-x-2">
        {abono.tieneAbono && !abono.completado && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation(); // Evita que el clic suba al <tr>
                onAbonar(abono);
              }}
              className="text-yellow-600 hover:text-yellow-800 transition"
              disabled={loading}
            >
              <MinusCircle className="w-5 h-5 mx-auto" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation(); // Evita que el clic suba al <tr>
                onEditar(abono);
              }}
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
