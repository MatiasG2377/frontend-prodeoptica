import React from "react";

export default function ModalDetalleVenta({ visible, onClose, venta, articulos }) {
  if (!visible || !venta) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-lg relative">
        <h2 className="text-2xl font-bold mb-4 text-[#712b39]">Venta #{venta.id}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4 text-sm">
          <p>Cliente: <strong>{venta.cliente_venta?.nombre_cliente || "No disponible"}</strong></p>
          <p>Total: <strong>${parseFloat(venta.total_venta || 0).toFixed(2)}</strong></p>
          {venta.orden_laboratorio && (
            <p>Orden de Laboratorio: <strong>{venta.orden_laboratorio}</strong></p>
          )}
          {venta.orden_trabajo && (
            <p>Orden de Trabajo: <strong>{venta.orden_trabajo}</strong></p>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm text-left border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Producto</th>
                <th className="p-2 border">Cantidad</th>
                <th className="p-2 border">PVP</th>
                <th className="p-2 border">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {articulos.map((item) => (
                <tr key={item.id}>
<td className="p-2 border max-w-xs overflow-hidden overflow-ellipsis whitespace-nowrap" title={item.nombre_producto || ""}>
  {item.nombre_producto || "—"}
</td>


                  <td className="p-2 border">{item.cantidad_articuloVenta}</td>
                  <td className="p-2 border">${parseFloat(item.pvp_articuloVenta).toFixed(2)}</td>
                  <td className="p-2 border">
                    ${(item.cantidad_articuloVenta * parseFloat(item.pvp_articuloVenta)).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
