"use client";

import { useAuth } from "../hooks/useAuth";
import { useState, useRef } from "react";
import { Save, Printer, Search, Calendar } from "lucide-react";
import Header from "../components/common/Header2";
import Swal from "sweetalert2";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import FichaVisual from "../components/ficha-medica/FichaVisual";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

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
    correo_cliente: "", // <-- NUEVO
    informacion_cliente: "", // <-- NUEVO
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
    esq_od_cc: "",
    esq_od_esfera: "",
    esq_od_cilindro: "",
    esq_od_eje: "",
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
    esq_od_esfera_computarizado: "",
    esq_od_cilindro_computarizado: "",
    esq_od_eje_computarizado: "",
    esq_oi_esfera_computarizado: "",
    esq_oi_cilindro_computarizado: "",
    esq_oi_eje_computarizado: "",
    armazon: "",
    rx_anterior_od_avsc: "",
    rx_anterior_oi_avsc: "",
    rx_anterior_add_avsc: "",
  });
  const [apellidoBusqueda, setApellidoBusqueda] = useState("");
  const [resultadosApellido, setResultadosApellido] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);

  // Función para validar que solo contenga letras y espacios
  const validarSoloLetras = (valor) => {
    return /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(valor);
  };

  // Función para validar que solo contenga números enteros positivos
  const validarSoloNumeros = (valor) => {
    return /^\d*$/.test(valor);
  };

  // Función para manejar cambios en el campo de búsqueda por apellido
  const handleBuscarApellidoChange = (value) => {
    if (value === '' || validarSoloLetras(value)) {
      setApellidoBusqueda(value);
    }
  };

  const handlePacienteChange = (field, value) => {
    // Aplicar validaciones según el campo
    if (['apellidos', 'nombres'].includes(field)) {
      // Solo permite letras y espacios para apellidos y nombres
      if (value === '' || validarSoloLetras(value)) {
        setPaciente(prev => ({ ...prev, [field]: value }));
      }
    } else if (field === 'ci_paciente') {
      // Permite cualquier carácter en la cédula
      setPaciente(prev => ({ ...prev, [field]: value }));
    } else if (field === 'telefono_celular') {
      // Solo permite números en el teléfono
      if (value === '' || validarSoloNumeros(value)) {
        setPaciente(prev => ({ ...prev, [field]: value }));
      }
    } else {
      // Para otros campos, actualizar sin validación
      setPaciente(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleOpticalDataChange = (field, value) => {
    setOpticalData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("access_token");

    const payload = {
      ci: paciente.ci_paciente,
      nombre_cliente: paciente.nombres,
      apellido_cliente: paciente.apellidos,
      correo_cliente: paciente.correo_cliente,
      telefono_cliente: paciente.telefono_celular,
      direccion_cliente: paciente.direccion,
      informacion_cliente: paciente.informacion_cliente,
      nombres_paciente: paciente.nombres,
      apellidos_paciente: paciente.apellidos,
      fecha_nacimiento: paciente.fecha_nacimiento,
      ocupacion_paciente: paciente.ocupacion,
      direccion_paciente: paciente.direccion,
      telefono_paciente: paciente.telefono_celular,
      antecedentes_paciente: paciente.antecedentes,
    };

    try {
      const res = await fetch(`${BASE_URL}/cliente-paciente/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok && res.status !== 400) {
        const errorText = await res.text();
        throw new Error("Error al guardar paciente: " + errorText);
      }

      await res.json(); // puedes usarlo si necesitas los datos

      Swal.fire({
        icon: "success",
        title: "Paciente y Cliente guardados",
        text: "Los datos se guardaron correctamente.",
        confirmButtonColor: "#7d2a3f",
      });

      setPaciente({
        ci_paciente: "",
        apellidos: "",
        nombres: "",
        fecha_nacimiento: "",
        ocupacion: "",
        direccion: "",
        telefono_celular: "",
        antecedentes: "",
        correo_cliente: "",
        informacion_cliente: "",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al guardar el paciente y cliente.",
        confirmButtonColor: "#7d2a3f",
      });
    }
  };

  const buscarPacientePorCI = async () => {
    if (!paciente.ci_paciente) return;

    const token = localStorage.getItem("access_token");

    try {
      const res = await fetch(
        `${BASE_URL}/cliente-paciente/buscar/?ci=${paciente.ci_paciente}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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

      if (!data.paciente) {
        setFichasPasadas([]);
        Swal.fire({
          icon: "warning",
          title: "Paciente no encontrado",
          text: "Puedes continuar registrando un nuevo paciente.",
          confirmButtonColor: "#7d2a3f",
        });
        return;
      }

      setPaciente({
        ci_paciente: data.paciente.ci_paciente || "",
        apellidos: data.paciente.apellidos_paciente || "",
        nombres: data.paciente.nombres_paciente || "",
        fecha_nacimiento: data.paciente.fecha_nacimiento || "",
        ocupacion: data.paciente.ocupacion_paciente || "",
        direccion: data.paciente.direccion_paciente || "",
        telefono_celular: data.paciente.telefono_paciente || "",
        antecedentes: data.paciente.antecedentes_paciente || "",
        correo_cliente: data.cliente?.correo_cliente || "",
        informacion_cliente: data.cliente?.informacion_cliente || "",
        apellido_cliente: data.cliente?.apellido_cliente || "",
      });

      setFichasPasadas(data.historial_fichas);

      Swal.fire({
        icon: "success",
        title: "Paciente encontrado",
        text: "Los datos se han cargado correctamente.",
        confirmButtonColor: "#7d2a3f",
      });
    } catch (error) {
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
      "esq_od_eje_computarizado",
      "esq_oi_eje_computarizado",
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
      "esq_od_esfera_computarizado",
      "esq_od_cilindro_computarizado",
      "esq_oi_esfera_computarizado",
      "esq_oi_cilindro_computarizado",
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
      // Validación básica
      if (!paciente.nombres || !paciente.apellidos) {
        Swal.fire({
          icon: "warning",
          title: "Datos incompletos",
          text: "Por favor completa cédula, nombres y apellidos del paciente.",
          confirmButtonColor: "#7d2a3f",
        });
        return;
      }

      const token = localStorage.getItem("access_token");
      let pacienteId = null;

      // 1. Verificar si el paciente ya existe
      try {
        const buscarRes = await fetch(
          `${BASE_URL}/cliente-paciente/buscar/?ci=${paciente.ci_paciente}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (buscarRes.ok) {
          const data = await buscarRes.json();
          if (data.paciente && data.paciente.id) {
            pacienteId = data.paciente.id;
          }
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un problema al buscar el paciente.",
          confirmButtonColor: "#7d2a3f",
        });
      }

      // 2. Si no existe, crear nuevo paciente/cliente
      if (!pacienteId) {
        const payload = {
          ci: paciente.ci_paciente,
          nombre_cliente: paciente.nombres,
          apellido_cliente: paciente.apellidos,
          correo_cliente: paciente.correo_cliente,
          telefono_cliente: paciente.telefono_celular,
          direccion_cliente: paciente.direccion,
          informacion_cliente: paciente.informacion_cliente,
          nombres_paciente: paciente.nombres,
          apellidos_paciente: paciente.apellidos,
          fecha_nacimiento: paciente.fecha_nacimiento,
          ocupacion_paciente: paciente.ocupacion,
          direccion_paciente: paciente.direccion,
          telefono_paciente: paciente.telefono_celular,
          antecedentes_paciente: paciente.antecedentes,
        };

        const res = await fetch(`${BASE_URL}/cliente-paciente/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errorData = await res.json();
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un problema al crear el paciente.",
            confirmButtonColor: "#7d2a3f",
          });
          throw new Error("Error al crear paciente");
        }

        const data = await res.json();
        pacienteId = data.paciente.id;
      }

      // 3. Preparar y enviar ficha médica
      const fichaPayload = {
        ...parseOpticalData(opticalData),
        paciente: pacienteId,
        usuario: user?.id,
        sucursal: user?.sucursal,
      };

      // Normalizar campos enteros
      const fichaPayloadFinal = normalizarCamposEnteros(
        fichaPayload,
        integerFields
      );

      const fichaRes = await fetch(`${BASE_URL}/fichas-medicas/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(fichaPayloadFinal),
      });

      if (!fichaRes.ok) {
        const errorData = await fichaRes.json();
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un problema al guardar la ficha médica.",
          confirmButtonColor: "#7d2a3f",
        });
        throw new Error("Error al guardar ficha médica");
      }

      const nuevaFicha = await fichaRes.json();
      setFichasPasadas((prev) => [nuevaFicha, ...(prev || [])]);

      // Limpiar formularios
      setPaciente({
        ci_paciente: "",
        apellidos: "",
        nombres: "",
        fecha_nacimiento: "",
        ocupacion: "",
        direccion: "",
        telefono_celular: "",
        antecedentes: "",
        correo_cliente: "",
        informacion_cliente: "",
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

        // Lentes de contacto
        esq_od_cc: "",
        esq_od_esfera: "",
        esq_od_cilindro: "",
        esq_od_eje: "",
        esq_oi_cc: "",
        esq_oi_esfera: "",
        esq_oi_cilindro: "",
        esq_oi_eje: "",

        // RX FINAL
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
        // RX ANTERIOR
        rx_anterior_od_avsc: "",
        rx_anterior_oi_avsc: "",
        rx_anterior_add_avsc: "",

        // Extras
        causa: "",
        observaciones: "",
        altura: "",
        material: "",
      });

      Swal.fire({
        icon: "success",
        title: "Éxito",
        text: "Paciente y ficha médica guardados correctamente",
        confirmButtonColor: "#7d2a3f",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Ocurrió un error al guardar los datos",
        confirmButtonColor: "#7d2a3f",
      });
    }
  };
  const cargarPacienteDesdeData = (entry) => {
    setPaciente({
      ci_paciente: entry.paciente?.ci_paciente || "",
      apellidos: entry.paciente?.apellidos_paciente || "",
      nombres: entry.paciente?.nombres_paciente || "",
      fecha_nacimiento: entry.paciente?.fecha_nacimiento || "",
      ocupacion: entry.paciente?.ocupacion_paciente || "",
      direccion: entry.paciente?.direccion_paciente || "",
      telefono_celular: entry.paciente?.telefono_paciente || "",
      antecedentes: entry.paciente?.antecedentes_paciente || "",
      correo_cliente: entry.cliente?.correo_cliente || "",
      informacion_cliente: entry.cliente?.informacion_cliente || "",
      apellido_cliente: entry.cliente?.apellido_cliente || "",
    });

    setFichasPasadas(entry.historial_fichas || []);
    setMostrarModal(false);
  };

  const buscarPorApellido = async () => {
    const token = localStorage.getItem("access_token");

    if (!apellidoBusqueda.trim()) return;

    try {
      const res = await fetch(
        `${BASE_URL}/cliente-paciente/buscar-apellido/?apellido=${apellidoBusqueda}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (data.length === 0) {
        Swal.fire({
          icon: "info",
          title: "Sin resultados",
          text: "No se encontraron pacientes con ese apellido.",
          confirmButtonColor: "#7d2a3f",
        });
        return;
      }

      if (data.length === 1) {
        cargarPacienteDesdeData(data[0]);
      } else {
        setResultadosApellido(data);
        setMostrarModal(true);
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al buscar el paciente.",
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
                  Guardar solo paciente
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
                    Cédula del Paciente
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
                    htmlFor="buscar_apellido"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Buscar por Apellido
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      id="buscar_apellido"
                      className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-[#7d2a3f]"
                      value={apellidoBusqueda}
                      onChange={(e) => handleBuscarApellidoChange(e.target.value)}
                      placeholder="Ej: Gamboa"
                    />
                    <button
                      type="button"
                      onClick={buscarPorApellido}
                      className="bg-[#7d2a3f] text-white p-2 rounded-md ml-2"
                    >
                      <Search className="h-5 w-5" />
                    </button>
                  </div>
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

                {/* Apellidos - NUEVO CAMPO */}
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
                {/* Correo Electrónico */}
                <div className="form-group">
                  <label
                    htmlFor="correo_cliente"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    id="correo_cliente"
                    className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-[#7d2a3f]"
                    value={paciente.correo_cliente || ""}
                    onChange={(e) =>
                      handlePacienteChange("correo_cliente", e.target.value)
                    }
                    placeholder="Ej: ejemplo@email.com"
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
                  <input
                    type="text"
                    id="direccion"
                    className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-[#7d2a3f]"
                    value={paciente.direccion}
                    onChange={(e) =>
                      handlePacienteChange("direccion", e.target.value)
                    }
                  />
                </div>
                {/* Información Adicional */}
                <div className="form-group md:col-span-2">
                  <label
                    htmlFor="informacion_cliente"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Información Adicional
                  </label>
                  <textarea
                    id="informacion_cliente"
                    rows={3}
                    className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-[#7d2a3f]"
                    value={paciente.informacion_cliente || ""}
                    onChange={(e) =>
                      handlePacienteChange(
                        "informacion_cliente",
                        e.target.value
                      )
                    }
                    placeholder="Ej: Cliente frecuente, refiere molestias, etc."
                  />
                </div>

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
                {/* RX ANTERIOR */}
                <table className="w-full border-collapse mt-4">
                  <thead>
                    <tr>
                      <th
                        colSpan={6}
                        className="p-2 border border-gray-300 bg-[#7d2a3f] text-white text-left"
                      >
                        RX ANTERIOR
                      </th>
                    </tr>
                    <tr className="bg-gray-100">
                      <th className="p-2 border border-gray-300">Ojo</th>
                      <th className="p-2 border border-gray-300">AV SC</th>
                      <th className="p-2 border border-gray-300">Esfera</th>
                      <th className="p-2 border border-gray-300">Cilindro</th>
                      <th className="p-2 border border-gray-300">
                        Eje(grados)
                      </th>
                      <th className="p-2 border border-gray-300">AV CC</th>
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
                          value={opticalData.rx_anterior_od_avsc || ""}
                          onChange={(e) =>
                            handleOpticalDataChange(
                              "rx_anterior_od_avsc",
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td className="p-2 border border-gray-300">
                        <input
                          type="text"
                          className="w-full p-1 border border-gray-300 rounded"
                          value={opticalData.rs_od_esfera || ""}
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
                          value={opticalData.rs_od_cilindro || ""}
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
                          value={opticalData.rs_od_eje || ""}
                          onChange={(e) =>
                            handleOpticalDataChange("rs_od_eje", e.target.value)
                          }
                        />
                      </td>
                      <td className="p-2 border border-gray-300">
                        <input
                          type="text"
                          className="w-full p-1 border border-gray-300 rounded"
                          value={opticalData.rs_od_correccion || ""}
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
                          value={opticalData.rx_anterior_oi_avsc || ""}
                          onChange={(e) =>
                            handleOpticalDataChange(
                              "rx_anterior_oi_avsc",
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td className="p-2 border border-gray-300">
                        <input
                          type="text"
                          className="w-full p-1 border border-gray-300 rounded"
                          value={opticalData.rs_oi_esfera || ""}
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
                          value={opticalData.rs_oi_cilindro || ""}
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
                          value={opticalData.rs_oi_eje || ""}
                          onChange={(e) =>
                            handleOpticalDataChange("rs_oi_eje", e.target.value)
                          }
                        />
                      </td>
                      <td className="p-2 border border-gray-300">
                        <input
                          type="text"
                          className="w-full p-1 border border-gray-300 rounded"
                          value={opticalData.rs_oi_correccion || ""}
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
                          value={opticalData.rx_anterior_add_avsc || ""}
                          onChange={(e) =>
                            handleOpticalDataChange(
                              "rx_anterior_add_avsc",
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td className="p-2 border border-gray-300">
                        <input
                          type="text"
                          className="w-full p-1 border border-gray-300 rounded"
                          value={opticalData.rs_add_esfera || ""}
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
                          value={opticalData.rs_add_cilindro || ""}
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
                          value={opticalData.rs_add_eje || ""}
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
                          value={opticalData.rs_add_correccion || ""}
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

                {/* EXAMÉN COMPUTARIZADA */}
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
                        <th className="p-2 border border-gray-300">
                          Eje (grados)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-2 border border-gray-300 bg-gray-100 font-medium">
                          OD
                        </td>
                        <td className="p-2 border border-gray-300">
                          <input
                            type="text"
                            className="w-full p-1 border border-gray-300 rounded"
                            value={
                              opticalData.esq_od_esfera_computarizado || ""
                            }
                            onChange={(e) =>
                              handleOpticalDataChange(
                                "esq_od_esfera_computarizado",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="p-2 border border-gray-300">
                          <input
                            type="text"
                            className="w-full p-1 border border-gray-300 rounded"
                            value={
                              opticalData.esq_od_cilindro_computarizado || ""
                            }
                            onChange={(e) =>
                              handleOpticalDataChange(
                                "esq_od_cilindro_computarizado",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="p-2 border border-gray-300">
                          <input
                            type="text"
                            className="w-full p-1 border border-gray-300 rounded"
                            value={opticalData.esq_od_eje_computarizado || ""}
                            onChange={(e) =>
                              handleOpticalDataChange(
                                "esq_od_eje_computarizado",
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
                            value={
                              opticalData.esq_oi_esfera_computarizado || ""
                            }
                            onChange={(e) =>
                              handleOpticalDataChange(
                                "esq_oi_esfera_computarizado",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="p-2 border border-gray-300">
                          <input
                            type="text"
                            className="w-full p-1 border border-gray-300 rounded"
                            value={
                              opticalData.esq_oi_cilindro_computarizado || ""
                            }
                            onChange={(e) =>
                              handleOpticalDataChange(
                                "esq_oi_cilindro_computarizado",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="p-2 border border-gray-300">
                          <input
                            type="text"
                            className="w-full p-1 border border-gray-300 rounded"
                            value={opticalData.esq_oi_eje_computarizado || ""}
                            onChange={(e) =>
                              handleOpticalDataChange(
                                "esq_oi_eje_computarizado",
                                e.target.value
                              )
                            }
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {/* RX. REFRACCIÓN */}
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
                        <th className="p-2 border border-gray-300">Ojo</th>
                        <th className="p-2 border border-gray-300">Esfera</th>
                        <th className="p-2 border border-gray-300">Cilindro</th>
                        <th className="p-2 border border-gray-300">
                          Eje(Grados)
                        </th>
                        <th className="p-2 border border-gray-300">DNP(mm)</th>
                        <th className="p-2 border border-gray-300">A.V.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* DISTANCIA */}
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
                          <td className="p-2 border border-gray-300 bg-gray-100 font-medium">
                            {ojo.toUpperCase()}
                          </td>
                          <td className="p-2 border border-gray-300">
                            <input
                              className="w-full p-1 border border-gray-300 rounded"
                              type="text"
                              value={
                                opticalData[`rx_distancia_${ojo}_esfera`] || ""
                              }
                              onChange={(e) =>
                                handleOpticalDataChange(
                                  `rx_distancia_${ojo}_esfera`,
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td className="p-2 border border-gray-300">
                            <input
                              className="w-full p-1 border border-gray-300 rounded"
                              type="text"
                              value={
                                opticalData[`rx_distancia_${ojo}_cilindro`] ||
                                ""
                              }
                              onChange={(e) =>
                                handleOpticalDataChange(
                                  `rx_distancia_${ojo}_cilindro`,
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td className="p-2 border border-gray-300">
                            <input
                              className="w-full p-1 border border-gray-300 rounded"
                              type="text"
                              value={
                                opticalData[`rx_distancia_${ojo}_eje`] || ""
                              }
                              onChange={(e) =>
                                handleOpticalDataChange(
                                  `rx_distancia_${ojo}_eje`,
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td className="p-2 border border-gray-300">
                            <input
                              className="w-full p-1 border border-gray-300 rounded"
                              type="text"
                              value={
                                opticalData[`rx_distancia_${ojo}_dnp`] || ""
                              }
                              onChange={(e) =>
                                handleOpticalDataChange(
                                  `rx_distancia_${ojo}_dnp`,
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td className="p-2 border border-gray-300">
                            <input
                              className="w-full p-1 border border-gray-300 rounded"
                              type="text"
                              value={
                                opticalData[`rx_distancia_${ojo}_av`] || ""
                              }
                              onChange={(e) =>
                                handleOpticalDataChange(
                                  `rx_distancia_${ojo}_av`,
                                  e.target.value
                                )
                              }
                            />
                          </td>
                        </tr>
                      ))}

                      {/* ADD */}
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
                          <td className="p-2 border border-gray-300 bg-gray-100 font-medium">
                            {ojo.toUpperCase()}
                          </td>
                          <td className="p-2 border border-gray-300">
                            <input
                              className="w-full p-1 border border-gray-300 rounded"
                              type="text"
                              value={opticalData[`rx_add_${ojo}_esfera`] || ""}
                              onChange={(e) =>
                                handleOpticalDataChange(
                                  `rx_add_${ojo}_esfera`,
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td className="p-2 border border-gray-300 bg-gray-200"></td>
                          <td className="p-2 border border-gray-300 bg-gray-200"></td>
                          <td className="p-2 border border-gray-300 bg-gray-200"></td>
                          <td className="p-2 border border-gray-300">
                            <input
                              className="w-full p-1 border border-gray-300 rounded"
                              type="text"
                              value={opticalData[`rx_add_${ojo}_av`] || ""}
                              onChange={(e) =>
                                handleOpticalDataChange(
                                  `rx_add_${ojo}_av`,
                                  e.target.value
                                )
                              }
                            />
                          </td>
                        </tr>
                      ))}

                      {/* LECTURA */}
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
                          <td className="p-2 border border-gray-300 bg-gray-100 font-medium">
                            {ojo.toUpperCase()}
                          </td>
                          <td className="p-2 border border-gray-300">
                            <input
                              className="w-full p-1 border border-gray-300 rounded"
                              type="text"
                              value={
                                opticalData[`rx_lectura_${ojo}_esfera`] || ""
                              }
                              onChange={(e) =>
                                handleOpticalDataChange(
                                  `rx_lectura_${ojo}_esfera`,
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td className="p-2 border border-gray-300">
                            <input
                              className="w-full p-1 border border-gray-300 rounded"
                              type="text"
                              value={
                                opticalData[`rx_lectura_${ojo}_cilindro`] || ""
                              }
                              onChange={(e) =>
                                handleOpticalDataChange(
                                  `rx_lectura_${ojo}_cilindro`,
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td className="p-2 border border-gray-300">
                            <input
                              className="w-full p-1 border border-gray-300 rounded"
                              type="text"
                              value={opticalData[`rx_lectura_${ojo}_eje`] || ""}
                              onChange={(e) =>
                                handleOpticalDataChange(
                                  `rx_lectura_${ojo}_eje`,
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td className="p-2 border border-gray-300 bg-gray-200"></td>
                          <td className="p-2 border border-gray-300">
                            <input
                              className="w-full p-1 border border-gray-300 rounded"
                              type="text"
                              value={opticalData[`rx_lectura_${ojo}_av`] || ""}
                              onChange={(e) =>
                                handleOpticalDataChange(
                                  `rx_lectura_${ojo}_av`,
                                  e.target.value
                                )
                              }
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* LENTES DE CONTACTO */}
                <div className="overflow-x-auto">
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
                            value={opticalData.esq_od_cc || ""}
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
                            value={opticalData.esq_od_esfera || ""}
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
                            value={opticalData.esq_od_cilindro || ""}
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
                            value={opticalData.esq_od_eje || ""}
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
                            value={opticalData.esq_oi_cc || ""}
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
                            value={opticalData.esq_oi_esfera || ""}
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
                            value={opticalData.esq_oi_cilindro || ""}
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
                            value={opticalData.esq_oi_eje || ""}
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

                  {/* Altura, Material, Armazón, Causa, Observaciones */}
                  <table className="w-full border-collapse border border-gray-300 mt-4 text-sm">
                    <tbody>
                      <tr>
                        <td className="p-2 border border-gray-300 font-medium">
                          Altura
                        </td>
                        <td className="p-2 border border-gray-300">
                          <input
                            type="text"
                            className="w-full p-1 border border-gray-300 rounded"
                            value={opticalData.altura || ""}
                            onChange={(e) =>
                              handleOpticalDataChange("altura", e.target.value)
                            }
                          />
                        </td>
                        <td className="p-2 border border-gray-300 font-medium">
                          Causa
                        </td>
                        <td className="p-2 border border-gray-300">
                          <input
                            type="text"
                            className="w-full p-1 border border-gray-300 rounded"
                            value={opticalData.causa || ""}
                            onChange={(e) =>
                              handleOpticalDataChange("causa", e.target.value)
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2 border border-gray-300 font-medium">
                          Material
                        </td>
                        <td className="p-2 border border-gray-300">
                          <input
                            type="text"
                            className="w-full p-1 border border-gray-300 rounded"
                            value={opticalData.material || ""}
                            onChange={(e) =>
                              handleOpticalDataChange(
                                "material",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="p-2 border border-gray-300 font-medium">
                          Armazón
                        </td>
                        <td className="p-2 border border-gray-300">
                          <input
                            type="text"
                            className="w-full p-1 border border-gray-300 rounded"
                            value={opticalData.armazon || ""}
                            onChange={(e) =>
                              handleOpticalDataChange("armazon", e.target.value)
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
                            value={opticalData.observaciones || ""}
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
                {!Array.isArray(fichasPasadas) ? (
                  <p>Cargando historial...</p>
                ) : fichasPasadas.length === 0 ? (
                  <p>No hay fichas registradas para este paciente.</p>
                ) : (
                  fichasPasadas.map((ficha, index) => (
                    <FichaVisual key={index} data={ficha} />
                  ))
                )}
              </div>
            )}
          </div>
        </main>
        {mostrarModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
              <h2 className="text-lg font-semibold mb-4 text-[#7d2a3f]">
                Selecciona un paciente
              </h2>
              <ul className="divide-y divide-gray-200 max-h-80 overflow-y-auto">
                {resultadosApellido.map((entry, index) => (
                  <li
                    key={index}
                    className="py-3 px-4 hover:bg-gray-100 cursor-pointer"
                    onClick={() => cargarPacienteDesdeData(entry)}
                  >
                    <div className="font-medium">
                      {entry.paciente?.apellidos_paciente},{" "}
                      {entry.paciente?.nombres_paciente}
                    </div>
                    <div className="text-sm text-gray-500">
                      CI: {entry.paciente?.ci_paciente || "Sin cédula"} — Tel:{" "}
                      {entry.paciente?.telefono_paciente || "N/A"}
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-4 text-right">
                <button
                  onClick={() => setMostrarModal(false)}
                  className="text-[#7d2a3f] hover:underline"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
