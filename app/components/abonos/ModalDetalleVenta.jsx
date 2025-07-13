import React from "react";

export default function ModalDetalleVenta({ visible, onClose, venta, articulos }) {
  if (!visible || !venta) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full shadow-lg relative">
        <h2 className="text-2xl font-bold mb-4 text-[#712b39]">Venta #{venta.id}</h2>
        <p className="mb-1 text-sm">
  Cliente: <strong>{venta.cliente_venta?.nombre_cliente || "No disponible"}</strong>
</p>
        <p className="mb-4 text-sm">Total: <strong>${parseFloat(venta.total_venta || 0).toFixed(2)}</strong></p>

        <table className="w-full text-sm text-left border">
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
<td className="p-2 border">
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
