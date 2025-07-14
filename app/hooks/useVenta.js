// useVenta.js (versión final con fix de ID y autenticación)
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import {
  isValidCI,
  isValidEmail,
  isValidPhone,
  calculateCartTotal,
} from "../utils/ventaHelpers";

export default function useVenta() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [ciCargado, setCiCargado] = useState(null);
  const [laboratorioVenta, setLaboratorioVenta] = useState("");
  const [clienteData, setClienteData] = useState({
    ci_cliente: "",
    nombre_cliente: "",
    informacion_cliente: "",
    correo_cliente: "",
    telefono_cliente: "",
    direccion_cliente: "",
    apellidos_paciente: "",
    fecha_nacimiento: "",
    ocupacion_paciente: "",
    antecedentes_paciente: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [metodoVenta, setMetodoVenta] = useState("Efectivo");
  const [progreso, setProgreso] = useState(1);

  const usuarioVenta = 1;
  const sucursalVenta = 1;

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) router.push("/login");
    const storedCart = localStorage.getItem("cart");
    if (storedCart) setCart(JSON.parse(storedCart));
  }, [router]);

  useEffect(() => {
    if (
      clienteData.ci_cliente &&
      clienteData.nombre_cliente &&
      clienteData.telefono_cliente &&
      clienteData.correo_cliente &&
      clienteData.direccion_cliente
    ) {
      setProgreso(2);
    }
  }, [clienteData]);

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setClienteData((prev) => ({ ...prev, [name]: value }));

    if (name === "ci_cliente" && value.length >= 10 && value !== ciCargado) {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/cliente-paciente/buscar/?ci=${value}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (res.ok) {
          const resultado = await res.json();
          const cliente = resultado.cliente;
          const paciente = resultado.paciente;

          if (!cliente || !cliente.id) {
            console.error("Cliente no tiene ID:", cliente);
            Swal.fire("Error", "No se pudo obtener el cliente actualizado.", "error");
            return;
          }

          if (cliente || paciente) {
            const clienteSafe = {
              nombre_cliente: cliente?.nombre_cliente ?? "",
              ci_cliente: cliente?.ci_cliente ?? "",
              correo_cliente: cliente?.correo_cliente ?? "",
              telefono_cliente: cliente?.telefono_cliente ?? "",
              direccion_cliente: cliente?.direccion_cliente ?? "",
              informacion_cliente: cliente?.informacion_cliente ?? "",
            };

            const pacienteSafe = {
              apellidos_paciente: paciente?.apellidos_paciente ?? "",
              fecha_nacimiento: paciente?.fecha_nacimiento ?? "",
              ocupacion_paciente: paciente?.ocupacion_paciente ?? "",
              antecedentes_paciente: paciente?.antecedentes_paciente ?? "",
            };

            setClienteData((prev) => ({ ...prev, ...clienteSafe, ...pacienteSafe }));
            setCiCargado(value);
            Swal.fire({
              icon: "info",
              title: "Datos encontrados",
              text: "Se cargaron los datos del cliente y/o paciente.",
              confirmButtonColor: "#712b39",
            });
          }
        }
      } catch (err) {
        console.error("Error al buscar cliente/paciente", err);
      }
    }
  };

  const registrarClienteYPaciente = async (data) => {
    const token = localStorage.getItem("access_token");
    const payload = {
      ci: data.ci_cliente,
      nombre_cliente: data.nombre_cliente,
      correo_cliente: data.correo_cliente,
      telefono_cliente: data.telefono_cliente,
      direccion_cliente: data.direccion_cliente,
      informacion_cliente: data.informacion_cliente || "",
      nombres_paciente: data.nombre_cliente,
      apellidos_paciente: data.apellidos_paciente,
      fecha_nacimiento: data.fecha_nacimiento,
      ocupacion_paciente: data.ocupacion_paciente,
      direccion_paciente: data.direccion_cliente,
      telefono_paciente: data.telefono_cliente,
      antecedentes_paciente: data.antecedentes_paciente,
    };

    const buscarRes = await fetch(
      `http://127.0.0.1:8000/api/cliente-paciente/buscar/?ci=${data.ci_cliente}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const resultado = await buscarRes.json();
    const cliente = resultado.cliente;
    const paciente = resultado.paciente;

    if (cliente && paciente) {
      await fetch(`http://127.0.0.1:8000/api/clientes/${cliente.id}/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      await fetch(`http://127.0.0.1:8000/api/pacientes/${paciente.id}/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("http://127.0.0.1:8000/api/cliente-paciente/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    }
  };

  const registrarVenta = async (clienteId, total) => {
    const res = await fetch("http://127.0.0.1:8000/api/ventas/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cliente_venta: clienteId,
        usuario_venta: usuarioVenta,
        sucursal_venta: sucursalVenta,
        total_venta: total,
        estado_venta: "F",
        metodo_venta: metodoVenta,
        laboratorio_venta: laboratorioVenta ? parseInt(laboratorioVenta) : null,
      }),
    });
    return await res.json();
  };

  const procesarProducto = async (ventaId, producto) => {
    const cantidad = producto.cantidad || 1;
    const resProd = await fetch(`http://127.0.0.1:8000/api/productos/${producto.id}/`);
    const productoActualizado = await resProd.json();
    const nuevoStock = productoActualizado.cantidad_producto - cantidad;

    await fetch("http://127.0.0.1:8000/api/articulos-venta/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        venta_articuloVenta: ventaId,
        producto_articuloVenta: producto.id,
        cantidad_articuloVenta: cantidad,
        pvp_articuloVenta: producto.pvp_producto,
        descuento_articuloVenta: 0,
      }),
    });

    await fetch(`http://127.0.0.1:8000/api/productos/${producto.id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cantidad_producto: nuevoStock }),
    });
  };

  const handleSubmit = async ({ abonoInicial = false, montoAbono = "", metodoAbono = "Efectivo" } = {}) => {
    if (
      !isValidCI(clienteData.ci_cliente) ||
      !clienteData.nombre_cliente ||
      !isValidPhone(clienteData.telefono_cliente) ||
      !isValidEmail(clienteData.correo_cliente) ||
      !clienteData.direccion_cliente
    ) {
      Swal.fire("Error", "Complete todos los campos correctamente.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      await registrarClienteYPaciente(clienteData);

      const res = await fetch(`http://127.0.0.1:8000/api/cliente-paciente/buscar/?ci=${clienteData.ci_cliente}`);
      const resultado = await res.json();
      const cliente = resultado.cliente;
      if (!cliente || !cliente.id) throw new Error("Cliente inválido o sin ID");

      const total = calculateCartTotal(cart);
      const venta = await registrarVenta(cliente.id, total);

      await Promise.all(cart.map((producto) => procesarProducto(venta.id, producto)));

      if (abonoInicial && parseFloat(montoAbono) > 0) {
        await fetch("http://127.0.0.1:8000/api/abonos/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify({
            venta: venta.id,
            cliente: cliente.id,
            monto: parseFloat(montoAbono),
            metodo_pago: metodoAbono,
          }),
        });
      }

      Swal.fire({
        title: "Éxito",
        text: "La venta se ha registrado correctamente.",
        icon: "success",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#712b39",
      }).then(() => router.push("/dashboard"));

      setCart([]);
      setClienteData({
        ci_cliente: "",
        nombre_cliente: "",
        telefono_cliente: "",
        correo_cliente: "",
        direccion_cliente: "",
        informacion_cliente: "",
        apellidos_paciente: "",
        fecha_nacimiento: "",
        ocupacion_paciente: "",
        antecedentes_paciente: "",
      });
      setProgreso(3);
    } catch (error) {
      console.error(error);
      Swal.fire({ icon: "error", title: "Error", text: "Ocurrió un error al registrar la venta." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    Swal.fire({
      title: "¿Cancelar?",
      text: "¿Seguro que deseas cancelar la operación?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#712b39",
      cancelButtonColor: "#D1D5DB",
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "No, regresar",
    }).then((result) => {
      if (result.isConfirmed) router.push("/dashboard");
    });
  };

  return {
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
  };
}
