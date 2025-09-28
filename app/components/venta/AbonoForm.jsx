export default function AbonoForm({
  abonoInicial,
  setAbonoInicial,
  montoAbono,
  setMontoAbono,
  metodoAbono,
  setMetodoAbono,
}) {
  return (
    <div className="w-full max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md mt-4 border border-gray-200">
      <h3 className="text-lg font-semibold text-[#712b39] mb-4">
        Abono Inicial
      </h3>
      <div className="flex items-center gap-3 mb-4">
        <input
          type="checkbox"
          id="abonoInicial"
          checked={abonoInicial}
          onChange={() => setAbonoInicial(!abonoInicial)}
          className="h-5 w-5 text-[#712b39] border-gray-300 rounded focus:ring-[#712b39]"
        />
        <label
          htmlFor="abonoInicial"
          className="text-[#712b39] font-medium text-base"
        >
          Registrar abono inicial
        </label>
      </div>
      {abonoInicial && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Monto del Abono
            </label>
            <input
              type="number"
              min="0"
              value={montoAbono}
              onChange={(e) => {
                const value = e.target.value;
                // Only update if the value is empty or a non-negative number
                if (value === '' || parseFloat(value) >= 0) {
                  setMontoAbono(value);
                }
              }}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#712b39] focus:border-[#712b39]"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Método de Pago
            </label>
            <select
              value={metodoAbono}
              onChange={(e) => setMetodoAbono(e.target.value)}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#712b39] focus:border-[#712b39]"
            >
              <option>Efectivo</option>
              <option>Transferencia</option>
              <option>Tarjeta</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
