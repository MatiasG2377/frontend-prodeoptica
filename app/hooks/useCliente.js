"use client";
import { useState } from "react";
import Swal from "sweetalert2";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Hook que maneja el estado y la lógica para registrar o actualizar clientes.
 *
 * Este hook proporciona las siguientes funcionalidades:
 *
 * - `clienteData`: Un objeto que contiene la información del cliente, incluyendo
 *   `ci_cliente`, `nombre_cliente`, `telefono_cliente`, `correo_cliente`,
 *   `direccion_cliente`, e `informacion_cliente`.
 * - `setClienteData`: Función para actualizar la información del cliente.
 * - `clienteExistente`: Un booleano que indica si el cliente ya existe en la base de datos.
 * - `isSubmitting`: Un booleano que indica si el formulario de cliente está en proceso de envío.
 * - `handleInputChange`: Función para manejar los cambios en los campos del formulario y
 *   buscar automáticamente al cliente por cédula/ID si se ha introducido un valor válido.
 * - `handleSubmit`: Función asíncrona para validar el formulario y enviar los datos del cliente
 *   al servidor, registrándolo o actualizándolo.
 *
 * Este hook se utiliza principalmente en formularios de clientes para manejar la lógica de
 * búsqueda, validación y envío de datos del cliente.
 *
 *? @returns {Object} Un objeto con las propiedades y funciones para manejar el estado del cliente.
 */

export default function useCliente() {
  const [clienteData, setClienteData] = useState({
    ci_cliente: "",
    nombre_cliente: "",
    telefono_cliente: "",
    correo_cliente: "",
    direccion_cliente: "",
    informacion_cliente: "",
  });

  const [clienteExistente, setClienteExistente] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Función para manejar los cambios en los campos del formulario y
   * buscar automáticamente al cliente por cédula/ID si se ha
   * introducido un valor válido.
   *
   * Si el campo que se ha cambiado es "ci_cliente" y tiene al menos 10
   * caracteres, se hace una petición GET a la API para buscar el
   * cliente por cédula. Si el cliente existe, se actualiza el estado
   * con sus datos y se muestra un mensaje de confirmación. Si no
   * existe, se muestra un mensaje de error.
   *
   *? @param {React.ChangeEvent<HTMLInputElement>} e - El evento de
   *?   cambio del campo.
   */
  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    const nuevoData = { ...clienteData, [name]: value };
    setClienteData(nuevoData);

    if (name === "ci_cliente" && value.length >= 9) {
      try {
        const res = await fetch(`${BASE_URL}/clientes/ci/?ci=${value}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          const resultado = await res.json();
          const cliente = Array.isArray(resultado)
            ? resultado.find(
                (c) => c.ci_cliente.toString() === value.toString()
              )
            : resultado;

          if (cliente && cliente.ci_cliente === value) {
            setClienteData({
              ...cliente,
              informacion_cliente: cliente.informacion_cliente || "",
            });
            setClienteExistente(true);
            Swal.fire({
              icon: "info",
              title: "Cliente encontrado",
              text: "Los datos han sido cargados para edición.",
              confirmButtonColor: "#712b39",
            });
            return;
          }
        }
        setClienteExistente(false);
      } catch (error) {
        console.error("Error al buscar cliente:", error);
      }
    }
  };

  /**
   * Función asíncrona que maneja el envío del formulario para registrar o actualizar un cliente.
   *
   * Esta función valida que todos los campos requeridos del formulario estén llenos antes de enviar
   * los datos al servidor. Si el cliente ya existe, se actualiza mediante una petición PUT; de lo
   * contrario, se registra un nuevo cliente mediante una petición POST.
   *
   * La función muestra mensajes de éxito o error utilizando SweetAlert2 dependiendo del resultado
   * de la operación en el servidor. También maneja el estado de envío del formulario para deshabilitar
   * el botón de envío mientras la operación está en curso.
   *
   * Si la operación es exitosa, se restablecen los datos del formulario y el estado del cliente existente.
   * En caso de error, se muestra un mensaje de error en la consola y una alerta al usuario.
   *
   *? @returns {Promise<void>} Nada.
   */

  const handleSubmit = async () => {
    const {
      ci_cliente,
      nombre_cliente,
      telefono_cliente,
      correo_cliente,
      direccion_cliente,
    } = clienteData;

    if (
      !ci_cliente ||
      !nombre_cliente ||
      !telefono_cliente ||
      !correo_cliente ||
      !direccion_cliente
    ) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Todos los campos requeridos deben estar llenos.",
        confirmButtonColor: "#712b39",
      });

      return;
    }

    setIsSubmitting(true);

    try {
      const url = clienteExistente
        ? `${BASE_URL}/clientes/${clienteData.id}/`
        : `${BASE_URL}/clientes/`;
      const method = clienteExistente ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clienteData),
      });

      if (!res.ok)
        throw new Error("Error al registrar o actualizar el cliente");

      Swal.fire({
        icon: "success",
        title: clienteExistente ? "Cliente actualizado" : "Cliente registrado",
        text: "Los datos fueron guardados exitosamente.",
        confirmButtonColor: "#712b39",
      });

      setClienteData({
        ci_cliente: "",
        nombre_cliente: "",
        telefono_cliente: "",
        correo_cliente: "",
        direccion_cliente: "",
        informacion_cliente: "",
      });
      setClienteExistente(false);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo guardar el cliente.",
        confirmButtonColor: "#712b39",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    clienteData,
    setClienteData,
    clienteExistente,
    isSubmitting,
    handleInputChange,
    handleSubmit,
  };
}
