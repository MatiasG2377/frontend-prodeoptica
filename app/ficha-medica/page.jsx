"use client";

import { useAuth } from "../hooks/useAuth";
import { useState, useRef, useEffect } from "react";
import { Save, Printer, Search, Calendar, UserCheck, ArrowRight, Info, FileText, CheckCircle2, UserPlus } from "lucide-react";
import Header from "../components/common/Header2";
import Swal from "sweetalert2";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import FichaVisual from "../components/ficha-medica/FichaVisual";
import { parseApiResponse, getErrorMessage } from "../utils/apiError";
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
    correo_cliente: "",
    informacion_cliente: "",
  });

  const [errors, setErrors] = useState({
    telefono_celular: '',
    correo_cliente: ''
  });
  
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };
  
  const validatePhone = (phone) => {
    // Permite números, +, -, espacios y paréntesis
    const re = /^[0-9+\-\s()]*$/;
    return re.test(phone);
  };

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
    armazon: "",
    rx_anterior_od_avsc: "",
    rx_anterior_oi_avsc: "",
    rx_anterior_add_avsc: "",
  });
  const [apellidoBusqueda, setApellidoBusqueda] = useState("");
  const [resultadosApellido, setResultadosApellido] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const lastSearchedCiRef = useRef("");

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

  const limpiarFormularioPaciente = () => {
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
    setApellidoBusqueda("");
    setFichasPasadas([]);
    lastSearchedCiRef.current = "";
    Swal.fire({
      icon: "info",
      title: "Formulario reiniciado",
      text: "Campos limpios para registrar a un nuevo paciente.",
      timer: 1500,
      showConfirmButton: false,
    });
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
      // Validar teléfono
      setErrors(prev => ({
        ...prev,
        telefono_celular: value ? (validatePhone(value) ? '' : 'Ingrese un número de teléfono válido') : ''
      }));
      if (value === '' || validatePhone(value)) {
        setPaciente(prev => ({ ...prev, [field]: value }));
      }
    } else if (field === 'correo_cliente') {
      // Actualizar el valor primero
      setPaciente(prev => ({ ...prev, [field]: value }));
      
      // Validar solo si hay contenido
      if (value && value.trim() !== '') {
        setErrors(prev => ({
          ...prev,
          correo_cliente: validateEmail(value) ? '' : 'Ingrese un correo electrónico válido'
        }));
      } else {
        // Limpiar el error si el campo está vacío
        setErrors(prev => ({
          ...prev,
          correo_cliente: ''
        }));
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
    if (e && e.preventDefault) e.preventDefault();

    if (!paciente.nombres?.trim() || !paciente.apellidos?.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Datos requeridos",
        text: "Por favor ingresa al menos los nombres y apellidos del paciente.",
        confirmButtonColor: "#712b39",
      });
      return;
    }
    
    // Validar campos antes de enviar
    const newErrors = {
      telefono_celular: paciente.telefono_celular ? (validatePhone(paciente.telefono_celular) ? '' : 'Ingrese un número de teléfono válido') : ''
    };
    
    // Solo validar correo si tiene contenido
    if (paciente.correo_cliente && paciente.correo_cliente.trim() !== '') {
      newErrors.correo_cliente = validateEmail(paciente.correo_cliente) ? '' : 'Ingrese un correo electrónico válido';
    } else {
      newErrors.correo_cliente = '';
    }
    
    setErrors(newErrors);
    
    // Verificar si hay errores
    if (Object.values(newErrors).some(error => error)) {
      return; // Detener el envío si hay errores
    }

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

      try {
        await parseApiResponse(res);
      } catch (error) {
        if (error?.status !== 400) throw error;
      }

      Swal.fire({
        icon: "success",
        title: "Paciente y Cliente guardados",
        text: "Los datos se guardaron correctamente.",
        confirmButtonColor: "#712b39",
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
        text: getErrorMessage(error),
        confirmButtonColor: "#712b39",
      });
    }
  };

  const buscarPacientePorCI = async (ciOverride, isAuto = false) => {
    const ciBuscada = (ciOverride || paciente.ci_paciente || "").trim();
    if (!ciBuscada) return;

    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

    try {
      const res = await fetch(
        `${BASE_URL}/cliente-paciente/buscar/?ci=${ciBuscada}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (!res.ok) {
        setFichasPasadas([]);
        if (!isAuto) {
          Swal.fire({
            icon: "warning",
            title: "Paciente no encontrado",
            text: "No existe registro con esa cédula. Puedes continuar registrando a un nuevo paciente.",
            confirmButtonColor: "#712b39",
          });
        }
        return;
      }

      const data = await res.json();

      if (!data.paciente) {
        setFichasPasadas([]);
        if (!isAuto) {
          Swal.fire({
            icon: "warning",
            title: "Paciente no encontrado",
            text: "No se encontraron datos para este paciente.",
            confirmButtonColor: "#712b39",
          });
        }
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

      setFichasPasadas(Array.isArray(data.historial_fichas) ? data.historial_fichas : []);

      Swal.fire({
        icon: "success",
        title: "Paciente cargado",
        text: `Datos de ${data.paciente.nombres_paciente || ''} ${data.paciente.apellidos_paciente || ''} listos en el formulario.`,
        confirmButtonColor: "#712b39",
        timer: isAuto ? 1500 : undefined,
      });
    } catch (error) {
      console.warn("No se pudo conectar con el servidor para buscar paciente:", error);
      if (!isAuto) {
        Swal.fire({
          icon: "error",
          title: "Error de conexión",
          text: "No se pudo conectar con el servidor de la óptica. Verifica que el backend esté en ejecución.",
          confirmButtonColor: "#712b39",
        });
      }
    }
  };

  useEffect(() => {
    const ciClean = (paciente.ci_paciente || '').trim();
    if (ciClean.length === 10 && ciClean !== lastSearchedCiRef.current) {
      lastSearchedCiRef.current = ciClean;
      buscarPacientePorCI(ciClean, true);
    }
  }, [paciente.ci_paciente]);

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
      // Validación básica
      if (!paciente.nombres || !paciente.apellidos) {
        Swal.fire({
          icon: "warning",
          title: "Datos incompletos",
          text: "Por favor completa cédula, nombres y apellidos del paciente.",
          confirmButtonColor: "#712b39",
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
          confirmButtonColor: "#712b39",
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

        const data = await parseApiResponse(res);
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

      const nuevaFicha = await parseApiResponse(fichaRes);
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
        confirmButtonColor: "#712b39",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: getErrorMessage(error),
        confirmButtonColor: "#712b39",
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

      const data = await parseApiResponse(res);

      if (data.length === 0) {
        Swal.fire({
          icon: "info",
          title: "Sin resultados",
          text: "No se encontraron pacientes con ese apellido.",
          confirmButtonColor: "#712b39",
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
        text: getErrorMessage(err),
        confirmButtonColor: "#712b39",
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-100">
              <div>
                <h1 className="text-xl font-bold text-[#712b39] flex items-center gap-2">
                  <FileText className="w-6 h-6 text-[#712b39]" />
                  <span>Ficha Médica y Control Optométrico</span>
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  Registro de datos del paciente, refracción clínica e historial
                </p>
              </div>

              {/* Indicador de paciente activo */}
              {paciente.nombres || paciente.ci_paciente ? (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium self-start sm:self-auto">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span>
                    Paciente: <strong>{paciente.nombres} {paciente.apellidos}</strong>
                    {paciente.ci_paciente ? ` (CI: ${paciente.ci_paciente})` : ""}
                  </span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-xs text-gray-500 self-start sm:self-auto">
                  <span>Nuevo Registro Clínico</span>
                </div>
              )}
            </div>

            {/* Tabs con progresión visual y badges de pasos */}
            <div className="border-b border-gray-200 mb-6">
              <div className="flex -mb-px space-x-2">
                <button
                  type="button"
                  className={`py-2.5 px-4 font-semibold text-sm transition-colors border-b-2 inline-flex items-center gap-2 ${
                    activeTab === "paciente"
                      ? "border-[#712b39] text-[#712b39]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                  onClick={() => setActiveTab("paciente")}
                >
                  <span
                    className={`w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center ${
                      activeTab === "paciente"
                        ? "bg-[#712b39] text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    1
                  </span>
                  <span>Datos del Paciente</span>
                </button>
                <button
                  type="button"
                  className={`py-2.5 px-4 font-semibold text-sm transition-colors border-b-2 inline-flex items-center gap-2 ${
                    activeTab === "ficha"
                      ? "border-[#712b39] text-[#712b39]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                  onClick={() => setActiveTab("ficha")}
                >
                  <span
                    className={`w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center ${
                      activeTab === "ficha"
                        ? "bg-[#712b39] text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    2
                  </span>
                  <span>Ficha Médica y Refracción</span>
                </button>
                <button
                  type="button"
                  className={`py-2.5 px-4 font-semibold text-sm transition-colors border-b-2 inline-flex items-center gap-2 ${
                    activeTab === "historial"
                      ? "border-[#712b39] text-[#712b39]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                  onClick={() => setActiveTab("historial")}
                >
                  <span
                    className={`w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center ${
                      activeTab === "historial"
                        ? "bg-[#712b39] text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    3
                  </span>
                  <span>Historial Clínico</span>
                  {Array.isArray(fichasPasadas) && fichasPasadas.length > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 text-xs bg-gray-100 text-gray-700 rounded-full font-bold">
                      {fichasPasadas.length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Formulario de Registro de Paciente */}
            {activeTab === "paciente" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* SECCIÓN 1: PANEL DE BÚSQUEDA RÁPIDA (PACIENTES EXISTENTES) */}
                <div className="md:col-span-2 bg-gradient-to-r from-stone-50 to-neutral-50 border border-stone-200 rounded-2xl p-4 sm:p-5 shadow-xs mb-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                        <Search className="w-4 h-4 text-[#712b39]" />
                        <span>Búsqueda Rápida de Paciente Registrado</span>
                      </h3>
                      <p className="text-xs text-gray-500">
                        Si el paciente ya ha visitado la óptica, búscalo por cédula o apellido para cargar su historial clínico.
                      </p>
                    </div>

                    {/* Botón para limpiar o empezar paciente nuevo */}
                    {(paciente.nombres || paciente.ci_paciente || paciente.apellidos) && (
                      <button
                        type="button"
                        onClick={limpiarFormularioPaciente}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 hover:border-[#712b39] bg-white text-gray-700 hover:text-[#712b39] text-xs font-semibold shadow-2xs transition active:scale-95 self-start sm:self-auto"
                        title="Limpiar datos y registrar a un paciente nuevo"
                      >
                        <UserPlus className="w-3.5 h-3.5 text-[#712b39]" />
                        <span>Nuevo Paciente (Limpiar)</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Búsqueda por Cédula */}
                    <div>
                      <label htmlFor="buscar_ci" className="block text-xs font-semibold text-gray-700 mb-1">
                        Buscar por Cédula (CI)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          id="buscar_ci"
                          maxLength={13}
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#712b39]"
                          value={paciente.ci_paciente || ""}
                          onChange={(e) => handlePacienteChange("ci_paciente", e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              buscarPacientePorCI();
                            }
                          }}
                          placeholder="Ej: 0102030405"
                        />
                        <button
                          type="button"
                          onClick={buscarPacientePorCI}
                          className="inline-flex items-center gap-1 px-4 py-2 bg-[#712b39] hover:bg-[#5e242e] text-white rounded-xl text-sm font-semibold transition active:scale-95 shadow-xs shrink-0"
                        >
                          <Search className="w-4 h-4" />
                          <span className="hidden sm:inline">Buscar</span>
                        </button>
                      </div>
                      <span className="text-[11px] text-gray-400 mt-1 block">
                        Búsqueda instantánea al ingresar 10 dígitos o presionar Enter
                      </span>
                    </div>

                    {/* Búsqueda por Apellido */}
                    <div>
                      <label htmlFor="buscar_apellido_field" className="block text-xs font-semibold text-gray-700 mb-1">
                        Buscar por Apellido
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          id="buscar_apellido_field"
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#712b39]"
                          value={apellidoBusqueda}
                          onChange={(e) => handleBuscarApellidoChange(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              buscarPorApellido();
                            }
                          }}
                          placeholder="Ej: Gamboa, Pérez, Morales..."
                        />
                        <button
                          type="button"
                          onClick={buscarPorApellido}
                          className="inline-flex items-center gap-1 px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-xl text-sm font-semibold transition active:scale-95 shadow-xs shrink-0"
                        >
                          <Search className="w-4 h-4" />
                          <span className="hidden sm:inline">Buscar</span>
                        </button>
                      </div>
                      <span className="text-[11px] text-gray-400 mt-1 block">
                        Abre lista desplegable de coincidencias
                      </span>
                    </div>
                  </div>

                  {/* Banner si el paciente fue cargado exitosamente */}
                  {paciente.nombres && (
                    <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>
                          <strong>Paciente activo:</strong> {paciente.nombres} {paciente.apellidos} {paciente.ci_paciente && `• CI: ${paciente.ci_paciente}`}
                          {fichasPasadas.length > 0 ? ` • ${fichasPasadas.length} consultas previas registradas` : " • Sin consultas anteriores"}
                        </span>
                      </div>
                      <span className="text-[11px] text-emerald-700 font-bold bg-white px-2.5 py-0.5 rounded-full border border-emerald-200">
                        Expediente cargado
                      </span>
                    </div>
                  )}
                </div>

                {/* SECCIÓN 2: FORMULARIO DE DATOS PERSONALES */}
                <div className="md:col-span-2 pt-1 border-b pb-2 mb-2 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-gray-800">
                      Datos del Expediente del Paciente
                    </h3>
                    <p className="text-xs text-gray-500">
                      Completa o verifica la información para la ficha optométrica y facturación.
                    </p>
                  </div>
                  <span className="text-xs text-rose-600 font-semibold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    * Campos obligatorios
                  </span>
                </div>

                {/* Cédula del Paciente */}
                <div className="form-group">
                  <label
                    htmlFor="ci_paciente_form"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Cédula de Identidad (CI)
                  </label>
                  <input
                    type="text"
                    id="ci_paciente_form"
                    maxLength={13}
                    className="border border-gray-300 rounded-xl px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#712b39]"
                    value={paciente.ci_paciente || ""}
                    onChange={(e) =>
                      handlePacienteChange("ci_paciente", e.target.value)
                    }
                    placeholder="Ej: 0102030405"
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
                    className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-[#712b39]"
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
                    className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-[#712b39]"
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
                      className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-[#712b39]"
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
                    className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-[#712b39]"
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
                  <div>
                    <input
                      type="text"
                      id="telefono_celular"
                      className={`border ${errors.telefono_celular ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-[#712b39]`}
                      value={paciente.telefono_celular || ""}
                      onChange={(e) =>
                        handlePacienteChange("telefono_celular", e.target.value)
                      }
                      placeholder="Ej: +56 9 1234 5678"
                    />
                    {errors.telefono_celular && (
                      <p className="mt-1 text-sm text-red-600">{errors.telefono_celular}</p>
                    )}
                  </div>
                </div>

                {/* Correo Electrónico */}
                <div className="form-group">
                  <label
                    htmlFor="correo_cliente"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Correo Electrónico
                  </label>
                  <div>
                    <input
                      type="email"
                      id="correo_cliente"
                      className={`border ${errors.correo_cliente ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-[#712b39]`}
                      value={paciente.correo_cliente || ""}
                      onChange={(e) =>
                        handlePacienteChange("correo_cliente", e.target.value)
                      }
                      placeholder="ejemplo@correo.com"
                    />
                    {errors.correo_cliente && (
                      <p className="mt-1 text-sm text-red-600">{errors.correo_cliente}</p>
                    )}
                  </div>
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
                    className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-[#712b39]"
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
                    className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-[#712b39]"
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
                    className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-[#712b39]"
                    value={paciente.antecedentes}
                    onChange={(e) =>
                      handlePacienteChange("antecedentes", e.target.value)
                    }
                    placeholder="Ingrese antecedentes médicos relevantes, alergias, condiciones previas, etc."
                  ></textarea>
                </div>

                <div className="md:col-span-2 mt-6 pt-6 border-t border-gray-200">
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                        <Info className="w-4 h-4 text-[#712b39]" />
                        Opciones de registro del paciente
                      </h3>
                      <p className="text-xs text-gray-600 leading-relaxed max-w-xl">
                        • <strong>Guardar Solo Paciente:</strong> Guarda los datos personales en la base de datos sin consulta óptica hoy.<br />
                        • <strong>Continuar a Ficha Médica:</strong> Pasa a la refracción; los datos del paciente se guardarán junto con la ficha.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                      {/* Botón Secundario: Registrar únicamente paciente */}
                      <button
                        type="button"
                        onClick={handleSubmit}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-gray-300 hover:border-[#712b39] bg-white hover:bg-red-50/30 text-gray-700 hover:text-[#712b39] font-bold text-sm shadow-xs transition active:scale-95 whitespace-nowrap group"
                        title="Registra únicamente los datos personales del paciente en la base de datos sin consulta óptica inmediata"
                      >
                        <UserCheck className="w-4 h-4 text-gray-500 group-hover:text-[#712b39] transition-colors" />
                        <span>Guardar Solo Paciente</span>
                      </button>

                      {/* Botón Primario: Continuar a la Ficha Médica */}
                      <button
                        type="button"
                        onClick={() => {
                          if (!paciente.nombres?.trim() || !paciente.apellidos?.trim()) {
                            Swal.fire({
                              icon: "warning",
                              title: "Datos requeridos",
                              text: "Por favor ingresa al menos los nombres y apellidos antes de pasar a la ficha médica.",
                              confirmButtonColor: "#712b39",
                            });
                            return;
                          }
                          setActiveTab("ficha");
                        }}
                        className="inline-flex items-center justify-center gap-2 bg-[#712b39] hover:bg-[#5e242e] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition active:scale-95 whitespace-nowrap"
                        title="Pasa al examen optométrico para ingresar medidas de refracción"
                      >
                        <span>Continuar a Ficha Médica</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Ficha Médica Reorganizada sin huecos ni gaps */}
            {activeTab === "ficha" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 min-w-0 items-start">
                  {/* Columna Izquierda: RX ANTERIOR + LENTES DE CONTACTO + ESPECIFICACIONES */}
                  <div className="space-y-6">
                    {/* RX ANTERIOR */}
                    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-xs bg-white">
                      <table className="w-full border-collapse border border-gray-300 text-sm">
                  <thead>
                    <tr>
                      <th
                        colSpan={6}
                        className="p-2 border border-gray-300 bg-[#712b39] text-white text-left"
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
                    <tr className="bg-sky-50/30 hover:bg-sky-50/60 transition-colors">
                      <td className="p-2 border border-gray-300 font-medium text-center">
                        <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-sky-100 text-sky-800 border border-sky-300">O.D.</span>
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
                    <tr className="bg-indigo-50/30 hover:bg-indigo-50/60 transition-colors">
                      <td className="p-2 border border-gray-300 font-medium text-center">
                        <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-300">O.I.</span>
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
                    <tr className="bg-amber-50/30 hover:bg-amber-50/60 transition-colors">
                      <td className="p-2 border border-gray-300 font-medium text-center">
                        <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">A.D.D</span>
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
                    </div>

                    {/* LENTES DE CONTACTO */}
                    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-xs bg-white">
                      <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th
                          colSpan={6}
                          className="bg-[#712b39] text-white text-left p-2 font-bold border border-gray-300"
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
                        <td className="p-2 border border-gray-300 font-medium text-center">
                          <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-sky-100 text-sky-800 border border-sky-300">O.D.</span>
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
                        <td className="p-2 border border-gray-300 font-medium text-center">
                          <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-300">O.I.</span>
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
                    </div>

                    {/* ESPECIFICACIONES DE MONTURA Y LUNAS */}
                    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-xs bg-white">
                      <table className="w-full border-collapse border border-gray-300 mt-4 text-sm">
                    <thead>
                      <tr>
                        <th
                          colSpan={4}
                          className="bg-[#712b39] text-white text-left p-2 font-bold border border-gray-300"
                        >
                          ESPECIFICACIONES DE MONTURA Y LUNAS
                        </th>
                      </tr>
                    </thead>
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
                  </div>

                  {/* Columna Derecha: RX REFRACCIÓN (DISTANCIA, ADD, LECTURA) */}
                  <div className="space-y-6">
                    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-xs bg-white">
                      <table className="w-full border-collapse border border-gray-300 mt-4 text-sm">
                    <thead>
                      <tr>
                        <th
                          colSpan={7}
                          className="bg-[#712b39] text-white text-left p-2 font-bold border border-gray-300"
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
                          <td className="p-2 border border-gray-300 font-medium text-center">
                            {ojo.toLowerCase() === 'od' ? (
                              <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-sky-100 text-sky-800 border border-sky-300">O.D.</span>
                            ) : (
                              <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-300">O.I.</span>
                            )}
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
                          <td className="p-2 border border-gray-300 font-medium text-center">
                            {ojo.toLowerCase() === 'od' ? (
                              <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-sky-100 text-sky-800 border border-sky-300">O.D.</span>
                            ) : (
                              <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-300">O.I.</span>
                            )}
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
                          <td className="p-2 border border-gray-300 font-medium text-center">
                            {ojo.toLowerCase() === 'od' ? (
                              <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-sky-100 text-sky-800 border border-sky-300">O.D.</span>
                            ) : (
                              <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-300">O.I.</span>
                            )}
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
                  </div>
                </div>

                {/* Botones de acción inferiores */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    className="w-full sm:w-auto px-5 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition active:scale-95 text-sm"
                    onClick={() => setActiveTab("paciente")}
                  >
                    ← Volver a Datos del Paciente
                  </button>
                  <button
                    type="button"
                    className="w-full sm:w-auto bg-[#712b39] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#5e242e] shadow-md transition active:scale-95 text-sm"
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
              <h2 className="text-lg font-semibold mb-4 text-[#712b39]">
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
                  className="text-[#712b39] hover:underline"
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
