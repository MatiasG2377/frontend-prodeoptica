import React, { useState } from "react";
import Swal from "sweetalert2";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function FichaVisual({ data }) {
  const [abierto, setAbierto] = useState(false);
  const [editando, setEditando] = useState(false);
  const [fichaEditada, setFichaEditada] = useState(data);
  const datosParaEnviar = {
    ...fichaEditada,
    paciente: fichaEditada.paciente?.id, // o null
    usuario: fichaEditada.usuario?.id, // si aplica
  };

  const handleGuardarEdicion = async () => {
    try {
      const res = await fetch(`${BASE_URL}/fichas-medicas/${data.id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datosParaEnviar),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error("Error al guardar cambios: " + err);
      }

      const actualizada = await res.json();
      setEditando(false);
      setFichaEditada(actualizada);
      Swal.fire({
        icon: "success",
        title: "Ficha actualizada",
        text: "Los cambios fueron guardados exitosamente.",
        confirmButtonColor: "#7d2a3f",
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron guardar los cambios.",
        confirmButtonColor: "#7d2a3f",
      });
    }
  };
  const handleChange = (campo, valor) => {
    setFichaEditada((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  return (
    <div className="border border-gray-300 rounded-lg bg-white shadow-md mb-4">
      <button
        onClick={() => setAbierto(!abierto)}
        className="w-full text-left p-4 bg-[#7d2a3f] text-white font-semibold rounded-t-lg hover:bg-[#661f33] transition"
      >
        Ficha {new Date(data.fecha).toLocaleDateString()}
      </button>

      {abierto && (
        <div className="p-4 border-t border-gray-300">
          <div className="space-y-6">
            <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-md mb-6">
              <div className="flex justify-end mb-2">
                {!editando ? (
                  <button
                    className="text-base bg-[#7d2a3f] text-white px-4 py-2 rounded hover:bg-[#661f33]"
                    onClick={() => setEditando(true)}
                  >
                    Editar
                  </button>
                ) : (
                  <button
                    className="text-base bg-[#7d2a3f] text-white px-4 py-2 rounded hover:bg-[#661f33]"
                    onClick={handleGuardarEdicion}
                  >
                    Guardar cambios
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                      <th className="p-2 border border-gray-300 font-bold">
                        Ojo
                      </th>
                      <th className="p-2 border border-gray-300 font-bold">
                        A.V.
                      </th>
                      <th className="p-2 border border-gray-300 font-bold">
                        Esfera
                      </th>
                      <th className="p-2 border border-gray-300 font-bold">
                        Cilindro
                      </th>
                      <th className="p-2 border border-gray-300 font-bold">
                        Eje(Grados)
                      </th>
                      <th className="p-2 border border-gray-300 font-bold">
                        DNP(mm)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        label: "Distancia",
                        tipo: "distancia",
                        campos: ["av", "esfera", "cilindro", "eje", "dnp"],
                      },
                      {
                        label: "A.D.D.",
                        tipo: "add",
                        campos: ["av", "esfera"],
                      },
                      {
                        label: "Lectura",
                        tipo: "lectura",
                        campos: ["av", "esfera", "cilindro", "eje"],
                      },
                    ].map(({ label, tipo, campos }) => (
                      <React.Fragment key={tipo}>
                        <tr>
                          <td
                            rowSpan={2}
                            className="p-2 border border-gray-300 bg-gray-100 font-medium align-middle"
                          >
                            {label}
                          </td>
                          <td className="p-2 border border-gray-300">OD</td>
                          {["av", "esfera", "cilindro", "eje", "dnp"].map(
                            (campo) =>
                              campos.includes(campo) ? (
                                <td
                                  key={`od_${tipo}_${campo}`}
                                  className="p-2 border border-gray-300"
                                >
                                  {editando ? (
                                    <input
                                      type="text"
                                      value={
                                        fichaEditada[
                                          `rx_${tipo}_od_${campo}`
                                        ] || ""
                                      }
                                      onChange={(e) =>
                                        handleChange(
                                          `rx_${tipo}_od_${campo}`,
                                          e.target.value
                                        )
                                      }
                                      className="w-full border rounded px-2 py-1"
                                    />
                                  ) : (
                                    fichaEditada[`rx_${tipo}_od_${campo}`] || ""
                                  )}
                                </td>
                              ) : null
                          )}
                        </tr>
                        <tr>
                          <td className="p-2 border border-gray-300">OI</td>
                          {["av", "esfera", "cilindro", "eje", "dnp"].map(
                            (campo) =>
                              campos.includes(campo) ? (
                                <td
                                  key={`oi_${tipo}_${campo}`}
                                  className="p-2 border border-gray-300"
                                >
                                  {editando ? (
                                    <input
                                      type="text"
                                      value={
                                        fichaEditada[
                                          `rx_${tipo}_oi_${campo}`
                                        ] || ""
                                      }
                                      onChange={(e) =>
                                        handleChange(
                                          `rx_${tipo}_oi_${campo}`,
                                          e.target.value
                                        )
                                      }
                                      className="w-full border rounded px-2 py-1"
                                    />
                                  ) : (
                                    fichaEditada[`rx_${tipo}_oi_${campo}`] || ""
                                  )}
                                </td>
                              ) : null
                          )}
                        </tr>
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>

                {/* ESQUIASCOPIA */}
                <table className="w-full border-collapse mt-6">
                  <thead>
                    <tr>
                      <th
                        colSpan={6}
                        className="bg-[#7d2a3f] text-white text-left p-2 font-bold border border-gray-300"
                      >
                        ESQUIASCOPÍA
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
                        <td className="p-2 border border-gray-300 font-medium uppercase">
                          {ojo.toUpperCase()}
                        </td>
                        {["sc", "cc", "esfera", "cilindro", "eje"].map(
                          (campo) => (
                            <td
                              key={`${ojo}_${campo}`}
                              className="p-2 border border-gray-300"
                            >
                              {editando ? (
                                <input
                                  type="text"
                                  value={
                                    fichaEditada[`esq_${ojo}_${campo}`] || ""
                                  }
                                  onChange={(e) =>
                                    handleChange(
                                      `esq_${ojo}_${campo}`,
                                      e.target.value
                                    )
                                  }
                                  className="w-full border rounded px-2 py-1"
                                />
                              ) : (
                                fichaEditada[`esq_${ojo}_${campo}`] || ""
                              )}
                            </td>
                          )
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* ESQUIASCOPIA COMPUTARIZADA */}
                <table className="w-full border-collapse mt-4">
                  <thead>
                    <tr>
                      <th
                        colSpan={4}
                        className="bg-[#7d2a3f] text-white text-left p-2 font-bold border border-gray-300"
                      >
                        ESQUIASCOPÍA COMPUTARIZADA
                      </th>
                    </tr>
                    <tr className="bg-gray-100">
                      <th className="p-2 border border-gray-300">Ojo</th>
                      <th className="p-2 border border-gray-300">Esfera</th>
                      <th className="p-2 border border-gray-300">Cilindro</th>
                      <th className="p-2 border border-gray-300">Eje</th>
                    </tr>
                  </thead>
                  <tbody>
                    {["od", "oi"].map((ojo) => (
                      <tr key={ojo}>
                        <td className="p-2 border border-gray-300 font-medium uppercase">
                          {ojo.toUpperCase()}
                        </td>
                        {["esfera", "cilindro", "eje"].map((campo) => (
                          <td
                            key={`${ojo}_${campo}_comp`}
                            className="p-2 border border-gray-300"
                          >
                            {editando ? (
                              <input
                                type="text"
                                value={
                                  fichaEditada[`esq_${ojo}_${campo}_comp`] || ""
                                }
                                onChange={(e) =>
                                  handleChange(
                                    `esq_${ojo}_${campo}_comp`,
                                    e.target.value
                                  )
                                }
                                className="w-full border rounded px-2 py-1"
                              />
                            ) : (
                              fichaEditada[`esq_${ojo}_${campo}_comp`] || ""
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* RX FINAL */}
                <table className="w-full border-collapse lg:col-span-2 mt-4">
                  <thead>
                    <tr>
                      <th
                        colSpan={5}
                        className="bg-[#7d2a3f] text-white text-left p-2 font-bold border border-gray-300"
                      >
                        RX FINAL
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
                        <td className="p-2 border border-gray-300 font-medium uppercase">
                          {ojo.toUpperCase()}
                        </td>
                        {["esfera", "cilindro", "eje", "correccion"].map(
                          (campo) => (
                            <td
                              key={`rs_${ojo}_${campo}`}
                              className="p-2 border border-gray-300"
                            >
                              {editando ? (
                                <input
                                  type="text"
                                  value={
                                    fichaEditada[`rs_${ojo}_${campo}`] || ""
                                  }
                                  onChange={(e) =>
                                    handleChange(
                                      `rs_${ojo}_${campo}`,
                                      e.target.value
                                    )
                                  }
                                  className="w-full border rounded px-2 py-1"
                                />
                              ) : (
                                fichaEditada[`rs_${ojo}_${campo}`] || ""
                              )}
                            </td>
                          )
                        )}
                      </tr>
                    ))}
                    <tr>
                      <td className="p-2 border border-gray-300 font-medium">
                        A.D.D
                      </td>
                      {["esfera", "cilindro", "eje", "correccion"].map(
                        (campo) => (
                          <td
                            key={`rs_add_${campo}`}
                            className="p-2 border border-gray-300"
                          >
                            {editando ? (
                              <input
                                type="text"
                                value={fichaEditada[`rs_add_${campo}`] || ""}
                                onChange={(e) =>
                                  handleChange(
                                    `rs_add_${campo}`,
                                    e.target.value
                                  )
                                }
                                className="w-full border rounded px-2 py-1"
                              />
                            ) : (
                              fichaEditada[`rs_add_${campo}`] || ""
                            )}
                          </td>
                        )
                      )}
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
                        {editando ? (
                          <input
                            type="text"
                            value={fichaEditada.altura || ""}
                            onChange={(e) =>
                              handleChange("altura", e.target.value)
                            }
                            className="w-full border rounded px-2 py-1"
                          />
                        ) : (
                          fichaEditada.altura || ""
                        )}
                      </td>
                      <td className="p-2 border border-gray-300 font-medium">
                        Material
                      </td>
                      <td className="p-2 border border-gray-300">
                        {editando ? (
                          <input
                            type="text"
                            value={fichaEditada.material || ""}
                            onChange={(e) =>
                              handleChange("material", e.target.value)
                            }
                            className="w-full border rounded px-2 py-1"
                          />
                        ) : (
                          fichaEditada.material || ""
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 border border-gray-300 font-medium">
                        Observaciones
                      </td>
                      <td colSpan={3} className="p-2 border border-gray-300">
                        {editando ? (
                          <textarea
                            value={fichaEditada.observaciones || ""}
                            onChange={(e) =>
                              handleChange("observaciones", e.target.value)
                            }
                            className="w-full border rounded px-2 py-1"
                            rows={2}
                          />
                        ) : (
                          fichaEditada.observaciones || ""
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 border border-gray-300 font-medium">
                        Causa
                      </td>
                      <td colSpan={3} className="p-2 border border-gray-300">
                        {editando ? (
                          <input
                            type="text"
                            value={fichaEditada.causa || ""}
                            onChange={(e) =>
                              handleChange("causa", e.target.value)
                            }
                            className="w-full border rounded px-2 py-1"
                          />
                        ) : (
                          fichaEditada.causa || ""
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 border border-gray-300 font-medium">
                        Armazón
                      </td>
                      <td colSpan={3} className="p-2 border border-gray-300">
                        {editando ? (
                          <input
                            type="text"
                            value={fichaEditada.armazon || ""}
                            onChange={(e) =>
                              handleChange("armazon", e.target.value)
                            }
                            className="w-full border rounded px-2 py-1"
                          />
                        ) : (
                          fichaEditada.armazon || ""
                        )}
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
