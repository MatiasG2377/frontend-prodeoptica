// app/components/ClientInterceptor.jsx
"use client";

import { useEffect } from "react";
import { interceptarFetchConLogout } from "../utils/interceptFetch";
export default function ClientInterceptor() {
  useEffect(() => {
    interceptarFetchConLogout();
  }, []);

  return null;
}
