/**
 * Formulario de inicio de sesión optimizado.
 *
 * Props:
 * - username: el valor actual del campo de usuario.
 * - password: el valor actual del campo de contraseña.
 * - setUsername: función para cambiar el valor de username.
 * - setPassword: función para cambiar el valor de password.
 * - handleSubmit: función para manejar el envío del formulario.
 * - isSubmitting: booleano que indica si la petición está en curso.
 */
import { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export default function LoginForm({
  username,
  password,
  setUsername,
  setPassword,
  handleSubmit,
  isSubmitting = false,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="usuario"
          className="block text-sm font-semibold text-[#712b39]"
        >
          Usuario
        </label>
        <input
          id="usuario"
          type="text"
          autoComplete="username"
          placeholder="Ingresa tu usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full mt-1 px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#712b39] focus:border-transparent transition"
        />
      </div>

      <div>
        <label
          htmlFor="contraseña"
          className="block text-sm font-semibold text-[#712b39]"
        >
          Contraseña
        </label>
        <div className="relative">
          <input
            id="contraseña"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Ingresa tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full mt-1 px-4 py-2.5 pr-10 border border-gray-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#712b39] focus:border-transparent transition"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-800 transition"
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !username.trim() || !password}
        className="w-full py-2.5 px-4 rounded-lg text-white font-bold bg-[#712b39] hover:bg-[#5e242e] active:scale-98 transition shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Iniciando sesión...</span>
          </>
        ) : (
          <span>Iniciar sesión</span>
        )}
      </button>
    </form>
  );
}
