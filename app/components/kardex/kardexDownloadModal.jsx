/**
 * Muestra un modal para descargar el kardex en formato PDF o Excel.
 *
 *? @param {{ onClose: function, onPDF: function, onExcel: function, onBoth: function }} props
 *? @returns {JSX.Element}
 */
/**
 *? @function
 *? @param {{ onClose: function, onPDF: function, onExcel: function, onBoth: function }} props
 *? @returns {JSX.Element}
 */
export default function KardexDownloadModal({
  onClose,
  onPDF,
  onExcel,
  onBoth,
  title = "Descargar Kardex",
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-lg font-bold mb-4">{title}</h2>
        <div className="flex flex-col gap-4">
          <button
            className="bg-[#f3f3f3] text-gray-600 py-2 px-4 rounded-lg hover:bg-[#e0e0e0]"
            onClick={onPDF}
          >
            Descargar PDF
          </button>
          <button
            className="bg-[#f3f3f3] text-gray-600 py-2 px-4 rounded-lg hover:bg-[#e0e0e0]"
            onClick={onExcel}
          >
            Descargar Excel
          </button>
          <button
            className="bg-[#f3f3f3] text-gray-600 py-2 px-4 rounded-lg hover:bg-[#e0e0e0]"
            onClick={onBoth}
          >
            Descargar Ambos
          </button>
        </div>
        <button
          className="mt-4 bg-[#712b39] text-white py-2 px-4 rounded-lg hover:bg-[#5e242e]"
          onClick={onClose}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
