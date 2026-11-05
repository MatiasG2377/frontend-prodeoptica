"use client";
import React from "react";
import { Skeleton } from "./components/common/Skeleton";

/**
 * Fallback global de carga para transiciones de ruta en Next.js App Router.
 * Se muestra automáticamente mediante React Suspense durante la navegación entre segmentos.
 */
export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header Skeleton */}
      <div className="h-14 bg-[#712b39] flex items-center justify-between px-4 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/20" />
          <div className="w-32 h-6 rounded bg-white/20" />
        </div>
        <div className="w-24 h-6 rounded bg-white/20" />
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-4">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
        <div className="mt-8 space-y-3">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

