import { format } from "date-fns";

export default function HistorialAbonosModal({ visible, onClose, abonos }) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold text-[#712b39] mb-4">
          Historial de Abonos
        </h2>

        {abonos.length === 0 ? (
          <p className="text-gray-500">
            No hay abonos registrados para esta venta.
          </p>
        ) : (
          <table className="w-full border text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border-b">Fecha</th>
                <th className="p-2 border-b">Monto</th>
              </tr>
            </thead>
            <tbody>
              {abonos.map((abono) => (
                <tr key={abono.id}>
                  <td className="p-2 border-b">
                    {format(new Date(abono.fecha), "dd/MM/yyyy HH:mm")}
                  </td>
                  <td className="p-2 border-b">
                    ${parseFloat(abono.monto).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <button
          className="mt-4 bg-[#712b39] text-white px-4 py-2 rounded hover:bg-[#5a222f]"
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
