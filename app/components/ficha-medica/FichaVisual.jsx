import React, { useState } from "react";

export default function FichaVisual({ data }) {
  const [abierto, setAbierto] = useState(false);

  return (
    <div className="border border-gray-300 rounded-lg bg-white shadow-md mb-4">
      <button
        onClick={() => setAbierto(!abierto)}
        className="w-full text-left p-4 bg-[#7d2a3f] text-white font-semibold rounded-t-lg hover:bg-[#661f33] transition"
      >
        Ficha #{data.id} – {new Date(data.fecha).toLocaleDateString()}
      </button>

      {abierto && (
        <div className="p-4 border-t border-gray-300">
          <div className="space-y-6">
            <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-md mb-6">
              <h3 className="text-lg font-bold text-[#7d2a3f] mb-4">
                Ficha #{data.id} - {new Date(data.fecha).toLocaleDateString()}
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* RX REFRACCIÓN */}
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th
                        colSpan={7}
                        className="bg-[#7d2a3f] text-white text-left p-2 font-bold border border-gray-300"
                      >
                        RX. REFRACCIÓN
                      </th>
                    </tr>
                    <tr className="bg-gray-100">
                      <th className="p-2 border border-gray-300"></th>
                      <th className="p-2 border border-gray-300">Ojo</th>
                      <th className="p-2 border border-gray-300">A.V.</th>
                      <th className="p-2 border border-gray-300">Esfera</th>
                      <th className="p-2 border border-gray-300">Cilindro</th>
                      <th className="p-2 border border-gray-300">Eje</th>
                      <th className="p-2 border border-gray-300">DNP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {["Distancia", "A.D.D.", "Lectura"].map((tipo, idx) => (
                      <React.Fragment key={tipo}>
                        <tr>
                          <td
                            rowSpan={2}
                            className="p-2 border border-gray-300 bg-gray-100 font-medium"
                          >
                            {tipo}
                          </td>
                          <td className="p-2 border border-gray-300">OD</td>
                          <td className="p-2 border border-gray-300">
                            {data[`rx_${tipo.toLowerCase()}_od_av`]}
                          </td>
                          <td className="p-2 border border-gray-300">
                            {data[`rx_${tipo.toLowerCase()}_od_esfera`]}
                          </td>
                          <td className="p-2 border border-gray-300">
                            {data[`rx_${tipo.toLowerCase()}_od_cilindro`]}
                          </td>
                          <td className="p-2 border border-gray-300">
                            {data[`rx_${tipo.toLowerCase()}_od_eje`]}
                          </td>
                          <td className="p-2 border border-gray-300">
                            {data[`rx_${tipo.toLowerCase()}_od_dnp`]}
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-gray-300">OI</td>
                          <td className="p-2 border border-gray-300">
                            {data[`rx_${tipo.toLowerCase()}_oi_av`]}
                          </td>
                          <td className="p-2 border border-gray-300">
                            {data[`rx_${tipo.toLowerCase()}_oi_esfera`]}
                          </td>
                          <td className="p-2 border border-gray-300">
                            {data[`rx_${tipo.toLowerCase()}_oi_cilindro`]}
                          </td>
                          <td className="p-2 border border-gray-300">
                            {data[`rx_${tipo.toLowerCase()}_oi_eje`]}
                          </td>
                          <td className="p-2 border border-gray-300">
                            {data[`rx_${tipo.toLowerCase()}_oi_dnp`]}
                          </td>
                        </tr>
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>

                {/* ESQUIASCOPIA */}
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th
                        colSpan={7}
                        className="bg-[#7d2a3f] text-white text-left p-2 font-bold border border-gray-300"
                      >
                        ESQUIASCOPIA
                      </th>
                    </tr>
                    <tr className="bg-gray-100">
                      <th className="p-2 border border-gray-300">Ojo</th>
                      <th className="p-2 border border-gray-300">S.C</th>
                      <th className="p-2 border border-gray-300">C.C</th>
                      <th className="p-2 border border-gray-300">Esfera</th>
                      <th className="p-2 border border-gray-300">Cilindro</th>
                      <th className="p-2 border border-gray-300">
                        Eje(grados)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {["od", "oi"].map((ojo) => (
                      <tr key={ojo}>
                        <td className="p-2 border border-gray-300 font-medium">
                          {ojo.toUpperCase()}
                        </td>
                        <td className="p-2 border border-gray-300">
                          {data[`esq_${ojo}_sc`]}
                        </td>
                        <td className="p-2 border border-gray-300">
                          {data[`esq_${ojo}_cc`]}
                        </td>
                        <td className="p-2 border border-gray-300">
                          {data[`esq_${ojo}_esfera`]}
                        </td>
                        <td className="p-2 border border-gray-300">
                          {data[`esq_${ojo}_cilindro`]}
                        </td>
                        <td className="p-2 border border-gray-300">
                          {data[`esq_${ojo}_eje`]}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Refracción rs */}
                <table className="w-full border-collapse lg:col-span-2 mt-4">
                  <thead>
                    <tr>
                      <th
                        colSpan={5}
                        className="bg-[#7d2a3f] text-white text-left p-2 font-bold border border-gray-300"
                      >
                        Refracción rs
                      </th>
                    </tr>
                    <tr className="bg-gray-100">
                      <th className="p-2 border border-gray-300">Ojo</th>
                      <th className="p-2 border border-gray-300">Esfera</th>
                      <th className="p-2 border border-gray-300">Cilindro</th>
                      <th className="p-2 border border-gray-300">
                        Eje(grados)
                      </th>
                      <th className="p-2 border border-gray-300">Corrección</th>
                    </tr>
                  </thead>
                  <tbody>
                    {["od", "oi"].map((ojo) => (
                      <tr key={ojo}>
                        <td className="p-2 border border-gray-300 font-medium">
                          {ojo.toUpperCase()}
                        </td>
                        <td className="p-2 border border-gray-300">
                          {data[`rs_${ojo}_esfera`]}
                        </td>
                        <td className="p-2 border border-gray-300">
                          {data[`rs_${ojo}_cilindro`]}
                        </td>
                        <td className="p-2 border border-gray-300">
                          {data[`rs_${ojo}_eje`]}
                        </td>
                        <td className="p-2 border border-gray-300">
                          {data[`rs_${ojo}_correccion`]}
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td className="p-2 border border-gray-300 font-medium">
                        A.D.D
                      </td>
                      <td className="p-2 border border-gray-300">
                        {data.rs_add_esfera}
                      </td>
                      <td className="p-2 border border-gray-300">
                        {data.rs_add_cilindro}
                      </td>
                      <td className="p-2 border border-gray-300">
                        {data.rs_add_eje}
                      </td>
                      <td className="p-2 border border-gray-300">
                        {data.rs_add_correccion}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Extras */}
                <table className="w-full border-collapse lg:col-span-2 mt-4">
                  <tbody>
                    <tr>
                      <td className="p-2 border border-gray-300 font-medium">
                        Altura
                      </td>
                      <td className="p-2 border border-gray-300">
                        {data.altura}
                      </td>
                      <td className="p-2 border border-gray-300 font-medium">
                        Material
                      </td>
                      <td className="p-2 border border-gray-300">
                        {data.material}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 border border-gray-300 font-medium">
                        Observaciones
                      </td>
                      <td colSpan={3} className="p-2 border border-gray-300">
                        {data.observaciones}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 border border-gray-300 font-medium">
                        Causa
                      </td>
                      <td colSpan={3} className="p-2 border border-gray-300">
                        {data.causa}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
