/**
 * Muestra una tabla con los movimientos del Kardex de un producto.
 *
 * Si isLoading es true, muestra un mensaje de carga.
 * Si movimientos no tiene elementos, muestra un mensaje de que no hay movimientos registrados.
 *
 *? @param {boolean} isLoading - Si se est  cargando los movimientos.
 *? @param {Array} movimientos - Los movimientos del Kardex del producto.
 *? @returns {JSX.Element} - La tabla con los movimientos del Kardex.
 */
export default function KardexTable({ movimientos, isLoading }) {
  if (isLoading)
    return <p className="text-gray-500">Cargando movimientos...</p>;
  if (!movimientos.length)
    return (
      <p className="text-gray-500">
        No hay movimientos registrados para este producto.
      </p>
    );

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Fecha</th>
            <th className="border p-2">Tipo</th>
            <th className="border p-2">Cantidad</th>
            <th className="border p-2">Costo Unitario</th>
            <th className="border p-2">Costo Total</th>
            <th className="border p-2">Saldo Cantidad</th>
            <th className="border p-2">Saldo Costo</th>
            <th className="border p-2">Referencia</th>
          </tr>
        </thead>
        <tbody>
          {movimientos.map((mov) => (
            <tr key={mov.id}>
              <td className="border p-2">
                {new Date(mov.fecha_kardex).toLocaleString()}
              </td>
              <td className="border p-2">{mov.tipo_kardex}</td>
              <td className="border p-2">{mov.cantidad_kardex}</td>
              <td className="border p-2">
                ${parseFloat(mov.costo_unitario_kardex || 0).toFixed(2)}
              </td>
              <td className="border p-2">
                ${parseFloat(mov.costo_total_kardex || 0).toFixed(2)}
              </td>
              <td className="border p-2">{mov.saldo_cantidad_kardex}</td>
              <td className="border p-2">
                ${parseFloat(mov.saldo_costo_kardex || 0).toFixed(2)}
              </td>
              <td className="border p-2">{mov.referencia_kardex}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
