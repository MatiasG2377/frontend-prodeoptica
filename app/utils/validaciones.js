// helpers/validaciones.js
export function validarCamposRegistro({
  username,
  email,
  password,
  nombre,
  apellido,
  telefono,
  sucursal,
}) {
  if (!username || !email || !password || !nombre || !apellido || !sucursal) {
    return "Completa todos los campos obligatorios.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Ingresa un correo electrónico válido.";
  }
  if (password.length < 6) {
    return "La contraseña debe tener al menos 6 caracteres.";
  }
  if (telefono && telefono.trim().length < 7) {
    return "El teléfono debe tener al menos 7 caracteres.";
  }
  return null;
}
