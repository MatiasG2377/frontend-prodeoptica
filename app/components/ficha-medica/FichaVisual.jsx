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
          <div className="p-4 border-t border-gray-300">
            <div className="flex justify-end space-y-6">
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
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* RX ANTERIOR */}
            <table className="w-full border-collapse mt-4">
              <thead>
                <tr>
                  <th
                    colSpan={6}
                    className="bg-[#7d2a3f] text-white text-left p-2 font-bold border border-gray-300"
                  >
                    RX ANTERIOR
                  </th>
                </tr>
                <tr className="bg-gray-100">
                  <th className="p-2 border border-gray-300">Ojo</th>
                  <th className="p-2 border border-gray-300">AV SC</th>
                  <th className="p-2 border border-gray-300">Esfera</th>
                  <th className="p-2 border border-gray-300">Cilindro</th>
                  <th className="p-2 border border-gray-300">Eje (grados)</th>
                  <th className="p-2 border border-gray-300">AV CC</th>
                </tr>
              </thead>
              <tbody>
                {["od", "oi"].map((ojo) => (
                  <tr key={ojo}>
                    <td className="p-2 border border-gray-300 font-medium uppercase">
                      {ojo.toUpperCase()}
                    </td>
                    <td className="p-2 border border-gray-300">
                      {editando ? (
                        <input
                          type="text"
                          value={fichaEditada[`rx_anterior_${ojo}_avsc`] || ""}
                          onChange={(e) =>
                            handleChange(
                              `rx_anterior_${ojo}_avsc`,
                              e.target.value
                            )
                          }
                          className="w-full border rounded px-2 py-1"
                        />
                      ) : (
                        fichaEditada[`rx_anterior_${ojo}_avsc`] || ""
                      )}
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
                              value={fichaEditada[`rs_${ojo}_${campo}`] || ""}
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
                  <td className="p-2 border border-gray-300">
                    {editando ? (
                      <input
                        type="text"
                        value={fichaEditada[`rx_anterior_add_avsc`] || ""}
                        onChange={(e) =>
                          handleChange(`rx_anterior_add_avsc`, e.target.value)
                        }
                        className="w-full border rounded px-2 py-1"
                      />
                    ) : (
                      fichaEditada[`rx_anterior_add_avsc`] || ""
                    )}
                  </td>
                  {["esfera", "cilindro", "eje", "correccion"].map((campo) => (
                    <td
                      key={`rs_add_${campo}`}
                      className="p-2 border border-gray-300"
                    >
                      {editando ? (
                        <input
                          type="text"
                          value={fichaEditada[`rs_add_${campo}`] || ""}
                          onChange={(e) =>
                            handleChange(`rs_add_${campo}`, e.target.value)
                          }
                          className="w-full border rounded px-2 py-1"
                        />
                      ) : (
                        fichaEditada[`rs_add_${campo}`] || ""
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>

            {/* EXAMÉN COMPUTARIZADO */}
            <div className="overflow-x-auto mt-4">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th
                      colSpan={4}
                      className="bg-[#7d2a3f] text-white text-left p-2 font-bold border border-gray-300"
                    >
                      EXAMÉN COMPUTARIZADO
                    </th>
                  </tr>
                  <tr className="bg-gray-100">
                    <th className="p-2 border border-gray-300">Ojo</th>
                    <th className="p-2 border border-gray-300">Esfera</th>
                    <th className="p-2 border border-gray-300">Cilindro</th>
                    <th className="p-2 border border-gray-300">Eje (grados)</th>
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
                          key={`esq_${ojo}_${campo}_computarizado`}
                          className="p-2 border border-gray-300"
                        >
                          {editando ? (
                            <input
                              type="text"
                              value={
                                fichaEditada[
                                  `esq_${ojo}_${campo}_computarizado`
                                ] || ""
                              }
                              onChange={(e) =>
                                handleChange(
                                  `esq_${ojo}_${campo}_computarizado`,
                                  e.target.value
                                )
                              }
                              className="w-full border rounded px-2 py-1"
                            />
                          ) : (
                            fichaEditada[`esq_${ojo}_${campo}_computarizado`] ||
                            ""
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* RX. REFRACCIÓN - Sin cambios */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 mt-4 text-sm">
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
                    <th className="p-2 border border-gray-300 font-bold">
                      A.V.
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Distancia */}
                  {["od", "oi"].map((ojo) => (
                    <tr key={`distancia_${ojo}`}>
                      {ojo === "od" && (
                        <td
                          rowSpan={2}
                          className="p-2 border border-gray-300 bg-gray-100 font-medium"
                        >
                          Distancia
                        </td>
                      )}
                      <td className="p-2 border border-gray-300 font-medium">
                        {ojo.toUpperCase()}
                      </td>
                      {["esfera", "cilindro", "eje", "dnp", "av"].map(
                        (campo) => (
                          <td
                            key={`rx_distancia_${ojo}_${campo}`}
                            className="p-2 border border-gray-300"
                          >
                            {editando ? (
                              <input
                                type="text"
                                value={
                                  fichaEditada[
                                    `rx_distancia_${ojo}_${campo}`
                                  ] || ""
                                }
                                onChange={(e) =>
                                  handleChange(
                                    `rx_distancia_${ojo}_${campo}`,
                                    e.target.value
                                  )
                                }
                                className="w-full border rounded px-2 py-1"
                              />
                            ) : (
                              fichaEditada[`rx_distancia_${ojo}_${campo}`] || ""
                            )}
                          </td>
                        )
                      )}
                    </tr>
                  ))}

                  {/* A.D.D. */}
                  {["od", "oi"].map((ojo) => (
                    <tr key={`add_${ojo}`}>
                      {ojo === "od" && (
                        <td
                          rowSpan={2}
                          className="p-2 border border-gray-300 bg-gray-100 font-medium"
                        >
                          A.D.D.
                        </td>
                      )}
                      <td className="p-2 border border-gray-300 font-medium">
                        {ojo.toUpperCase()}
                      </td>
                      {/* Solo esfera, el resto gris */}
                      <td className="p-2 border border-gray-300">
                        {editando ? (
                          <input
                            type="text"
                            value={fichaEditada[`rx_add_${ojo}_esfera`] || ""}
                            onChange={(e) =>
                              handleChange(
                                `rx_add_${ojo}_esfera`,
                                e.target.value
                              )
                            }
                            className="w-full border rounded px-2 py-1"
                          />
                        ) : (
                          fichaEditada[`rx_add_${ojo}_esfera`] || ""
                        )}
                      </td>
                      <td
                        className="p-2 border border-gray-300 bg-gray-200"
                        colSpan={3}
                      ></td>
                      <td className="p-2 border border-gray-300">
                        {editando ? (
                          <input
                            type="text"
                            value={fichaEditada[`rx_add_${ojo}_av`] || ""}
                            onChange={(e) =>
                              handleChange(`rx_add_${ojo}_av`, e.target.value)
                            }
                            className="w-full border rounded px-2 py-1"
                          />
                        ) : (
                          fichaEditada[`rx_add_${ojo}_av`] || ""
                        )}
                      </td>
                    </tr>
                  ))}

                  {/* Lectura */}
                  {["od", "oi"].map((ojo) => (
                    <tr key={`lectura_${ojo}`}>
                      {ojo === "od" && (
                        <td
                          rowSpan={2}
                          className="p-2 border border-gray-300 bg-gray-100 font-medium"
                        >
                          Lectura
                        </td>
                      )}
                      <td className="p-2 border border-gray-300 font-medium">
                        {ojo.toUpperCase()}
                      </td>
                      {["esfera", "cilindro", "eje"].map((campo) => (
                        <td
                          key={`rx_lectura_${ojo}_${campo}`}
                          className="p-2 border border-gray-300"
                        >
                          {editando ? (
                            <input
                              type="text"
                              value={
                                fichaEditada[`rx_lectura_${ojo}_${campo}`] || ""
                              }
                              onChange={(e) =>
                                handleChange(
                                  `rx_lectura_${ojo}_${campo}`,
                                  e.target.value
                                )
                              }
                              className="w-full border rounded px-2 py-1"
                            />
                          ) : (
                            fichaEditada[`rx_lectura_${ojo}_${campo}`] || ""
                          )}
                        </td>
                      ))}
                      <td className="p-2 border border-gray-300 bg-gray-200"></td>
                      <td className="p-2 border border-gray-300">
                        {editando ? (
                          <input
                            type="text"
                            value={fichaEditada[`rx_lectura_${ojo}_av`] || ""}
                            onChange={(e) =>
                              handleChange(
                                `rx_lectura_${ojo}_av`,
                                e.target.value
                              )
                            }
                            className="w-full border rounded px-2 py-1"
                          />
                        ) : (
                          fichaEditada[`rx_lectura_${ojo}_av`] || ""
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* LENTES DE CONTACTO con tabla de extras debajo */}
            <div className="overflow-x-auto flex flex-col space-y-4">
              {/* Tabla de LENTES DE CONTACTO */}
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th
                      colSpan={6}
                      className="bg-[#7d2a3f] text-white text-left p-2 font-bold border border-gray-300"
                    >
                      LENTES DE CONTACTO
                    </th>
                  </tr>
                  <tr className="bg-gray-100">
                    <th className="p-2 border border-gray-300"></th>
                    <th className="p-2 border border-gray-300">Ojo</th>
                    <th className="p-2 border border-gray-300">AV CC</th>
                    <th className="p-2 border border-gray-300">Esfera</th>
                    <th className="p-2 border border-gray-300">Cilindro</th>
                    <th className="p-2 border border-gray-300">Eje(grados)</th>
                  </tr>
                </thead>
                <tbody>
                  {["od", "oi"].map((ojo, i) => (
                    <tr key={ojo}>
                      {i === 0 && (
                        <td
                          rowSpan={2}
                          className="p-2 border border-gray-300 bg-gray-100 font-medium align-middle"
                        >
                          A.V.
                        </td>
                      )}
                      <td className="p-2 border border-gray-300 font-medium bg-gray-100">
                        {ojo.toUpperCase()}
                      </td>
                      {["cc", "esfera", "cilindro", "eje"].map((campo) => (
                        <td
                          key={`esq_${ojo}_${campo}`}
                          className="p-2 border border-gray-300"
                        >
                          {editando ? (
                            <input
                              type="text"
                              value={fichaEditada[`esq_${ojo}_${campo}`] || ""}
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
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Altura, Material, Armazón, Causa, Observaciones - Movido debajo de LENTES DE CONTACTO */}
              <table className="w-full border-collapse border border-gray-300 text-sm">
                <tbody>
                  <tr className="bg-gray-50">
                    <td className="p-2 border border-gray-300 font-medium w-1/6">
                      Altura
                    </td>
                    <td className="p-2 border border-gray-300 w-1/3">
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
                    <td className="p-2 border border-gray-300 font-medium w-1/6">
                      Causa
                    </td>
                    <td className="p-2 border border-gray-300 w-1/3">
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
                    <td className="p-2 border border-gray-300 font-medium w-1/6">
                      Material
                    </td>
                    <td className="p-2 border border-gray-300 w-1/3">
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
                    <td className="p-2 border border-gray-300 font-medium w-1/6">
                      Armazón
                    </td>
                    <td className="p-2 border border-gray-300 w-1/3">
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
                  <tr className="bg-gray-50">
                    <td className="p-2 border border-gray-300 font-medium">
                      Observaciones
                    </td>
                    <td colSpan={3} className="p-2 border border-gray-300">
                      {editando ? (
                        <input
                          type="text"
                          value={fichaEditada.observaciones || ""}
                          onChange={(e) =>
                            handleChange("observaciones", e.target.value)
                          }
                          className="w-full border rounded px-2 py-1"
                        />
                      ) : (
                        fichaEditada.observaciones || ""
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
