"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { useAuth } from "../hooks/useAuth";
import useVenta from "../hooks/useVenta";

import VentaMenu from "../components/venta/VentaMenu";
import ClienteForm from "../components/venta/ClienteForm";
import CartResumenVenta from "../components/venta/CartResumenVenta";
import AbonoInicialForm from "../components/venta/AbonoForm";

export default function VentaPage() {
  const router = useRouter();
  const { logout, user } = useAuth({ redirectToLogin: false });
  
  // Verificar autenticación en el cliente
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (!token) {
      window.location.href = "/login?session_expired=1";
      return;
    }
  }, []);
  const [menuOpen, setMenuOpen] = useState(false);
  const [discount, setDiscount] = useState(0);
  const {
    cart,
    clienteData,
    handleInputChange,
    handleSubmit,
    handleCancel,
    isSubmitting,
    metodoVenta,
    setMetodoVenta,
    progreso,
    laboratorioVenta,
    setLaboratorioVenta,
    buscarClienteManual,
    ordenLaboratorio,
    setOrdenLaboratorio,
    ordenTrabajo,
    setOrdenTrabajo,
  } = useVenta();

  const [abonoInicial, setAbonoInicial] = useState(false);
  const [montoAbono, setMontoAbono] = useState("");
  const [metodoAbono, setMetodoAbono] = useState("Efectivo");

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.altKey && event.key === "1") {
        event.preventDefault();
        document.querySelector('[name="ci_cliente"]')?.focus();
      } else if (event.ctrlKey && event.altKey && event.key === "Enter") {
        event.preventDefault();
        document.querySelector("#submitButton")?.click();
      } else if (event.ctrlKey && event.altKey && event.key === "2") {
        event.preventDefault();
        handleCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleCancel]);

  useEffect(() => {
    const storedDiscount = localStorage.getItem("discount");
    setDiscount(Number(storedDiscount) || 0);
  }, []);
  const enhancedHandleSubmit = async () => {
    if (cart.length === 0) {
      await Swal.fire({
        icon: "warning",
        title: "Carrito vacío",
        text: "Debe agregar productos al carrito antes de registrar la venta.",
        confirmButtonColor: "#712b39",
      });
      return;
    }

    if (!clienteData.nombre_cliente) {
      await Swal.fire({
        icon: "warning",
        title: "Datos incompletos",
        text: "Debe completar los datos del cliente antes de continuar.",
        confirmButtonColor: "#712b39",
      });
      return;
    }

    const total = cart.reduce(
      (acc, item) => acc + parseFloat(item.pvp_producto) * (item.cantidad || 1),
      0
    );
    const totalConDescuento = total - (Number(discount) || 0);

    // 🚨 VALIDACIÓN DE ABONO INICIAL
    if (abonoInicial && parseFloat(montoAbono || 0) > totalConDescuento) {
      await Swal.fire({
        icon: "error",
        title: "Abono inválido",
        text: `El abono inicial no puede ser mayor al total de la venta (${totalConDescuento.toFixed(
          2
        )}).`,
        confirmButtonColor: "#712b39",
      });
      return; // Detener la ejecución si el abono es mayor
    }

    await handleSubmit({
      abonoInicial,
      montoAbono,
      metodoAbono,
      discount: Number(discount) || 0,
      total: totalConDescuento,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <VentaMenu
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        handleLogout={logout}
        router={router}
      />

      <ClienteForm
        clienteData={clienteData}
        handleInputChange={handleInputChange}
        metodoVenta={metodoVenta}
        setMetodoVenta={setMetodoVenta}
        laboratorioVenta={laboratorioVenta}
        setLaboratorioVenta={setLaboratorioVenta}
        progreso={progreso}
        onBuscarCliente={buscarClienteManual}
        ordenLaboratorio={ordenLaboratorio}
        setOrdenLaboratorio={setOrdenLaboratorio}
        ordenTrabajo={ordenTrabajo}
        setOrdenTrabajo={setOrdenTrabajo}
      />

      <AbonoInicialForm
        abonoInicial={abonoInicial}
        setAbonoInicial={setAbonoInicial}
        montoAbono={montoAbono}
        setMontoAbono={setMontoAbono}
        metodoAbono={metodoAbono}
        setMetodoAbono={setMetodoAbono}
      />

      <br />
      <CartResumenVenta
        cart={cart}
        isSubmitting={isSubmitting}
        discount={discount}
        handleSubmit={() =>
          enhancedHandleSubmit({
            abonoInicial,
            montoAbono,
            metodoAbono,
          })
        }
        handleCancel={handleCancel}
      />
    </div>
  );
}
