// components/abonos/AbonoTabla.jsx
import AbonoFila from "./AbonoFila";

export default function AbonoTabla({ abonos, onAbonar, onEditar, onVerVenta, loading }) {
  if (abonos.length === 0) {
    return <p className="text-gray-500">No hay abonos pendientes</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border border-gray-200 text-sm">
        <thead className="bg-[#712b39] text-white text-left">
          <tr>
            <th className="p-3">Cliente</th>
            <th className="p-3">Venta</th>
            <th className="p-3">Total Venta</th>
            <th className="p-3">Restante</th>
            <th className="p-3">Monto Abonado</th>
            <th className="p-3">Fecha</th>
            <th className="p-3">Método de Pago</th>
            <th className="p-3 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {abonos.map((abono) => (
            <AbonoFila
  key={abono.id}
  abono={abono}
  onAbonar={onAbonar}
  onEditar={onEditar}
  onVerVenta={onVerVenta}
  loading={loading}
/>

          ))}
        </tbody>
      </table>
    </div>
  );
}
