import React from "react";

export default function ModalDetalleVenta({ visible, onClose, venta, articulos }) {
  if (!visible || !venta) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-lg relative">
        <h2 className="text-2xl font-bold mb-4 text-[#712b39]">Venta #{venta.id}</h2>
        <p className="mb-4 text-sm">
          Cliente: <strong>{venta.cliente_venta?.nombre_cliente || "No disponible"}</strong>
        </p>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm text-left border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Producto</th>
                <th className="p-2 border">Cantidad</th>
                <th className="p-2 border">PVP</th>
                <th className="p-2 border text-red-600">Descuento</th>
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
                  <td className="p-2 border text-red-600">
                    -${parseFloat(item.descuento_articuloVenta || 0).toFixed(2)}
                  </td>
                  <td className="p-2 border">
                    ${(
                      item.cantidad_articuloVenta * parseFloat(item.pvp_articuloVenta) -
                      parseFloat(item.descuento_articuloVenta || 0)
                    ).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-col items-end text-sm border-t pt-4">
          <p className="mb-1">
            Subtotal Bruto: <strong>${(
              articulos.reduce((acc, item) => acc + (parseFloat(item.pvp_articuloVenta) * parseInt(item.cantidad_articuloVenta || 1)), 0)
            ).toFixed(2)}</strong>
          </p>
          <p className="mb-1 text-red-600">
            Descuento Total: <strong>-${(
              articulos.reduce((acc, item) => acc + parseFloat(item.descuento_articuloVenta || 0), 0)
            ).toFixed(2)}</strong>
          </p>
          <p className="mb-4 text-base">
            Total Final: <strong className="text-xl ml-2 text-[#712b39]">${parseFloat(venta.total_venta || 0).toFixed(2)}</strong>
          </p>
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
