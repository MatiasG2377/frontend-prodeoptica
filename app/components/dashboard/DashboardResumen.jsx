"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  TrendingUp,
  Users,
  Stethoscope,
  AlertTriangle,
  ShoppingBag,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Layers,
  ArrowDownLeft,
  Calendar,
  RefreshCw,
  Eye,
  CheckCircle2,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Doughnut, Bar } from "react-chartjs-2";

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function DashboardResumen({ onGoToPOS }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [ventas, setVentas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [fichas, setFichas] = useState([]);
  const [cierreCaja, setCierreCaja] = useState(null);
  const [periodo, setPeriodo] = useState("mes"); // "semana", "mes"

  const cargarDatosDashboard = async () => {
    setLoading(true);
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    try {
      const [resVentas, resProd, resPac, resFichas, resCierre] = await Promise.allSettled([
        fetch(`${BASE_URL}/ventas/`, { headers }).then((r) => (r.ok ? r.json() : [])),
        fetch(`${BASE_URL}/productos/`, { headers }).then((r) => (r.ok ? r.json() : [])),
        fetch(`${BASE_URL}/pacientes/`, { headers }).then((r) => (r.ok ? r.json() : [])),
        fetch(`${BASE_URL}/fichas-medicas/`, { headers }).then((r) => (r.ok ? r.json() : [])),
        fetch(`${BASE_URL}/dashboard/cierre-caja-resumen/`, { headers }).then((r) => (r.ok ? r.json() : null)),
      ]);

      if (resVentas.status === "fulfilled" && Array.isArray(resVentas.value)) {
        setVentas(resVentas.value);
      }
      if (resProd.status === "fulfilled" && Array.isArray(resProd.value)) {
        setProductos(resProd.value);
      }
      if (resPac.status === "fulfilled" && Array.isArray(resPac.value)) {
        setPacientes(resPac.value);
      }
      if (resFichas.status === "fulfilled" && Array.isArray(resFichas.value)) {
        setFichas(resFichas.value);
      }
      if (resCierre.status === "fulfilled" && resCierre.value) {
        setCierreCaja(resCierre.value);
      }
    } catch (err) {
      console.error("Error al cargar métricas del dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatosDashboard();
  }, []);

  // Cálculos de KPI
  const metricas = useMemo(() => {
    const totalVentasMonto = ventas.reduce(
      (acc, v) => acc + (parseFloat(v.total_venta || v.total || 0) || 0),
      0
    );

    const stockCritico = productos.filter((p) => {
      const stock = Number(p.cantidad_producto) || 0;
      const min = Number(p.minimo_producto) || 0;
      return p.controla_stock !== false && stock <= min;
    });

    const stockAgotado = productos.filter((p) => {
      const stock = Number(p.cantidad_producto) || 0;
      return p.controla_stock !== false && stock === 0;
    });

    return {
      totalVentasMonto,
      totalVentasCount: ventas.length,
      ticketPromedio: ventas.length > 0 ? totalVentasMonto / ventas.length : 0,
      totalPacientes: pacientes.length,
      totalFichas: fichas.length,
      stockCriticoCount: stockCritico.length,
      stockAgotadoCount: stockAgotado.length,
      stockCriticoList: stockCritico.slice(0, 5),
    };
  }, [ventas, productos, pacientes, fichas]);

  // Datos para el gráfico de línea de ventas diarias / mensuales
  const lineChartData = useMemo(() => {
    const dias = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
    const valores = [0, 0, 0, 0, 0, 0, 0];

    // Distribuir ventas recientes en los días de la semana
    if (ventas.length > 0) {
      ventas.forEach((v) => {
        if (v.fecha_venta) {
          const date = new Date(v.fecha_venta);
          const dayIndex = (date.getDay() + 6) % 7; // Lunes = 0
          valores[dayIndex] += parseFloat(v.total_venta || v.total || 0);
        }
      });
    } else {
      // Valores ilustrativos si es un tenant nuevo
      return {
        labels: dias,
        datasets: [
          {
            label: "Ventas ($)",
            data: [120, 190, 300, 250, 480, 520, 310],
            borderColor: "#712b39",
            backgroundColor: "rgba(113, 43, 57, 0.12)",
            tension: 0.35,
            fill: true,
            pointBackgroundColor: "#712b39",
            pointRadius: 4,
          },
        ],
      };
    }

    return {
      labels: dias,
      datasets: [
        {
          label: "Ventas ($)",
          data: valores.map((v) => Math.round(v * 100) / 100),
          borderColor: "#712b39",
          backgroundColor: "rgba(113, 43, 57, 0.12)",
          tension: 0.35,
          fill: true,
          pointBackgroundColor: "#712b39",
          pointRadius: 4,
        },
      ],
    };
  }, [ventas]);

  // Datos para el gráfico de Doughnut (Métodos de pago)
  const doughnutData = useMemo(() => {
    let efectivo = 0;
    let transferencia = 0;
    let tarjeta = 0;
    let credito = 0;

    if (cierreCaja && cierreCaja.por_metodo) {
      efectivo = cierreCaja.por_metodo["Efectivo"] || 0;
      transferencia = cierreCaja.por_metodo["Transferencia"] || 0;
      tarjeta = cierreCaja.por_metodo["Tarjeta"] || 0;
      credito = cierreCaja.por_metodo["Crédito"] || 0;
    } else if (ventas.length > 0) {
      ventas.forEach((v) => {
        const metodo = (v.metodo_pago || v.forma_pago || "Efectivo").toLowerCase();
        const total = parseFloat(v.total_venta || v.total || 0);
        if (metodo.includes("trans")) transferencia += total;
        else if (metodo.includes("tarj")) tarjeta += total;
        else if (metodo.includes("cred")) credito += total;
        else efectivo += total;
      });
    } else {
      efectivo = 650;
      transferencia = 320;
      tarjeta = 180;
      credito = 90;
    }

    return {
      labels: ["Efectivo", "Transferencia", "Tarjeta", "Crédito / Abonos"],
      datasets: [
        {
          data: [efectivo, transferencia, tarjeta, credito],
          backgroundColor: ["#712b39", "#0284c7", "#059669", "#d97706"],
          borderWidth: 2,
          borderColor: "#ffffff",
        },
      ],
    };
  }, [cierreCaja, ventas]);

  // Datos para el gráfico de Barras (Stock por Categoría)
  const barChartData = useMemo(() => {
    const catMap = {};
    productos.forEach((p) => {
      const catNombre =
        (typeof p.categoria_producto === "object"
          ? p.categoria_producto?.nombre_categoria
          : p.categoria_nombre) || "General";
      catMap[catNombre] = (catMap[catNombre] || 0) + (Number(p.cantidad_producto) || 1);
    });

    const labels = Object.keys(catMap).slice(0, 6);
    const data = labels.map((l) => catMap[l]);

    if (labels.length === 0) {
      return {
        labels: ["Armazones", "Lunas", "Lentes Contacto", "Gafas de Sol", "Líquidos"],
        datasets: [
          {
            label: "Unidades en Bodega",
            data: [45, 120, 30, 25, 18],
            backgroundColor: "#712b39",
            borderRadius: 6,
          },
        ],
      };
    }

    return {
      labels,
      datasets: [
        {
          label: "Unidades en Bodega",
          data,
          backgroundColor: "#712b39",
          borderRadius: 6,
        },
      ],
    };
  }, [productos]);

  return (
    <div className="space-y-6 p-2 sm:p-4">
      {/* CABECERA RESUMEN Y ACCIONES RÁPIDAS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-xs border border-gray-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#712b39] flex items-center gap-2">
            <span>Panel de Control y Rendimiento</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Resumen en tiempo real de ventas, inventario crítico, consultas y pacientes
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={cargarDatosDashboard}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition active:scale-95"
            title="Actualizar datos"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refrescar</span>
          </button>

          <button
            type="button"
            onClick={onGoToPOS}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#712b39] hover:bg-[#5e242e] rounded-xl shadow-xs transition active:scale-95"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Abrir Punto de Venta</span>
          </button>
        </div>
      </div>

      {/* TARJETAS KPI (4 MÉTRICAS PRINCIPALES) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Ventas Totales */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs hover:border-[#712b39]/40 transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Ventas Totales
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-gray-900">
              ${metricas.totalVentasMonto.toFixed(2)}
            </h3>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <span>{metricas.totalVentasCount} órdenes registradas</span>
              {metricas.ticketPromedio > 0 && (
                <span className="text-gray-400">
                  (prom. ${metricas.ticketPromedio.toFixed(2)})
                </span>
              )}
            </p>
          </div>
        </div>

        {/* KPI 2: Consultas & Fichas Médicas */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs hover:border-[#712b39]/40 transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Fichas Médicas
            </span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#712b39] flex items-center justify-center font-bold">
              <Stethoscope className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-gray-900">
              {metricas.totalFichas}
            </h3>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <span>Exámenes visuales realizados</span>
            </p>
          </div>
        </div>

        {/* KPI 3: Pacientes Registrados */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs hover:border-[#712b39]/40 transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Pacientes Activos
            </span>
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-gray-900">
              {metricas.totalPacientes}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Base de expedientes clínicos
            </p>
          </div>
        </div>

        {/* KPI 4: Alertas de Stock Bajo */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs hover:border-[#712b39]/40 transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Alerta de Stock
            </span>
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                metricas.stockCriticoCount > 0
                  ? "bg-amber-50 text-amber-700"
                  : "bg-emerald-50 text-emerald-700"
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-gray-900">
              {metricas.stockCriticoCount}
            </h3>
            <p className="text-xs text-amber-700 font-semibold mt-1">
              {metricas.stockAgotadoCount > 0
                ? `${metricas.stockAgotadoCount} agotados por reponer`
                : "Productos en o bajo stock mínimo"}
            </p>
          </div>
        </div>
      </div>

      {/* GRÁFICOS: LÍNEA DE VENTAS & DOUGHNUT DE MÉTODOS DE PAGO */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico 1: Tendencia de Ventas (2 columnas en desktop) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-gray-800">
                Tendencia Semanal de Facturación
              </h3>
              <p className="text-xs text-gray-500">
                Ingresos acumulados por día de la semana
              </p>
            </div>
            <span className="text-xs font-bold text-[#712b39] bg-red-50 border border-red-200 px-2.5 py-1 rounded-full">
              Últimos 7 días
            </span>
          </div>
          <div className="h-64">
            <Line
              data={lineChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    callbacks: {
                      label: (ctx) => ` Ingresos: $${ctx.parsed.y.toFixed(2)}`,
                    },
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: (val) => `$${val}`,
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Gráfico 2: Métodos de Pago */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-base font-bold text-gray-800">
              Métodos de Cobro
            </h3>
            <p className="text-xs text-gray-500">
              Distribución de ingresos por canal
            </p>
          </div>
          <div className="h-56 flex items-center justify-center">
            <Doughnut
              data={doughnutData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "bottom",
                    labels: { boxWidth: 12, font: { size: 11 } },
                  },
                  tooltip: {
                    callbacks: {
                      label: (ctx) => ` $${ctx.raw.toFixed(2)}`,
                    },
                  },
                },
                cutout: "68%",
              }}
            />
          </div>
        </div>
      </div>

      {/* SECCIÓN INFERIOR: ACCESOS RÁPIDOS Y PRODUCTOS CON ALERTA DE STOCK */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico 3: Stock por Categoría */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <div className="mb-4">
            <h3 className="text-base font-bold text-gray-800">
              Inventario por Categoría
            </h3>
            <p className="text-xs text-gray-500">
              Unidades físicas disponibles en bodega
            </p>
          </div>
          <div className="h-56">
            <Bar
              data={barChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  y: { beginAtZero: true },
                },
              }}
            />
          </div>
        </div>

        {/* Lista de Productos con Stock Crítico */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-gray-800 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Atención: Stock Bajo</span>
              </h3>
              <button
                type="button"
                onClick={() => router.push("/inventario")}
                className="text-xs text-[#712b39] hover:underline font-bold"
              >
                Ver todo
              </button>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              Artículos que han alcanzado su nivel mínimo de reposición:
            </p>

            {metricas.stockCriticoList.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="font-semibold text-gray-700">Inventario al día</p>
                <p>No hay productos en nivel crítico.</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {metricas.stockCriticoList.map((p) => (
                  <li key={p.id} className="py-2 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-gray-800 truncate max-w-[160px]">
                        {p.nombre_producto}
                      </p>
                      <p className="text-[11px] text-gray-400">
                        Mínimo req: {p.minimo_producto || 0}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full font-black text-rose-700 bg-rose-50 border border-rose-200 text-xs">
                      {p.cantidad_producto} uds
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            type="button"
            onClick={() => router.push("/ingresos")}
            className="w-full mt-3 py-2 text-xs font-bold text-[#712b39] bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition"
          >
            + Registrar Entrada al Inventario
          </button>
        </div>

        {/* Accesos Rápidos a Operaciones Principales */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-800 mb-1">
              Accesos Rápidos
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Atajos a los flujos diarios más utilizados:
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={onGoToPOS}
                className="p-3 bg-gray-50 hover:bg-red-50/50 border border-gray-200 hover:border-[#712b39] rounded-xl text-left transition group active:scale-95"
              >
                <ShoppingBag className="w-5 h-5 text-[#712b39] mb-1.5" />
                <p className="text-xs font-bold text-gray-800 group-hover:text-[#712b39]">
                  Punto de Venta
                </p>
                <p className="text-[10px] text-gray-400">Catálogo y carrito</p>
              </button>

              <button
                type="button"
                onClick={() => router.push("/ficha-medica")}
                className="p-3 bg-gray-50 hover:bg-red-50/50 border border-gray-200 hover:border-[#712b39] rounded-xl text-left transition group active:scale-95"
              >
                <Stethoscope className="w-5 h-5 text-[#712b39] mb-1.5" />
                <p className="text-xs font-bold text-gray-800 group-hover:text-[#712b39]">
                  Nueva Consulta
                </p>
                <p className="text-[10px] text-gray-400">Ficha y refracción</p>
              </button>

              <button
                type="button"
                onClick={() => router.push("/inventario")}
                className="p-3 bg-gray-50 hover:bg-red-50/50 border border-gray-200 hover:border-[#712b39] rounded-xl text-left transition group active:scale-95"
              >
                <Package className="w-5 h-5 text-[#712b39] mb-1.5" />
                <p className="text-xs font-bold text-gray-800 group-hover:text-[#712b39]">
                  Productos
                </p>
                <p className="text-[10px] text-gray-400">Precios y stock</p>
              </button>

              <button
                type="button"
                onClick={() => router.push("/kardex")}
                className="p-3 bg-gray-50 hover:bg-red-50/50 border border-gray-200 hover:border-[#712b39] rounded-xl text-left transition group active:scale-95"
              >
                <Layers className="w-5 h-5 text-[#712b39] mb-1.5" />
                <p className="text-xs font-bold text-gray-800 group-hover:text-[#712b39]">
                  Kardex
                </p>
                <p className="text-[10px] text-gray-400">Auditoría contable</p>
              </button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>¿Auditoría de caja?</span>
            <button
              type="button"
              onClick={() => router.push("/abonos")}
              className="text-[#712b39] font-bold hover:underline"
            >
              Ir a Cierre de Caja →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

