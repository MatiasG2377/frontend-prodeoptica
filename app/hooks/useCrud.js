import { useEffect, useState } from "react";

export function useCrud(apiUrl) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    if (!apiUrl) return; // 🔐 evita llamadas vacías
    try {
      setLoading(true);
      const res = await fetch(apiUrl);
      const contentType = res.headers.get("content-type");

      if (!res.ok) {
        console.error("Error de red o backend", res.status);
        return;
      }

      if (contentType && contentType.includes("application/json")) {
        const json = await res.json();
        setData(json);
      } else {
        console.error("Respuesta no es JSON. ¿Tal vez HTML?");
      }
    } catch (error) {
      console.error("Error al cargar datos", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [apiUrl]);

  const addItem = async (item) => {
    if (!apiUrl) return;
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    if (res.ok) fetchData();
  };

  const editItem = async (id, item) => {
    if (!apiUrl || !id) return;
    const res = await fetch(`${apiUrl}${id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    if (res.ok) fetchData();
  };

  const deleteItem = async (id) => {
    if (!apiUrl || !id) return;
    const res = await fetch(`${apiUrl}${id}/`, { method: "DELETE" });
    if (res.ok) fetchData();
  };

  return { data, loading, addItem, editItem, deleteItem };
}
