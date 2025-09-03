/**
 * Formulario de inicio de sesión.
 *
 * Recibe como props las siguientes funciones y variables:
 * - username: el valor actual del campo de usuario.
 * - password: el valor actual del campo de contraseña.
 * - setUsername: función para cambiar el valor de username.
 * - setPassword: función para cambiar el valor de password.
 * - handleSubmit: función para manejar el envío del formulario.
 *
 * Devuelve un formulario con los campos de usuario y contraseña, y un botón para
 * iniciar sesión.
 */
import { useState } from 'react';

export default function LoginForm({
  username,
  password,
  setUsername,
  setPassword,
  handleSubmit,
}) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="usuario"
          className="block text-sm font-medium text-[#712b39]"
        >
          Usuario
        </label>
        <input
          id="usuario"
          type="text"
          placeholder="Ingresa tu usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>
      <div>
        <label
          htmlFor="contraseña"
          className="block text-sm font-medium text-[#712b39]"
        >
          Contraseña
        </label>
        <div className="relative">
          <input
            id="contraseña"
            type={showPassword ? "text" : "password"}
            placeholder="Ingresa tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 px-4 py-2 pr-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-800"
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
      </div>
      <button
        type="submit"
        className="w-full py-2 px-4 rounded-lg text-white transition"
        style={{ backgroundColor: "#712b39" }}
      >
        Iniciar sesión
      </button>
    </form>
  );
}
