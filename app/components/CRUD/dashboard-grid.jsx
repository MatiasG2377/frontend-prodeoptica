"use client"

import { Truck, FlaskConical } from "lucide-react"

const crudOptions = [
  {
    id: "proveedor",
    title: "Proveedores",
    description: "Gestionar información de proveedores",
    icon: Truck,
    color: "bg-blue-500",
  },
  {
    id: "laboratorio",
    title: "Laboratorios",
    description: "Administrar laboratorios ópticos",
    icon: FlaskConical,
    color: "bg-green-500",
  },
]

export function DashboardGrid({ onSelectTable }) {
  return (
    <div className="min-h-screen bg-gray-50">


      {/* Dashboard Grid */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Selecciona una opción para gestionar</h2>
          <p className="text-gray-600">Haz clic en cualquier tarjeta para acceder acceder al panel de administración.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {crudOptions.map((option) => {
            const Icon = option.icon
            return (
              <div
                key={option.id}
                className="bg-white rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-2 hover:border-[#8B4B5C] p-6"
                onClick={() => onSelectTable(option.id)}
              >
                <div className="flex items-start space-x-4">
                  <div className={`${option.color} p-3 rounded-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{option.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{option.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-[#8B4B5C] text-sm font-medium hover:underline">Gestionar →</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
