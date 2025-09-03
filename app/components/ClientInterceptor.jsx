// app/components/ClientInterceptor.jsx
"use client";

import { useEffect } from "react";
import { interceptarFetchConLogout } from "../utils/interceptFetch";

export default function ClientInterceptor() {
  useEffect(() => {
    // Asegurarse de que solo se ejecute en el navegador
    if (typeof window !== 'undefined') {
      // Verificar si el interceptor ya está configurado
      if (!window.__fetchInterceptorInitialized) {
        interceptarFetchConLogout();
        window.__fetchInterceptorInitialized = true;
      }
    }
  }, []);

  return null;
}
