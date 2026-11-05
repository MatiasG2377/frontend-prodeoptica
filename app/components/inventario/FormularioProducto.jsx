"use client";
import {
  InputField,
  TextareaField,
  SelectField,
  FileField,
} from "../common/FormFields";
import Swal from "sweetalert2";

export default function FormularioProducto({
  isOpen,
  onClose,
  formData,
  setFormData,
  categorias,
  proveedores,
  file,
  setFile,
  onSubmit,
}) {
  const CAMPOS_DECIMALES = ["pvp_producto", "costo_producto"];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let finalValue = type === "checkbox" ? checked : value;

    if (CAMPOS_DECIMALES.includes(name) && typeof finalValue === "string") {
      finalValue = finalValue.replace(",", ".").replace(/[^0-9.]/g, "");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));
  };

  const handleSubmit = () => {
    const nombre = formData.nombre_producto ? formData.nombre_producto.trim() : "";
    
    if (!nombre) {
      Swal.fire({
        icon: "warning",
        title: "Campo requerido",
        text: "El nombre del producto es obligatorio.",
        confirmButtonColor: "#712b39",
      });
      return;
    }

    if (nombre.length > 60) {
      Swal.fire({
        icon: "warning",
        title: "Nombre muy largo",
        text: "El nombre del producto no puede exceder los 60 caracteres.",
        confirmButtonColor: "#712b39",
      });
      return;
    }

    // Validación obligatoria para control de stock
    if (formData.controla_stock) {
      const faltanDatos = [];

      if (
        formData.cantidad_producto === undefined ||
        formData.cantidad_producto === null ||
        formData.cantidad_producto === ""
      )
        faltanDatos.push("cantidad actual");
      if (!formData.minimo_producto) faltanDatos.push("stock mínimo");
      if (!formData.maximo_producto) faltanDatos.push("stock máximo");

      if (faltanDatos.length > 0) {
        Swal.fire({
          title: "Datos obligatorios para control de stock",
          text: `Para activar el control de stock debe ingresar: ${faltanDatos.join(
            ", "
          )}`,
          icon: "warning",
          confirmButtonColor: "#712b39",
        });
        return;
      }
    }

    // ✅ Todo validado
    onSubmit();
  };
  const handleFile = (e) => {
    const selectedFile = e.target.files[0];
    if (
      !selectedFile ||
      !["image/jpeg", "image/png", "image/webp"].includes(selectedFile.type)
    ) {
      alert("Selecciona un archivo JPG, PNG o WEBP válido.");
      return;
    }
    setFile(selectedFile);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-3/4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#712b39]">
          {formData?.id ? "Editar Producto" : "Agregar Producto"}
        </h2>

        {/* Sección de campos obligatorios */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="relative">
            <InputField
              label={
                <span>
                  Nombre del Producto <span className="text-red-500">*</span>
                </span>
              }
              name="nombre_producto"
              value={formData.nombre_producto || ""}
              onChange={handleChange}
              maxLength={60}
            />
            <div className="absolute bottom-1 right-0 text-xs text-gray-500">
              {formData.nombre_producto?.length || 0}/60
            </div>
          </div>
          <InputField
            label={
              <span>
                Precio de Venta (PVP) <span className="text-red-500">*</span>
              </span>
            }
            name="pvp_producto"
            type="text"
            inputMode="decimal"
            value={formData.pvp_producto ?? ""}
            onChange={handleChange}
          />
        </div>

        {/* Sección de campos adicionales */}
        <div className="grid grid-cols-2 gap-6">
          {/* Columna izquierda */}
          <div className="flex flex-col space-y-4">
            <div className="relative">
              <InputField
                label="Código del Producto"
                name="codigo_producto"
                value={formData.codigo_producto || ""}
                onChange={handleChange}
                maxLength={20}
              />
              <div className="absolute bottom-1 right-0 text-xs text-gray-500">
                {formData.codigo_producto?.length || 0}/20
              </div>
            </div>

            <TextareaField
              label="Descripción del Producto"
              name="descripcion_producto"
              value={formData.descripcion_producto || ""}
              onChange={handleChange}
            />
            <InputField
              label="Marca del Producto"
              name="marca_producto"
              value={formData.marca_producto || ""}
              onChange={handleChange}
            />
            <FileField
              label="Imagen del Producto"
              file={file}
              handleFile={handleFile}
            />
          </div>

          {/* Columna derecha */}
          <div className="flex flex-col space-y-4">
            <SelectField
              label="Categoría"
              name="categoria_producto"
              value={formData.categoria_producto || ""}
              onChange={handleChange}
              options={categorias}
              optionLabel="nombre_categoria"
            />
            <SelectField
              label="Proveedor"
              name="proveedor_producto"
              value={formData.proveedor_producto || ""}
              onChange={handleChange}
              options={proveedores}
              optionLabel="nombre_proveedor"
            />
            <InputField
              label="Costo del Producto"
              name="costo_producto"
              type="text"
              inputMode="decimal"
              value={formData.costo_producto ?? ""}
              onChange={handleChange}
            />
            <InputField
              label="Cantidad Disponible"
              name="cantidad_producto"
              type="number"
              value={formData.cantidad_producto ?? ""}
              onChange={handleChange}
            />
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Stock Mínimo"
                name="minimo_producto"
                type="number"
                value={formData.minimo_producto ?? ""}
                onChange={handleChange}
              />
              <InputField
                label="Stock Máximo"
                name="maximo_producto"
                type="number"
                value={formData.maximo_producto ?? ""}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="controla_stock"
                name="controla_stock"
                checked={!!formData.controla_stock}
                onChange={handleChange}
              />
              <label htmlFor="controla_stock" className="text-sm">
                Controla Stock
              </label>
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end mt-8 space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="bg-[#712b39] text-white px-6 py-2 rounded-lg hover:bg-[#5e242e]"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
