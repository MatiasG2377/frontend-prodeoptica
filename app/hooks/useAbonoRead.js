// components/abonos/useAbonos.js
import { useState } from "react";

export function useAbonos(API_URL) {
  const [abonos, setAbonos] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAbonos = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/abonos/`);
      if (!res.ok) throw new Error("Error al obtener los abonos");
      const data = await res.json();

      const abonosConRestante = data
        .map((abono) => {
          const total = parseFloat(abono.venta?.total_venta || 0);
          const pagado = parseFloat(abono.monto);
          const restante = total - pagado;
          return { ...abono, restante };
        })
        .filter((abono) => abono.restante > 0.0001);

      setAbonos(abonosConRestante);
    } catch (error) {
      console.error("Error cargando abonos:", error);
      alert("Error al cargar los abonos.");
    } finally {
      setLoading(false);
    }
  };

  return { abonos, setAbonos, loading, setLoading, fetchAbonos };
}
