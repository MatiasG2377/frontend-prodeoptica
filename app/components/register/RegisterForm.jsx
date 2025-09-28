/**
 * Componente que renderiza un formulario para registrar un nuevo usuario.
 *
 * Este formulario contiene campos para ingresar el nombre de usuario, correo electrónico,
 * contraseña, nombre, apellido, teléfono, rol de usuario y sucursal.
 *
 * Props:
 * - `username`: El nombre de usuario.
 * - `setUsername`: Función para actualizar el nombre de usuario.
 * - `email`: El correo electrónico.
 * - `setEmail`: Función para actualizar el correo electrónico.
 * - `password`: La contraseña.
 * - `setPassword`: Función para actualizar la contraseña.
 * - `nombreUsuario`: El nombre del usuario.
 * - `setNombreUsuario`: Función para actualizar el nombre del usuario.
 * - `apellidoUsuario`: El apellido del usuario.
 * - `setApellidoUsuario`: Función para actualizar el apellido del usuario.
 * - `telefonoUsuario`: El teléfono del usuario.
 * - `setTelefonoUsuario`: Función para actualizar el teléfono del usuario.
 * - `rolUsuario`: El rol del usuario.
 * - `setRolUsuario`: Función para actualizar el rol del usuario.
 * - `sucursalUsuario`: La sucursal asociada al usuario.
 * - `setSucursalUsuario`: Función para actualizar la sucursal del usuario.
 * - `sucursales`: Lista de sucursales disponibles.
 * - `handleSubmit`: Función para manejar el envío del formulario.
 * - `errors`: Errores del formulario.
 * - `isSubmitting`: Estado de envío del formulario.
 * - `onFieldBlur`: Función para manejar el evento blur de un campo.
 * - `validateField`: Función para validar un campo.
 * - `touched`: Estado de los campos tocados.
 *
 * El formulario permite seleccionar el rol de usuario y la sucursal desde un menú desplegable
 * y realiza el registro del usuario al enviarse.
 */

import { useState } from "react";

export default function RegisterForm({
  // Form data
  username,
  setUsername,
  email,
  setEmail,
  password,
  setPassword,
  nombreUsuario,
  setNombreUsuario,
  apellidoUsuario,
  setApellidoUsuario,
  telefonoUsuario,
  setTelefonoUsuario,
  rolUsuario,
  setRolUsuario,
  sucursalUsuario,
  setSucursalUsuario,
  sucursales = [],
  // Form state
  handleSubmit,
  errors = {},
  isSubmitting = false,
  isLoadingSucursales = false,
  onFieldBlur = () => {},
  validateField = () => {},
  touched = {}
}) {
  const [showPassword, setShowPassword] = useState(false);
  
  // Handle field changes with validation
  const handleFieldChange = (field, setter) => (e) => {
    const value = e.target.value;
    setter(value);
    
    // Validate field in real-time if it's been touched
    if (touched[field]) {
      validateField(field, value);
    }
  };
  
  // Show error only if field has been touched and has an error
  const shouldShowError = (field) => {
    return touched[field] && errors[field];
  };
  
  // Handle field blur
  const handleBlur = (field) => (e) => {
    if (onFieldBlur) onFieldBlur(field);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium"
            style={{ color: "#712b39" }}
          >
            Nombre de Usuario
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={handleFieldChange('username', setUsername)}
            onBlur={handleBlur('username')}
            placeholder="Ej: Juan_perez"
            className={`w-full mt-1 px-4 py-2 border ${
              shouldShowError('username') ? 'border-red-500' : 'border-gray-300'
            } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#712b39]`}
            disabled={isSubmitting}
            required
          />
          {shouldShowError('username') && (
            <p className="mt-1 text-sm text-red-600">{errors.username}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium"
            style={{ color: "#712b39" }}
          >
            Correo Electrónico
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={handleFieldChange('email', setEmail)}
            onBlur={handleBlur('email')}
            placeholder="Ej: Juan@ejemplo.com"
            className={`w-full mt-1 px-4 py-2 border ${
              shouldShowError('email') ? 'border-red-500' : 'border-gray-300'
            } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#712b39]`}
            disabled={isSubmitting}
            required
          />
          {shouldShowError('email') && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium"
            style={{ color: "#712b39" }}
          >
            Contraseña
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handleFieldChange('password', setPassword)}
              onBlur={handleBlur('password')}
              placeholder="Ej: MiClaveSegura123!"
              className={`w-full mt-1 px-4 py-2 pr-10 border ${
                shouldShowError('password') ? 'border-red-500' : 'border-gray-300'
              } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#712b39]`}
              disabled={isSubmitting}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-[#712b39]"
              disabled={isSubmitting}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          {shouldShowError('password') && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="nombreUsuario"
            className="block text-sm font-medium"
            style={{ color: "#712b39" }}
          >
            Nombre
          </label>
          <input
            id="nombre"
            type="text"
            value={nombreUsuario}
            onChange={handleFieldChange('nombre', setNombreUsuario)}
            onBlur={handleBlur('nombre')}
            placeholder="Ejemplo: Juan"
            className={`w-full mt-1 px-4 py-2 border ${
              shouldShowError('nombre') ? 'border-red-500' : 'border-gray-300'
            } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#712b39]`}
            disabled={isSubmitting}
          />
          {shouldShowError('nombre') && (
            <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="apellidoUsuario"
            className="block text-sm font-medium"
            style={{ color: "#712b39" }}
          >
            Apellido
          </label>
          <input
            id="apellido"
            type="text"
            value={apellidoUsuario}
            onChange={handleFieldChange('apellido', setApellidoUsuario)}
            onBlur={handleBlur('apellido')}
            placeholder="Ejemplo: Perez"
            className={`w-full mt-1 px-4 py-2 border ${
              shouldShowError('apellido') ? 'border-red-500' : 'border-gray-300'
            } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#712b39]`}
            disabled={isSubmitting}
          />
          {shouldShowError('apellido') && (
            <p className="mt-1 text-sm text-red-600">{errors.apellido}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="telefonoUsuario"
            className="block text-sm font-medium"
            style={{ color: "#712b39" }}
          >
            Teléfono
          </label>
          <input
            id="telefono"
            type="tel"
            value={telefonoUsuario}
            onChange={handleFieldChange('telefono', setTelefonoUsuario)}
            onBlur={handleBlur('telefono')}
            placeholder="Ej: 56912345678"
            className={`w-full mt-1 px-4 py-2 border ${
              shouldShowError('telefono') ? 'border-red-500' : 'border-gray-300'
            } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#712b39]`}
            inputMode="numeric"
            pattern="[0-9]*"
            disabled={isSubmitting}
          />
          {shouldShowError('telefono') && (
            <p className="mt-1 text-sm text-red-600">{errors.telefono}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="rol"
            className="block text-sm font-medium"
            style={{ color: "#712b39" }}
          >
            Rol de Usuario
          </label>
          <input
            type="hidden"
            id="rol"
            value="Usuario"
            onChange={(e) => setRolUsuario("Usuario")}
          />
          <div className="w-full mt-1 px-4 py-2 border border-gray-300 bg-gray-50 rounded-lg shadow-sm text-gray-700">
            Usuario
          </div>
        </div>

        <div>
          <label
            htmlFor="sucursal"
            className="block text-sm font-medium"
            style={{ color: "#712b39" }}
          >
            Sucursal
          </label>
          <input
            type="hidden"
            id="sucursal"
            value="Quito"
            onChange={(e) => setSucursalUsuario("Quito")}
          />
          <div className="w-full mt-1 px-4 py-2 border border-gray-300 bg-gray-50 rounded-lg shadow-sm text-gray-700">
            Quito
          </div>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
            isSubmitting ? 'bg-gray-400' : 'bg-[#712b39] hover:bg-[#5a1f2e]'
          } transition-colors`}
        >
          {isSubmitting ? 'Registrando...' : 'Registrar Usuario'}
        </button>
      </div>
    </form>
  );
}
