// /services/fichaMedicaService.js

export async function buscarPacientePorCIAPI(ci) {
  const res = await fetch(`/api/pacientes/?ci=${ci}`);
  if (!res.ok) throw new Error("Paciente no encontrado");
  const data = await res.json();
  return {
    pacienteData: data.paciente,
    historial: data.historial, // debe venir desde tu backend así
  };
}

export async function buscarPacientePorApellidoAPI(apellido) {
  const res = await fetch(`/api/pacientes/?apellido=${apellido}`);
  if (!res.ok) throw new Error("No encontrado");
  return await res.json();
}

export async function guardarFichaCompletaAPI(paciente, ficha) {
  const res = await fetch("/api/fichas-medicas/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ paciente, ficha }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Error al guardar ficha");
  }
}
