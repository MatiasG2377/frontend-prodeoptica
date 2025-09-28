"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const { isAuthenticated } = useAuth({ redirectToLogin: false });
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted && !isAuthenticated) {
      router.push("/login");
    }
  }, [hasMounted, isAuthenticated, router]); // <-- agrega router aquí

  if (!hasMounted || !isAuthenticated) return null;

  return <>{children}</>;
}
