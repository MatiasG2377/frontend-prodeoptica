// hooks/useVenta.js
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import {
  isValidCI,
  isValidEmail,
  isValidPhone,
  calculateCartTotal,
} from "../utils/ventaHelpers";
import {
  buscarClienteYPaciente,
  crearClientePaciente,
  actualizarCliente,
  actualizarPaciente,
  crearVenta,
  crearArticuloVenta,
  actualizarStockProducto,
  registrarMovimientoKardex,
  registrarAbono,
} from "../services/ventaService";

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
        const resultado = await buscarClienteYPaciente(value);
        const cliente = resultado.cliente;
        const paciente = resultado.paciente;

        if (cliente || paciente) {
          setClienteData((prev) => ({
            ...prev,
            ...cliente,
            ...paciente,
          }));
          setCiCargado(value);
          Swal.fire({
            icon: "info",
            title: "Datos encontrados",
            text: "Se cargaron los datos del cliente y/o paciente.",
            confirmButtonColor: "#712b39",
          });
        }
      } catch (err) {
        console.error("Error al buscar cliente/paciente", err);
      }
    }
  };

  const registrarClienteYPaciente = async (data) => {
    const resultado = await buscarClienteYPaciente(data.ci_cliente);
    const cliente = resultado.cliente;
    const paciente = resultado.paciente;

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

    if (cliente && paciente) {
      await actualizarCliente(cliente.id, payload);
      await actualizarPaciente(paciente.id, payload);
    } else {
      await crearClientePaciente(payload);
    }
  };

  const handleSubmit = async ({
    abonoInicial = false,
    montoAbono = "",
    metodoAbono = "Efectivo",
  } = {}) => {
    if (
      !clienteData.nombre_cliente ||
      !isValidPhone(clienteData.telefono_cliente) ||
      !isValidEmail(clienteData.correo_cliente) ||
      !clienteData.direccion_cliente
    ) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Complete todos los campos correctamente.",
        confirmButtonColor: "#712b39",
        cancelButtonColor: "#d1d5db",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await registrarClienteYPaciente(clienteData);

      const resultado = await buscarClienteYPaciente(clienteData.ci_cliente);
      const cliente = resultado.cliente;
      if (!cliente || !cliente.id) throw new Error("Cliente inválido o sin ID");

      const total = calculateCartTotal(cart);
      const venta = await crearVenta({
        cliente_venta: cliente.id,
        usuario_venta: usuarioVenta,
        sucursal_venta: sucursalVenta,
        total_venta: total,
        estado_venta: "F",
        metodo_venta: metodoVenta,
        laboratorio_venta: laboratorioVenta ? parseInt(laboratorioVenta) : null,
      });

      await Promise.all(
        cart.map(async (producto) => {
          const cantidad = producto.cantidad || 1;

          await crearArticuloVenta({
            venta_articuloVenta: venta.id,
            producto_articuloVenta: producto.id,
            cantidad_articuloVenta: cantidad,
            pvp_articuloVenta: producto.pvp_producto,
            descuento_articuloVenta: 0,
          });

          const controlaStock =
            producto.controla_stock === true ||
            producto.controla_stock === 1 ||
            producto.controla_stock === "true";

          if (
            controlaStock &&
            producto.cantidad_producto !== undefined &&
            producto.cantidad_producto !== null
          ) {
            const cantidadProducto = parseInt(producto.cantidad_producto);
            const nuevoStock = isNaN(cantidadProducto)
              ? 0
              : cantidadProducto - cantidad;

            const costoUnitario = parseFloat(producto.costo_producto);
            const costoValido = isNaN(costoUnitario) ? 0 : costoUnitario;

            if (costoValido > 0 && nuevoStock >= 0) {
              await actualizarStockProducto(producto.id, {
                cantidad_producto: nuevoStock,
              });

              await registrarMovimientoKardex({
                producto_kardex: producto.id,
                tipo_kardex: "Salida",
                cantidad_kardex: cantidad,
                costo_unitario_kardex: costoValido,
                costo_total_kardex: costoValido * cantidad,
                saldo_cantidad_kardex: nuevoStock,
                saldo_costo_kardex: costoValido * nuevoStock,
                referencia_kardex: `Venta #${venta.id}`,
              });
            } else {
              console.warn(
                `❌ Producto ${producto.nombre_producto} no válido para Kardex: costo=${costoValido}, stock=${nuevoStock}`
              );
            }
          } else {
            console.log(
              `🔁 Producto ${producto.nombre_producto} no registra Kardex (controla_stock = ${producto.controla_stock})`
            );
          }
        })
      );

      if (abonoInicial && parseFloat(montoAbono) > 0) {
        await registrarAbono({
          venta: venta.id,
          cliente: cliente.id,
          monto: parseFloat(montoAbono),
          metodo_pago: metodoAbono,
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
      localStorage.removeItem("cart");
      setClienteData({
        id: null,
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
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al registrar la venta.",
      });
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
