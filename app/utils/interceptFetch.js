// app/utils/interceptFetch.js
const isBrowser = typeof window !== 'undefined';

export function interceptarFetchConLogout() {
  if (!isBrowser) return () => {};
  
  const originalFetch = window.fetch;

  window.fetch = async (...args) => {
    if (!window.localStorage) {
      return originalFetch(...args);
    }

    const token = localStorage.getItem("access_token");
    let [resource, config] = args;
    config = config || {};

    // Configurar headers
    const isFormData = typeof FormData !== 'undefined' && config.body instanceof FormData;
    config.headers = {
      ...config.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(!isFormData && !config.headers?.['Content-Type'] && { "Content-Type": "application/json" }),
    };

    try {
      const response = await originalFetch(resource, config);

      // Manejar respuesta no autorizada
      if ((response.status === 401 || response.status === 403) && 
          !window.location.pathname.includes('/login')) {
        
        // Evitar múltiples redirecciones
        if (window.__isRedirectingToLogin) return response;
        window.__isRedirectingToLogin = true;
        
        // Limpiar token
        localStorage.removeItem("access_token");
        
        // Redirigir directamente sin mostrar mensaje
        setTimeout(() => {
          window.location.href = "/login?session_expired=1";
        }, 100);
      }
      
      return response;
      
    } catch (error) {
      console.warn('Advertencia en petición fetch (servidor no disponible o error de red):', error?.message || error);
      throw error;
    }
  };

  // Función para restaurar fetch original
  return () => {
    window.fetch = originalFetch;
  };
}
