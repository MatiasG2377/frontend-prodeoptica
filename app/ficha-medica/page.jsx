"use client";

import { useAuth } from "../hooks/useAuth";
import { useState, useRef } from "react";
import { Save, Printer, Search, Calendar } from "lucide-react";
import Header from "../components/common/Header2";
import Swal from "sweetalert2";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import FichaVisual from "../components/ficha-medica/FichaVisual";

const integerFields = [
  "rx_distancia_od_eje",
  "rx_distancia_oi_eje",
  "rx_add_od_eje",
  "rx_add_oi_eje",
  "rx_lectura_od_eje",
  "rx_lectura_oi_eje",
  "esq_od_eje",
  "esq_oi_eje",
  "rs_od_eje",
  "rs_oi_eje",
  "rs_add_eje",
  "rs_od_eje",
  "rs_oi_eje",
  "rs_add_eje",
  "av_od_eje",
  "av_oi_eje",
];

const decimalFields = [
  "altura",
  "rx_distancia_od_esfera",
  "rx_distancia_od_cilindro",
  "rx_distancia_od_dnp",
  "rx_distancia_oi_esfera",
  "rx_distancia_oi_cilindro",
  "rx_distancia_oi_dnp",
  "rx_add_od_esfera",
  "rx_add_od_cilindro",
  "rx_add_od_dnp",
  "rx_add_oi_esfera",
  "rx_add_oi_cilindro",
  "rx_add_oi_dnp",
  "rx_lectura_od_esfera",
  "rx_lectura_od_cilindro",
  "rx_lectura_oi_esfera",
  "rx_lectura_oi_cilindro",
  "esq_od_esfera",
  "esq_od_cilindro",
  "esq_oi_esfera",
  "esq_oi_cilindro",
  "rs_od_esfera",
  "rs_od_cilindro",
  "rs_oi_esfera",
  "rs_oi_cilindro",
  "rs_add_esfera",
  "rs_add_cilindro",
  "rs_od_esfera",
  "rs_od_cilindro",
  "rs_oi_esfera",
  "rs_oi_cilindro",
  "rs_add_esfera",
  "rs_add_cilindro",
  "av_od_esfera",
  "av_od_cilindro",
  "av_oi_esfera",
  "av_oi_cilindro",
];

export default function FichaMedicaCompleta() {
  const [paciente, setPaciente] = useState({
    ci_paciente: "",
    apellidos: "",
    nombres: "",
    fecha_nacimiento: "",
    ocupacion: "",
    direccion: "",
    telefono_celular: "",
    antecedentes: "",
  });
  const printRef = useRef();

  const handlePrint = () => {
    const element = printRef.current;
    const opt = {
      margin: 0.5,
      filename: `Ficha-${paciente.ci_paciente || "paciente"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };
  const [activeTab, setActiveTab] = useState("paciente");
  const [fichasPasadas, setFichasPasadas] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const { logout, user } = useAuth();
  const [opticalData, setOpticalData] = useState({
    rx_distancia_od_av: "",
    rx_distancia_od_esfera: "",
    rx_distancia_od_cilindro: "",
    rx_distancia_od_eje: "",
    rx_distancia_od_dnp: "",
    rx_distancia_oi_av: "",
    rx_distancia_oi_esfera: "",
    rx_distancia_oi_cilindro: "",
    rx_distancia_oi_eje: "",
    rx_distancia_oi_dnp: "",
    rx_add_od_av: "",
    rx_add_od_esfera: "",
    rx_add_od_cilindro: "",
    rx_add_od_eje: "",
    rx_add_od_dnp: "",
    rx_add_oi_av: "",
    rx_add_oi_esfera: "",
    rx_add_oi_cilindro: "",
    rx_add_oi_eje: "",
    rx_add_oi_dnp: "",
    rx_lectura_od_av: "",
    rx_lectura_od_esfera: "",
    rx_lectura_od_cilindro: "",
    rx_lectura_od_eje: "",
    rx_lectura_oi_av: "",
    rx_lectura_oi_esfera: "",
    rx_lectura_oi_cilindro: "",
    rx_lectura_oi_eje: "",
    esq_od_sc: "",
    esq_od_cc: "",
    esq_od_esfera: "",
    esq_od_cilindro: "",
    esq_od_eje: "",
    esq_oi_sc: "",
    esq_oi_cc: "",
    esq_oi_esfera: "",
    esq_oi_cilindro: "",
    esq_oi_eje: "",
    rs_od_esfera: "",
    rs_od_cilindro: "",
    rs_od_eje: "",
    rs_od_correccion: "",
    rs_oi_esfera: "",
    rs_oi_cilindro: "",
    rs_oi_eje: "",
    rs_oi_correccion: "",
    rs_add_esfera: "",
    rs_add_cilindro: "",
    rs_add_eje: "",
    rs_add_correccion: "",
    causa: "",
    observaciones: "",
    altura: "",
    material: "",
  });

  const handlePacienteChange = (field, value) => {
    setPaciente((prev) => ({ ...prev, [field]: value }));
  };

  const handleOpticalDataChange = (field, value) => {
    setOpticalData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Usuario logueado:", user);
    const pacientePayload = {
      ci_paciente: paciente.ci_paciente,
      apellidos_paciente: paciente.apellidos,
      nombres_paciente: paciente.nombres,
      fecha_nacimiento: paciente.fecha_nacimiento,
      ocupacion_paciente: paciente.ocupacion,
      direccion_paciente: paciente.direccion,
      telefono_paciente: paciente.telefono_celular,
      antecedentes_paciente: paciente.antecedentes,
    };
    try {
      const res = await fetch("http://localhost:8000/api/pacientes/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pacientePayload),
      });

      if (!res.ok) throw new Error("Error al guardar paciente");

      const pacienteGuardado = await res.json();
      Swal.fire({
        icon: "success",
        title: "Paciente guardado",
        text: "El paciente se guardó correctamente.",
        confirmButtonColor: "#7d2a3f",
      });

      // 🔄 Limpiar el formulario
      setPaciente({
        ci_paciente: data.paciente.ci_paciente || "",
        apellidos: data.paciente.apellidos_paciente || "",
        nombres: data.paciente.nombres_paciente || "",
        fecha_nacimiento: data.paciente.fecha_nacimiento || "",
        ocupacion: data.paciente.ocupacion_paciente || "",
        direccion: data.paciente.direccion_paciente || "",
        telefono_celular: data.paciente.telefono_paciente || "",
        antecedentes: data.paciente.antecedentes_paciente || "",
      });
    } catch (error) {
      console.error("Error al guardar paciente:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al guardar el paciente.",
        confirmButtonColor: "#7d2a3f",
      });
    }
  };

  const buscarPacientePorCI = async () => {
    if (!paciente.ci_paciente) return;

    const token = localStorage.getItem("access_token");

    try {
      const res = await fetch(
        `http://localhost:8000/api/pacientes/ci/${paciente.ci_paciente}/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ Aquí se envía el token
          },
        }
      );

      if (!res.ok) {
        setFichasPasadas([]);
        Swal.fire({
          icon: "warning",
          title: "Paciente no encontrado",
          text: "Puedes continuar registrando un nuevo paciente.",
          confirmButtonColor: "#7d2a3f",
        });
        return;
      }

      const data = await res.json();
      setPaciente({
        ci_paciente: data.paciente.ci_paciente || "",
        apellidos: data.paciente.apellidos_paciente || "",
        nombres: data.paciente.nombres_paciente || "",
        fecha_nacimiento: data.paciente.fecha_nacimiento || "",
        ocupacion: data.paciente.ocupacion_paciente || "",
        direccion: data.paciente.direccion_paciente || "",
        telefono_celular: data.paciente.telefono_paciente || "",
        antecedentes: data.paciente.antecedentes_paciente || "",
      });

      setFichasPasadas(data.historial_fichas);

      Swal.fire({
        icon: "success",
        title: "Paciente encontrado",
        text: "Los datos se han cargado correctamente.",
        confirmButtonColor: "#7d2a3f",
      });
    } catch (error) {
      console.error("Error inesperado al buscar paciente:", error);
      Swal.fire({
        icon: "error",
        title: "Error inesperado",
        text: "Ocurrió un problema al buscar el paciente.",
        confirmButtonColor: "#7d2a3f",
      });
    }
  };
  function normalizarCamposEnteros(data, campos) {
    const copia = { ...data };
    campos.forEach((campo) => {
      copia[campo] = copia[campo] === "" ? null : parseInt(copia[campo], 10);
    });
    return copia;
  }
  const parseOpticalData = (data) => {
    const integerFields = [
      "rx_distancia_od_eje",
      "rx_distancia_oi_eje",
      "rx_add_od_eje",
      "rx_add_oi_eje",
      "rx_lectura_od_eje",
      "rx_lectura_oi_eje",
      "esq_od_eje",
      "esq_oi_eje",
      "rs_od_eje",
      "rs_oi_eje",
      "rs_add_eje",
      "rs_od_eje",
      "rs_oi_eje",
      "rs_add_eje",
      "av_od_eje",
      "av_oi_eje",
    ];

    const decimalFields = [
      "altura",
      "rx_distancia_od_esfera",
      "rx_distancia_od_cilindro",
      "rx_distancia_od_dnp",
      "rx_distancia_oi_esfera",
      "rx_distancia_oi_cilindro",
      "rx_distancia_oi_dnp",
      "rx_add_od_esfera",
      "rx_add_od_cilindro",
      "rx_add_od_dnp",
      "rx_add_oi_esfera",
      "rx_add_oi_cilindro",
      "rx_add_oi_dnp",
      "rx_lectura_od_esfera",
      "rx_lectura_od_cilindro",
      "rx_lectura_oi_esfera",
      "rx_lectura_oi_cilindro",
      "esq_od_esfera",
      "esq_od_cilindro",
      "esq_oi_esfera",
      "esq_oi_cilindro",
      "rs_od_esfera",
      "rs_od_cilindro",
      "rs_oi_esfera",
      "rs_oi_cilindro",
      "rs_add_esfera",
      "rs_add_cilindro",
      "rs_od_esfera",
      "rs_od_cilindro",
      "rs_oi_esfera",
      "rs_oi_cilindro",
      "rs_add_esfera",
      "rs_add_cilindro",
      "av_od_esfera",
      "av_od_cilindro",
      "av_oi_esfera",
      "av_oi_cilindro",
    ];

    const parsed = { ...data };
    for (const field of integerFields) {
      parsed[field] = data[field] === "" ? null : parseInt(data[field], 10);
    }

    for (const field of decimalFields) {
      parsed[field] = data[field] === "" ? null : parseFloat(data[field]);
    }

    return parsed;
  };
  const guardarFichaCompleta = async () => {
    try {
      let pacienteGuardado = null;

      // Verificar si el paciente ya existe
      const buscarRes = await fetch(
        `http://localhost:8000/api/pacientes/ci/${paciente.ci_paciente}/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (buscarRes.ok) {
        const data = await buscarRes.json();
        pacienteGuardado = data.paciente;
      } else {
        // Registrar nuevo paciente si no existe
        const pacienteRes = await fetch(
          "http://localhost:8000/api/pacientes/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(paciente),
          }
        );

        if (!pacienteRes.ok) throw new Error("No se pudo guardar el paciente");

        pacienteGuardado = await pacienteRes.json();
      }

      // Preparar datos para ficha médica
      const fichaPayload = {
        ...parseOpticalData(opticalData),
        paciente: pacienteGuardado.id,
        usuario: user?.id,
        sucursal: user?.sucursal,
      };

      const fichaPayloadFinal = normalizarCamposEnteros(
        fichaPayload,
        integerFields
      );
      console.log("Ficha Payload:", fichaPayload);

      // Enviar ficha médica al backend
      const fichaRes = await fetch(
        "http://localhost:8000/api/fichas-medicas/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(fichaPayloadFinal),
        }
      );

      if (!fichaRes.ok) {
        const errorText = await fichaRes.text();
        throw new Error("No se pudo guardar la ficha médica: " + errorText);
      }

      const nuevaFicha = await fichaRes.json();
      setFichasPasadas((prev) => [nuevaFicha, ...prev]);

      // Resetear formularios
      setPaciente({
        ci_paciente: "",
        apellidos: "",
        nombres: "",
        fecha_nacimiento: "",
        ocupacion: "",
        direccion: "",
        telefono_celular: "",
        antecedentes: "",
      });

      setOpticalData({
        // RX Distancia
        rx_distancia_od_av: "",
        rx_distancia_od_esfera: "",
        rx_distancia_od_cilindro: "",
        rx_distancia_od_eje: "",
        rx_distancia_od_dnp: "",
        rx_distancia_oi_av: "",
        rx_distancia_oi_esfera: "",
        rx_distancia_oi_cilindro: "",
        rx_distancia_oi_eje: "",
        rx_distancia_oi_dnp: "",

        // RX A.D.D.
        rx_add_od_av: "",
        rx_add_od_esfera: "",
        rx_add_od_cilindro: "",
        rx_add_od_eje: "",
        rx_add_od_dnp: "",
        rx_add_oi_av: "",
        rx_add_oi_esfera: "",
        rx_add_oi_cilindro: "",
        rx_add_oi_eje: "",
        rx_add_oi_dnp: "",

        // RX Lectura
        rx_lectura_od_av: "",
        rx_lectura_od_esfera: "",
        rx_lectura_od_cilindro: "",
        rx_lectura_od_eje: "",
        rx_lectura_oi_av: "",
        rx_lectura_oi_esfera: "",
        rx_lectura_oi_cilindro: "",
        rx_lectura_oi_eje: "",

        // Esquiascopia
        esq_od_sc: "",
        esq_od_cc: "",
        esq_od_esfera: "",
        esq_od_cilindro: "",
        esq_od_eje: "",
        esq_oi_sc: "",
        esq_oi_cc: "",
        esq_oi_esfera: "",
        esq_oi_cilindro: "",
        esq_oi_eje: "",

        // Refracción rs
        rs_od_esfera: "",
        rs_od_cilindro: "",
        rs_od_eje: "",
        rs_od_correccion: "",
        rs_oi_esfera: "",
        rs_oi_cilindro: "",
        rs_oi_eje: "",
        rs_oi_correccion: "",
        rs_add_esfera: "",
        rs_add_cilindro: "",
        rs_add_eje: "",
        rs_add_correccion: "",

        // rs
        rs_od_esfera: "",
        rs_od_cilindro: "",
        rs_od_eje: "",
        rs_od_correccion: "",
        rs_oi_esfera: "",
        rs_oi_cilindro: "",
        rs_oi_eje: "",
        rs_oi_correccion: "",
        rs_add_esfera: "",
        rs_add_cilindro: "",
        rs_add_eje: "",
        rs_add_correccion: "",

        // A.V.
        av_od_sc: "",
        av_od_cc: "",
        av_od_esfera: "",
        av_od_cilindro: "",
        av_od_eje: "",
        av_oi_sc: "",
        av_oi_cc: "",
        av_oi_esfera: "",
        av_oi_cilindro: "",
        av_oi_eje: "",

        // Extras
        causa: "",
        observaciones: "",
        altura: "",
        material: "",
      });

      Swal.fire({
        icon: "success",
        title: "Ficha guardada",
        text: "La ficha médica ha sido registrada correctamente.",
        confirmButtonColor: "#7d2a3f",
      });
    } catch (error) {
      console.error("Error al guardar ficha completa:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al guardar la ficha médica.",
        confirmButtonColor: "#7d2a3f",
      });
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        {/* Header común reutilizable */}
        <Header
          title="Ficha Médica"
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          handleLogout={logout}
        />

        <main className="container mx-auto p-4">
          <div
            ref={printRef}
            className="bg-white rounded-lg shadow-md p-6 mb-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-[#7d2a3f]">
                Ficha Médica
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={handleSubmit}
                  className="bg-[#7d2a3f] text-white px-4 py-2 rounded-md hover:bg-[#6d2435] flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Paciente
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <div className="flex -mb-px">
                <button
                  className={`py-2 px-4 font-medium ${
                    activeTab === "paciente"
                      ? "border-b-2 border-[#7d2a3f] text-[#7d2a3f]"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("paciente")}
                >
                  Datos del Paciente
                </button>
                <button
                  className={`py-2 px-4 font-medium ${
                    activeTab === "ficha"
                      ? "border-b-2 border-[#7d2a3f] text-[#7d2a3f]"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("ficha")}
                >
                  Ficha Médica
                </button>
                <button
                  className={`py-2 px-4 font-medium ${
                    activeTab === "historial"
                      ? "border-b-2 border-[#7d2a3f] text-[#7d2a3f]"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("historial")}
                >
                  Historial
                </button>
              </div>
            </div>

            {/* Formulario de Registro de Paciente */}
            {activeTab === "paciente" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Información Personal */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-medium text-gray-700 mb-4 pb-2 border-b">
                    Información Personal
                  </h3>
                </div>

                {/* CI del Paciente */}
                <div className="form-group">
                  <label
                    htmlFor="ci_paciente"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Cédula del Paciente <span className="text-red-500">*</span>
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      id="ci_paciente"
                      className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-[#7d2a3f]"
                      value={paciente.ci_paciente || ""}
                      onChange={(e) =>
                        handlePacienteChange("ci_paciente", e.target.value)
                      }
                      placeholder="Ej: 0102030405"
                    />
                    <button
                      type="button"
                      onClick={buscarPacientePorCI}
                      className="bg-[#7d2a3f] text-white p-2 rounded-md ml-2"
                    >
                      <Search className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Apellidos */}
                <div className="form-group">
                  <label
                    htmlFor="apellidos"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Apellidos <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="apellidos"
                    className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-[#7d2a3f]"
                    value={paciente.apellidos}
                    onChange={(e) =>
                      handlePacienteChange("apellidos", e.target.value)
                    }
                    required
                  />
                </div>

                {/* Nombres */}
                <div className="form-group">
                  <label
                    htmlFor="nombres"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nombres <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="nombres"
                    className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-[#7d2a3f]"
                    value={paciente.nombres}
                    onChange={(e) =>
                      handlePacienteChange("nombres", e.target.value)
                    }
                    required
                  />
                </div>

                {/* Fecha de Nacimiento */}
                <div className="form-group">
                  <label
                    htmlFor="fecha_nacimiento"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Fecha de Nacimiento
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="fecha_nacimiento"
                      className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-[#7d2a3f]"
                      value={paciente.fecha_nacimiento}
                      onChange={(e) =>
                        handlePacienteChange("fecha_nacimiento", e.target.value)
                      }
                    />
                    <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Ocupación */}
                <div className="form-group">
                  <label
                    htmlFor="ocupacion"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Ocupación
                  </label>
                  <input
                    type="text"
                    id="ocupacion"
                    className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-[#7d2a3f]"
                    value={paciente.ocupacion}
                    onChange={(e) =>
                      handlePacienteChange("ocupacion", e.target.value)
                    }
                  />
                </div>

                {/* Teléfono Celular */}
                <div className="form-group">
                  <label
                    htmlFor="telefono_celular"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Teléfono Celular
                  </label>
                  <input
                    type="tel"
                    id="telefono_celular"
                    className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-[#7d2a3f]"
                    value={paciente.telefono_celular}
                    onChange={(e) =>
                      handlePacienteChange("telefono_celular", e.target.value)
                    }
                    placeholder="Ej: 099-123-4567"
                  />
                </div>

                {/* Dirección */}
                <div className="form-group md:col-span-2">
                  <label
                    htmlFor="direccion"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Dirección
                  </label>
                  <textarea
                    id="direccion"
                    rows={3}
                    className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-[#7d2a3f]"
                    value={paciente.direccion}
                    onChange={(e) =>
                      handlePacienteChange("direccion", e.target.value)
                    }
                  ></textarea>
                </div>

                {/* Antecedentes Médicos */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-medium text-gray-700 mb-4 pb-2 border-b">
                    Antecedentes Médicos
                  </h3>
                </div>

                {/* Antecedentes */}
                <div className="form-group md:col-span-2">
                  <label
                    htmlFor="antecedentes"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Antecedentes Médicos
                  </label>
                  <textarea
                    id="antecedentes"
                    rows={5}
                    className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-[#7d2a3f]"
                    value={paciente.antecedentes}
                    onChange={(e) =>
                      handlePacienteChange("antecedentes", e.target.value)
                    }
                    placeholder="Ingrese antecedentes médicos relevantes, alergias, condiciones previas, etc."
                  ></textarea>
                </div>

                <div className="md:col-span-2 flex justify-end mt-4">
                  <button
                    type="button"
                    className="bg-[#7d2a3f] text-white px-4 py-2 rounded-md hover:bg-[#6d2435]"
                    onClick={() => setActiveTab("ficha")}
                  >
                    Continuar a Ficha Médica
                  </button>
                </div>
              </div>
            )}

            {/* Ficha Médica */}
            {activeTab === "ficha" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* RX. REFRACCIÓN */}
                <div className="overflow-x-auto">
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
                        <th className="p-2 border border-gray-300">
                          Eje(Grados)
                        </th>
                        <th className="p-2 border border-gray-300">DNP(mm)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Distancia */}
                      <tr>
                        <td
                          rowSpan={2}
                          className="p-2 border border-gray-300 bg-gray-100 font-medium"
                        >
                          Distancia
                        </td>
                        <td className="p-2 border border-gray-300 bg-gray-100 font-medium">
                          OD
                        </td>
                        <td className="p-2 border border-gray-300">
                          <input
                            type="text"
                            className="w-full p-1 border border-gray-300 rounded"
                            value={opticalData.rx_distancia_od_av}
                            onChange={(e) =>
                              handleOpticalDataChange(
                                "rx_distancia_od_av",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="p-2 border border-gray-300">
                          <input
                            type="text"
                            className="w-full p-1 border border-gray-300 rounded"
                            value={opticalData.rx_distancia_od_esfera}
                            onChange={(e) =>
                              handleOpticalDataChange(
                                "rx_distancia_od_esfera",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="p-2 border border-gray-300">
                          <input
                            type="text"
                            className="w-full p-1 border border-gray-300 rounded"
                            value={opticalData.rx_distancia_od_cilindro}
                            onChange={(e) =>
                              handleOpticalDataChange(
                                "rx_distancia_od_cilindro",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="p-2 border border-gray-300">
                          <input
                            type="text"
                            className="w-full p-1 border border-gray-300 rounded"
                            value={opticalData.rx_distancia_od_eje}
                            onChange={(e) =>
                              handleOpticalDataChange(
                                "rx_distancia_od_eje",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="p-2 border border-gray-300">
                          <input
                            type="text"
                            className="w-full p-1 border border-gray-300 rounded"
                            value={opticalData.rx_distancia_od_dnp}
                            onChange={(e) =>
                              handleOpticalDataChange(
                                "rx_distancia_od_dnp",
                                e.target.value
                              )
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2 border border-gray-300 bg-gray-100 font-medium">
                          OI
                        </td>
                        <td className="p-2 border border-gray-300">
                          <input
                            type="text"
                            className="w-full p-1 border border-gray-300 rounded"
                            value={opticalData.rx_distancia_oi_av}
                            onChange={(e) =>
                              handleOpticalDataChange(
                                "rx_distancia_oi_av",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="p-2 border border-gray-300">
                          <input
                            type="text"
                            className="w-full p-1 border border-gray-300 rounded"
                            value={opticalData.rx_distancia_oi_esfera}
                            onChange={(e) =>
                              handleOpticalDataChange(
                                "rx_distancia_oi_esfera",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="p-2 border border-gray-300">
                          <input
                            type="text"
                            className="w-full p-1 border border-gray-300 rounded"
                            value={opticalData.rx_distancia_oi_cilindro}
                            onChange={(e) =>
                              handleOpticalDataChange(
                                "rx_distancia_oi_cilindro",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="p-2 border border-gray-300">
                          <input
                            type="text"
                            className="w-full p-1 border border-gray-300 rounded"
                            value={opticalData.rx_distancia_oi_eje}
                            onChange={(e) =>
                              handleOpticalDataChange(
                                "rx_distancia_oi_eje",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="p-2 border border-gray-300">
                          <input
                            type="text"
                            className="w-full p-1 border border-gray-300 rounded"
                            value={opticalData.rx_distancia_oi_dnp}
                            onChange={(e) =>
                              handleOpticalDataChange(
                                "rx_distancia_oi_dnp",
                                e.target.value
                              )
                            }
                          />
                        </td>
                      </tr>

                      {/* A.D.D. */}
                      <tr>
                        <td
                          rowSpan={2}
                          className="p-2 border border-gray-300 bg-gray-100 font-medium"
                        >
                          A.D.D.
                        </td>
                        <td className="p-2 border border-gray-300 bg-gray-100 font-medium">
                          OD
                        </td>
                        <td className="p-2 border border-gray-300">
                          <input
                            type="text"
                            className="w-full p-1 border border-gray-300 rounded"
                            value={opticalData.rx_add_od_av}
                            onChange={(e) =>
                              handleOpticalDataChange(
                                "rx_add_od_av",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="p-2 border border-gray-300">
                          <input
                            type="text"
                            className="w-full p-1 border border-gray-300 rounded"
                            value={opticalData.rx_add_od_esfera}
                            onChange={(e) =>
                              handleOpticalDataChange(
                                "rx_add_od_esfera",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td colSpan={3}></td>
                      </tr>
                      <tr>
                        <td className="p-2 border border-gray-300 bg-gray-100 font-medium">
                          OI
                        </td>
                        <td className="p-2 border border-gray-300">
                          <input
                            type="text"
                            className="w-full p-1 border border-gray-300 rounded"
                            value={opticalData.rx_add_oi_av}
                            onChange={(e) =>
                              handleOpticalDataChange(
                                "rx_add_oi_av",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="p-2 border border-gray-300">
                          <input
                            type="text"
                            className="w-full p-1 border border-gray-300 rounded"
                            value={opticalData.rx_add_oi_esfera}
                            onChange={(e) =>
                              handleOpticalDataChange(
                                "rx_add_oi_esfera",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td colSpan={3}></td>
                      </tr>

                      {/* Lectura */}
                      <tr>
                        <td
                          rowSpan={2}
                          className="p-2 border border-gray-300 bg-gray-100 font-medium"
                        >
                          Lectura
                        </td>
                        <td className="p-2 border border-gray-300 bg-gray-100 font-medium">
                          OD
                        </td>
                        <td className="p-2 border border-gray-300">
                          <input
                            type="text"
                            className="w-full p-1 border border-gray-300 rounded"
                            value={opticalData.rx_lectura_od_av}
                            onChange={(e) =>
                              handleOpticalDataChange(
                                "rx_lectura_od_av",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="p-2 border border-gray-300">
                          <input
                            type="text"
                            className="w-full p-1 border border-gray-300 rounded"
                            value={opticalData.rx_lectura_od_esfera}
                            onChange={(e) =>
                              handleOpticalDataChange(
                                "rx_lectura_od_esfera",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="p-2 border border-gray-300">
                          <input
                            type="text"
                            className="w-full p-1 border border-gray-300 rounded"
                            value={opticalData.rx_lectura_od_cilindro}
                            onChange={(e) =>
                              handleOpticalDataChange(
                                "rx_lectura_od_cilindro",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="p-2 border border-gray-300">
                          <input
                            type="text"
                            className="w-full p-1 border border-gray-300 rounded"
                            value={opticalData.rx_lectura_od_eje}
                            onChange={(e) =>
                              handleOpticalDataChange(
                                "rx_lectura_od_eje",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td className="p-2 border border-gray-300 bg-gray-100 font-medium">
                          OI
                        </td>
                        <td className="p-2 border border-gray-300">
                          <input
                            type="text"
                            className="w-full p-1 border border-gray-300 rounded"
                            value={opticalData.rx_lectura_oi_av}
                            onChange={(e) =>
                              handleOpticalDataChange(
                                "rx_lectura_oi_av",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="p-2 border border-gray-300">
                          <input
                            type="text"
                            className="w-full p-1 border border-gray-300 rounded"
                            value={opticalData.rx_lectura_oi_esfera}
                            onChange={(e) =>
                              handleOpticalDataChange(
                                "rx_lectura_oi_esfera",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="p-2 border border-gray-300">
                          <input
                            type="text"
                            className="w-full p-1 border border-gray-300 rounded"
                            value={opticalData.rx_lectura_oi_cilindro}
                            onChange={(e) =>
                              handleOpticalDataChange(
                                "rx_lectura_oi_cilindro",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="p-2 border border-gray-300">
                          <input
                            type="text"
                            className="w-full p-1 border border-gray-300 rounded"
                            value={opticalData.rx_lectura_oi_eje}
                            onChange={(e) =>
                              handleOpticalDataChange(
                                "rx_lectura_oi_eje",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Altura y Material */}
                  <table className="w-full border-collapse mt-4">
                    <tbody>
                      <tr>
                        <td className="p-2 border border-gray-300 font-medium">
                          Altura
                        </td>
                        <td className="p-2 border border-gray-300">
                          <input
                            type="text"
                            className="w-full p-1 border border-gray-300 rounded"
                            value={opticalData.altura}
                            onChange={(e) =>
                              handleOpticalDataChange("altura", e.target.value)
                            }
                          />
                        </td>
                        <td className="p-2 border border-gray-300 font-medium">
                          Material
                        </td>
                        <td className="p-2 border border-gray-300">
                          <input
                            type="text"
                            className="w-full p-1 border border-gray-300 rounded"
                            value={opticalData.material}
                            onChange={(e) =>
                              handleOpticalDataChange(
                                "material",
                                e.target.value
                              )
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2 border border-gray-300 font-medium">
                          Observaciones
                        </td>
                        <td colSpan={3} className="p-2 border border-gray-300">
                          <input
                            type="text"
                            className="w-full p-1 border border-gray-300 rounded"
                            value={opticalData.observaciones}
                            onChange={(e) =>
                              handleOpticalDataChange(
                                "observaciones",
                                e.target.value
                              )
                            }
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* ESQUIASCOPIA */}
                <div className="overflow-x-auto">
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
                        <th className="p-2 border border-gray-300"></th>
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
                      {/* A.V. */}
                      <tr>
                        <td
                          rowSpan={2}
                          className="p-2 border border-gray-300 bg-gray-100 font-medium"
                        >
                          A.V.
                        </td>
                        <td className="p-2 border border-gray-300 bg-gray-100 font-medium">
                          OD
                        </td>
                        <td className="p-2 border border-gray-300">
                          <input
                            type="text"
                            className="w-full p-1 border border-gray-300 rounded"
                            value={opticalData.esq_od_sc}
                            onChange={(e) =>
                              handleOpticalDataChange(
                                "esq_od_sc",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="p-2 border border-gray-300">
                          <input
                            type="text"
                            className="w-full p-1 border border-gray-300 rounded"
                            value={opticalData.esq_od_cc}
                            onChange={(e) =>
                              handleOpticalDataChange(
                                "esq_od_cc",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="p-2 border border-gray-300">
                          <input
                            type="text"
                            className="w-full p-1 border border-gray-300 rounded"
                            value={opticalData.esq_od_esfera}
                            onChange={(e) =>
                              handleOpticalDataChange(
                                "esq_od_esfera",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="p-2 border border-gray-300">
                          <input
                            type="text"
                            className="w-full p-1 border border-gray-300 rounded"
                            value={opticalData.esq_od_cilindro}
                            onChange={(e) =>
                              handleOpticalDataChange(
                                "esq_od_cilindro",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="p-2 border border-gray-300">
                          <input
                            type="text"
                            className="w-full p-1 border border-gray-300 rounded"
                            value={opticalData.esq_od_eje}
                            onChange={(e) =>
                              handleOpticalDataChange(
                                "esq_od_eje",
                                e.target.value
                              )
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2 border border-gray-300 bg-gray-100 font-medium">
                          OI
                        </td>
                        <td className="p-2 border border-gray-300">
                          <input
                            type="text"
                            className="w-full p-1 border border-gray-300 rounded"
                            value={opticalData.esq_oi_sc}
                            onChange={(e) =>
                              handleOpticalDataChange(
                                "esq_oi_sc",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="p-2 border border-gray-300">
                          <input
                            type="text"
                            className="w-full p-1 border border-gray-300 rounded"
                            value={opticalData.esq_oi_cc}
                            onChange={(e) =>
                              handleOpticalDataChange(
                                "esq_oi_cc",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="p-2 border border-gray-300">
                          <input
                            type="text"
                            className="w-full p-1 border border-gray-300 rounded"
                            value={opticalData.esq_oi_esfera}
                            onChange={(e) =>
                              handleOpticalDataChange(
                                "esq_oi_esfera",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="p-2 border border-gray-300">
                          <input
                            type="text"
                            className="w-full p-1 border border-gray-300 rounded"
                            value={opticalData.esq_oi_cilindro}
                            onChange={(e) =>
                              handleOpticalDataChange(
                                "esq_oi_cilindro",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="p-2 border border-gray-300">
                          <input
                            type="text"
                            className="w-full p-1 border border-gray-300 rounded"
                            value={opticalData.esq_oi_eje}
                            onChange={(e) =>
                              handleOpticalDataChange(
                                "esq_oi_eje",
                                e.target.value
                              )
                            }
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Refracción rs */}
                  <table className="w-full border-collapse mt-4">
                    <thead>
                      <tr>
                        <th
                          colSpan={5}
                          className="p-2 border border-gray-300 bg-[#7d2a3f] text-white text-left"
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
                        <th className="p-2 border border-gray-300">
                          Corrección
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* OD */}
                      <tr>
                        <td className="p-2 border border-gray-300 bg-gray-100 font-medium">
                          O.D.
                        </td>
                        <td className="p-2 border border-gray-300">
                          <input
                            type="text"
                            className="w-full p-1 border border-gray-300 rounded"
                            value={opticalData.rs_od_esfera}
                            onChange={(e) =>
                              handleOpticalDataChange(
                                "rs_od_esfera",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="p-2 border border-gray-300">
                          <input
                            type="text"
                            className="w-full p-1 border border-gray-300 rounded"
                            value={opticalData.rs_od_cilindro}
                            onChange={(e) =>
                              handleOpticalDataChange(
                                "rs_od_cilindro",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="p-2 border border-gray-300">
                          <input
                            type="text"
                            className="w-full p-1 border border-gray-300 rounded"
                            value={opticalData.rs_od_eje}
                            onChange={(e) =>
                              handleOpticalDataChange(
                                "rs_od_eje",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="p-2 border border-gray-300">
                          <input
                            type="text"
                            className="w-full p-1 border border-gray-300 rounded"
                            value={opticalData.rs_od_correccion}
                            onChange={(e) =>
                              handleOpticalDataChange(
                                "rs_od_correccion",
                                e.target.value
                              )
                            }
                          />
                        </td>
                      </tr>

                      {/* OI */}
                      <tr>
                        <td className="p-2 border border-gray-300 bg-gray-100 font-medium">
                          O.I.
                        </td>
                        <td className="p-2 border border-gray-300">
                          <input
                            type="text"
                            className="w-full p-1 border border-gray-300 rounded"
                            value={opticalData.rs_oi_esfera}
                            onChange={(e) =>
                              handleOpticalDataChange(
                                "rs_oi_esfera",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="p-2 border border-gray-300">
                          <input
                            type="text"
                            className="w-full p-1 border border-gray-300 rounded"
                            value={opticalData.rs_oi_cilindro}
                            onChange={(e) =>
                              handleOpticalDataChange(
                                "rs_oi_cilindro",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="p-2 border border-gray-300">
                          <input
                            type="text"
                            className="w-full p-1 border border-gray-300 rounded"
                            value={opticalData.rs_oi_eje}
                            onChange={(e) =>
                              handleOpticalDataChange(
                                "rs_oi_eje",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="p-2 border border-gray-300">
                          <input
                            type="text"
                            className="w-full p-1 border border-gray-300 rounded"
                            value={opticalData.rs_oi_correccion}
                            onChange={(e) =>
                              handleOpticalDataChange(
                                "rs_oi_correccion",
                                e.target.value
                              )
                            }
                          />
                        </td>
                      </tr>

                      {/* ADD */}
                      <tr>
                        <td className="p-2 border border-gray-300 bg-gray-100 font-medium">
                          A.D.D
                        </td>
                        <td className="p-2 border border-gray-300">
                          <input
                            type="text"
                            className="w-full p-1 border border-gray-300 rounded"
                            value={opticalData.rs_add_esfera}
                            onChange={(e) =>
                              handleOpticalDataChange(
                                "rs_add_esfera",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="p-2 border border-gray-300">
                          <input
                            type="text"
                            className="w-full p-1 border border-gray-300 rounded"
                            value={opticalData.rs_add_cilindro}
                            onChange={(e) =>
                              handleOpticalDataChange(
                                "rs_add_cilindro",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="p-2 border border-gray-300">
                          <input
                            type="text"
                            className="w-full p-1 border border-gray-300 rounded"
                            value={opticalData.rs_add_eje}
                            onChange={(e) =>
                              handleOpticalDataChange(
                                "rs_add_eje",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="p-2 border border-gray-300">
                          <input
                            type="text"
                            className="w-full p-1 border border-gray-300 rounded"
                            value={opticalData.rs_add_correccion}
                            onChange={(e) =>
                              handleOpticalDataChange(
                                "rs_add_correccion",
                                e.target.value
                              )
                            }
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Causa */}
                  <table className="w-full border-collapse mt-4">
                    <tbody>
                      <tr>
                        <td className="p-2 border border-gray-300 font-medium">
                          Causa
                        </td>
                        <td className="p-2 border border-gray-300">
                          <input
                            type="text"
                            className="w-full p-1 border border-gray-300 rounded"
                            value={opticalData.causa}
                            onChange={(e) =>
                              handleOpticalDataChange("causa", e.target.value)
                            }
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="lg:col-span-2 flex justify-between mt-4">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    onClick={() => setActiveTab("paciente")}
                  >
                    Volver a Datos del Paciente
                  </button>
                  <button
                    type="button"
                    className="bg-[#7d2a3f] text-white px-4 py-2 rounded-md hover:bg-[#6d2435]"
                    onClick={guardarFichaCompleta}
                  >
                    Guardar Ficha Completa
                  </button>
                </div>
              </div>
            )}
            {activeTab === "historial" && (
              <div className="space-y-4">
                {fichasPasadas.length === 0 ? (
                  <p className="text-gray-500">
                    No hay fichas anteriores disponibles.
                  </p>
                ) : (
                  fichasPasadas.map((ficha, index) => (
                    <FichaVisual key={index} data={ficha} />
                  ))
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
