// Validaciones para el formulario de registro
export const validarCamposRegistro = (formData) => {
  const { username, email, password, nombre, apellido, telefono, sucursal } = formData;
  const errors = {};

  // Validación de nombre de usuario
  if (!username.trim()) {
    errors.username = 'El nombre de usuario es obligatorio';
  } else if (username.length < 3) {
    errors.username = 'El nombre debe tener al menos 3 caracteres';
  } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.username = 'Solo letras, números y guiones bajos';
  }

  // Validación de correo electrónico
  if (!email.trim()) {
    errors.email = 'El correo electrónico es obligatorio';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Ingresa un correo electrónico válido';
  }

  // Validación de contraseña
  if (!password) {
    errors.password = 'La contraseña es obligatoria';
  } else if (password.length < 8) {
    errors.password = 'La contraseña debe tener al menos 8 caracteres';
  }

  // Validación de nombre (solo letras y espacios)
  if (!nombre.trim()) {
    errors.nombre = 'El nombre es obligatorio';
  } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/.test(nombre)) {
    errors.nombre = 'Solo letras y espacios';
  }

  // Validación de apellido (solo letras y espacios)
  if (!apellido.trim()) {
    errors.apellido = 'El apellido es obligatorio';
  } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/.test(apellido)) {
    errors.apellido = 'Solo letras y espacios';
  }

  // Validación de teléfono (solo números positivos)
  if (telefono && !/^\d+$/.test(telefono)) {
    errors.telefono = 'Solo números positivos';
  }

  // Validación de sucursal
  if (!sucursal) {
    errors.sucursal = 'Debes seleccionar una sucursal';
  }

  return Object.keys(errors).length > 0 ? errors : null;
};

// Sanitización de entradas
export const sanitizeInput = (field, value) => {
  if (!value) return value;
  
  switch (field) {
    case 'username':
      return value.replace(/[^a-zA-Z0-9_]/g, '');
    case 'email':
      return value.trim().toLowerCase();
    case 'nombre':
    case 'apellido':
      // Solo permite letras, espacios y caracteres especiales en español
      return value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/g, '');
    case 'telefono':
      // Solo permite números
      return value.replace(/\D/g, '');
    default:
      return value;
  }
};
