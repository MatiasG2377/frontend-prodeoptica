"use client"
import { useRouter } from "next/navigation";
import { useState } from "react"
import { Plus, Edit, Trash2, Search, X } from "lucide-react"

export function CrudTable({ tableName, data, columns, onAdd, onEdit, onDelete, onBack }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({})
  const router = useRouter();

  const filteredData = data.filter((item) =>
    Object.values(item).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingItem) {
      onEdit(editingItem.id, formData)
    } else {
      onAdd({ ...formData, id: Date.now().toString() })
    }
    setIsDialogOpen(false)
    setEditingItem(null)
    setFormData({})
  }

  const openDialog = (item) => {
    if (item) {
      setEditingItem(item)
      setFormData(item)
    } else {
      setEditingItem(null)
      setFormData({})
    }
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    setEditingItem(null)
    setFormData({})
  }

  const renderFormField = (column) => {
    const { key, label, type } = column

    if (type === "textarea") {
      return (
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B4B5C] focus:border-transparent resize-none"
          rows="3"
          value={formData[key] || ""}
          onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
          placeholder={`Ingrese ${label.toLowerCase()}`}
        />
      )
    }

    if (type === "select") {
      return (
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B4B5C] focus:border-transparent"
          value={formData[key] || ""}
          onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
        >
          <option value="">Seleccione {label.toLowerCase()}</option>
          <option value="opcion1">Opción 1</option>
          <option value="opcion2">Opción 2</option>
          <option value="opcion3">Opción 3</option>
        </select>
      )
    }

    return (
      <input
        type={type === "number" ? "number" : "text"}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B4B5C] focus:border-transparent"
        value={formData[key] || ""}
        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
        placeholder={`Ingrese ${label.toLowerCase()}`}
      />
    )
  }

  return (
    <div className="flex-1 p-6">

      <div className="bg-white border border-gray-200 rounded-b-lg">
{onBack && (
  <div className="p-4">
    <button
      onClick={onBack}
      className="text-[#8B4B5C] hover:text-[#A0566B] font-medium flex items-center space-x-1"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      <span>Volver</span>
    </button>
  </div>
)}



        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B4B5C] focus:border-transparent"
              />
            </div>
          </div>

          <button
            onClick={() => openDialog()}
            className="bg-[#8B4B5C] hover:bg-[#A0566B] text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Agregar</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column.label}
                  </th>
                ))}
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {column.type === "number" && typeof item[column.key] === "number"
                        ? item[column.key].toLocaleString()
                        : item[column.key]}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => openDialog(item)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(item.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredData.length === 0 && <div className="text-center py-8 text-gray-500">No se encontraron registros</div>}
      </div>

      {/* Modal Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">
                {editingItem ? "Editar" : "Agregar"} {tableName.slice(0, -1)}
              </h3>
              <button
                onClick={closeDialog}
                className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              {columns
                .filter((col) => col.key !== "id")
                .map((column) => (
                  <div key={column.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{column.label}</label>
                    {renderFormField(column)}
                  </div>
                ))}
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={closeDialog}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#8B4B5C] hover:bg-[#A0566B] text-white rounded-md transition-colors"
                >
                  {editingItem ? "Actualizar" : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}


