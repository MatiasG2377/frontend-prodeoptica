// Fuente unica para parsear respuestas de fetch y mostrar errores legibles.

const ETIQUETAS_CAMPO = {
  nombre_producto: "Nombre",
  pvp_producto: "Precio de venta (PVP)",
  costo_producto: "Costo",
  cantidad_producto: "Cantidad",
  minimo_producto: "Stock mínimo",
  maximo_producto: "Stock máximo",
  categoria_producto: "Categoría",
  proveedor_producto: "Proveedor",
  marca_producto: "Marca",
  descripcion_producto: "Descripción",
  codigo_producto: "Código",
  username: "Usuario",
  email: "Correo electrónico",
  password: "Contraseña",
  ci_cliente: "Cédula",
  nombre_cliente: "Nombre del cliente",
  telefono_cliente: "Teléfono",
  correo_cliente: "Correo",
  direccion_cliente: "Dirección",
  sucursal_usuario: "Sucursal",
  username_usuario: "Usuario",
  email_usuario: "Correo electrónico",
};

const MENSAJE_POR_STATUS = {
  400: "Los datos enviados no son válidos.",
  401: "Tu sesión expiró o no iniciaste sesión.",
  403: "No tenés permiso para hacer esto.",
  404: "No se encontró lo que buscabas.",
};

function mensajeGenericoPorStatus(status) {
  if (MENSAJE_POR_STATUS[status]) return MENSAJE_POR_STATUS[status];
  if (status >= 500) return "Error del servidor, intenta de nuevo en un momento.";
  return "Ocurrió un error inesperado.";
}

function formatearCamposDRF(body) {
  const camposConArray = Object.entries(body).filter(([, v]) => Array.isArray(v));
  if (camposConArray.length === 0) return null;
  const fields = Object.fromEntries(camposConArray);
  const detail = camposConArray
    .map(([campo, mensajes]) => `${ETIQUETAS_CAMPO[campo] || campo}: ${mensajes.join(" ")}`)
    .join("\n");
  return { fields, detail };
}

/**
 * Parsea una Response de fetch. Si es exitosa, devuelve el JSON tal cual.
 * Si no, lanza siempre el mismo shape normalizado: { status, detail, fields }.
 * Nunca deja escapar HTML crudo ni un SyntaxError de parseo.
 */
export async function parseApiResponse(res) {
  if (res.ok) {
    return await res.json().catch(() => null);
  }

  let body = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }

  let detail = null;
  let fields = null;

  if (body && typeof body === "object") {
    if (typeof body.detail === "string") {
      detail = body.detail;
    } else {
      const formateado = formatearCamposDRF(body);
      if (formateado) {
        detail = formateado.detail;
        fields = formateado.fields;
      }
    }
  }

  if (!detail) {
    detail = mensajeGenericoPorStatus(res.status);
  }

  throw { status: res.status, detail, fields };
}

/**
 * Convierte cualquier error capturado (normalizado o legado) en un string
 * legible para mostrar al usuario. Nunca devuelve HTML, "[object Object]",
 * "{}" ni el mensaje crudo de un SyntaxError de parseo.
 */
export function getErrorMessage(error) {
  if (!error) return "Ocurrió un error inesperado. Intenta de nuevo.";

  if (typeof error === "object" && typeof error.detail === "string") {
    return error.detail;
  }

  if (typeof error?.response?.data?.detail === "string") {
    return error.response.data.detail;
  }

  if (typeof error === "object" && !(error instanceof Error)) {
    const formateado = formatearCamposDRF(error);
    if (formateado) return formateado.detail;
  }

  if (error instanceof TypeError) {
    return "No se pudo conectar con el servidor. Revisa tu conexión e intenta de nuevo.";
  }

  if (error instanceof SyntaxError) {
    return "Ocurrió un error inesperado. Intenta de nuevo.";
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Ocurrió un error inesperado. Intenta de nuevo.";
}
