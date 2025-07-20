"use client";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  buscarPacientePorCIAPI,
  buscarPacientePorApellidoAPI,
  guardarFichaCompletaAPI,
} from "../services/fichaMedicaService"; // Puedes ajustar este import si usas otra ruta

export default function useFichaMedica() {
  const [paciente, setPaciente] = useState({});
  const [opticalData, setOpticalData] = useState({});
  const [historialFichas, setHistorialFichas] = useState([]);
  const [apellidoBusqueda, setApellidoBusqueda] = useState("");

  const handlePacienteChange = (campo, valor) => {
    setPaciente((prev) => ({ ...prev, [campo]: valor }));
  };

  const handleOpticalDataChange = (campo, valor) => {
    setOpticalData((prev) => ({ ...prev, [campo]: valor }));
  };

  const buscarPacientePorCI = async () => {
    if (!paciente.ci_paciente) {
      Swal.fire({
        icon: "warning",
        title: "Campo requerido",
        text: "Debes ingresar una cédula para buscar.",
        confirmButtonColor: "#712b39",
      });
      return;
    }
    try {
      const { pacienteData, historial } = await buscarPacientePorCIAPI(
        paciente.ci_paciente
      );
      setPaciente(pacienteData);
      setHistorialFichas(historial);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "No encontrado",
        text: "No se encontró ningún paciente con esa cédula.",
        confirmButtonColor: "#712b39",
      });
    }
  };

  const buscarPorApellido = async () => {
    if (!apellidoBusqueda.trim()) return;
    try {
      const pacienteData = await buscarPacientePorApellidoAPI(apellidoBusqueda);
      setPaciente(pacienteData);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "No encontrado",
        text: "No se encontró ningún paciente con ese apellido.",
        confirmButtonColor: "#712b39",
      });
    }
  };

  const guardarFichaCompleta = async () => {
    try {
      await guardarFichaCompletaAPI(paciente, opticalData);
      Swal.fire({
        icon: "success",
        title: "Ficha guardada",
        text: "La ficha médica se guardó correctamente.",
        confirmButtonColor: "#712b39",
      });
      // Si quieres limpiar los datos después de guardar:
      setPaciente({});
      setOpticalData({});
      setApellidoBusqueda("");
      setHistorialFichas([]);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "No se pudo guardar la ficha.",
        confirmButtonColor: "#712b39",
      });
    }
  };

  return {
    paciente,
    setPaciente,
    opticalData,
    setOpticalData,
    historialFichas,
    apellidoBusqueda,
    setApellidoBusqueda,
    handlePacienteChange,
    handleOpticalDataChange,
    buscarPacientePorCI,
    buscarPorApellido,
    guardarFichaCompleta,
  };
}
