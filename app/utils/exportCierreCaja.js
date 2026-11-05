// helpers/exportCierreCaja.js
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { utils, writeFile } from 'xlsx';

const ESTADO_VENTA = { P: 'Pendiente', C: 'Cancelado', F: 'Finalizado' };

const nombrePeriodo = (fechaInicio, fechaFin) =>
  fechaInicio && fechaFin ? `${fechaInicio}_a_${fechaFin}` : 'Historico';

const nombreCliente = (venta) =>
  venta.cliente?.nombre_cliente ||
  venta.cliente_nombre ||
  'Consumidor Final';

function filasResumen(resumen) {
  return [
    ['Ingresos - Efectivo', `$${resumen.ingresos.efectivo.toFixed(2)}`],
    ['Ingresos - Transferencia', `$${resumen.ingresos.transferencia.toFixed(2)}`],
    ['Ingresos - Tarjeta', `$${resumen.ingresos.tarjeta.toFixed(2)}`],
    ['Ingresos - Total', `$${resumen.ingresos.total.toFixed(2)}`],
    ['Egresos - Efectivo', `$${resumen.egresos.efectivo.toFixed(2)}`],
    ['Egresos - Transferencia', `$${resumen.egresos.transferencia.toFixed(2)}`],
    ['Egresos - Tarjeta', `$${resumen.egresos.tarjeta.toFixed(2)}`],
    ['Egresos - Total', `$${resumen.egresos.total.toFixed(2)}`],
    ['Caja Fija (efectivo)', `$${resumen.totalCajaFija.toFixed(2)}`],
    ['Balance General', `$${resumen.balanceGeneral.toFixed(2)}`],
  ];
}

export function downloadPDF({ resumen, fechaInicio, fechaFin, ventas = [], abonos = [], egresos = [] }) {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text('Cierre de Caja', 14, 15);
  doc.setFontSize(10);
  doc.text(
    `Periodo: ${fechaInicio || 'Inicio'} al ${fechaFin || 'Actualidad'}`,
    14,
    22
  );

  autoTable(doc, {
    startY: 28,
    head: [['Concepto', 'Monto']],
    body: filasResumen(resumen),
    theme: 'grid',
    headStyles: { fillColor: [113, 43, 57] },
  });

  doc.setFontSize(12);
  doc.text('Detalle de Ventas', 14, doc.lastAutoTable.finalY + 10);
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 14,
    head: [['Fecha', 'Cliente', 'Método', 'Estado', 'Total']],
    body: ventas.map((v) => [
      new Date(v.fecha_venta).toLocaleString(),
      nombreCliente(v),
      v.metodo_venta,
      ESTADO_VENTA[v.estado_venta] || v.estado_venta,
      `$${parseFloat(v.total_venta || 0).toFixed(2)}`,
    ]),
    theme: 'grid',
    headStyles: { fillColor: [113, 43, 57] },
  });

  doc.text('Detalle de Abonos', 14, doc.lastAutoTable.finalY + 10);
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 14,
    head: [['Fecha', 'Cliente', 'Venta #', 'Método', 'Monto', 'Completado']],
    body: abonos.map((a) => [
      new Date(a.fecha).toLocaleString(),
      a.cliente?.nombre_cliente || 'N/A',
      a.venta?.id ?? a.venta_id ?? '',
      a.metodo_pago,
      `$${parseFloat(a.monto || 0).toFixed(2)}`,
      a.completado ? 'Sí' : 'No',
    ]),
    theme: 'grid',
    headStyles: { fillColor: [113, 43, 57] },
  });

  doc.text('Detalle de Egresos', 14, doc.lastAutoTable.finalY + 10);
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 14,
    head: [['Fecha', 'Descripción', 'Categoría', 'Método', 'Monto']],
    body: egresos.map((e) => [
      new Date(e.fecha_egreso).toLocaleString(),
      e.descripcion_egreso,
      e.categoria_egreso,
      e.metodo_pago_egreso,
      `$${parseFloat(e.monto_egreso || 0).toFixed(2)}`,
    ]),
    theme: 'grid',
    headStyles: { fillColor: [113, 43, 57] },
  });

  doc.save(`Cierre-Caja-${nombrePeriodo(fechaInicio, fechaFin)}.pdf`);
}

export function downloadExcel({ resumen, fechaInicio, fechaFin, ventas = [], abonos = [], egresos = [] }) {
  const workbook = utils.book_new();

  const hojaResumen = utils.json_to_sheet(
    filasResumen(resumen).map(([Concepto, Monto]) => ({ Concepto, Monto }))
  );
  utils.book_append_sheet(workbook, hojaResumen, 'Resumen');

  const hojaVentas = utils.json_to_sheet(
    ventas.map((v) => ({
      Fecha: new Date(v.fecha_venta).toLocaleString(),
      Cliente: nombreCliente(v),
      Método: v.metodo_venta,
      Estado: ESTADO_VENTA[v.estado_venta] || v.estado_venta,
      Total: parseFloat(v.total_venta || 0),
    }))
  );
  utils.book_append_sheet(workbook, hojaVentas, 'Ventas');

  const hojaAbonos = utils.json_to_sheet(
    abonos.map((a) => ({
      Fecha: new Date(a.fecha).toLocaleString(),
      Cliente: a.cliente?.nombre_cliente || 'N/A',
      'Venta #': a.venta?.id ?? a.venta_id ?? '',
      Método: a.metodo_pago,
      Monto: parseFloat(a.monto || 0),
      Completado: a.completado ? 'Sí' : 'No',
    }))
  );
  utils.book_append_sheet(workbook, hojaAbonos, 'Abonos');

  const hojaEgresos = utils.json_to_sheet(
    egresos.map((e) => ({
      Fecha: new Date(e.fecha_egreso).toLocaleString(),
      Descripción: e.descripcion_egreso,
      Categoría: e.categoria_egreso,
      Método: e.metodo_pago_egreso,
      Monto: parseFloat(e.monto_egreso || 0),
    }))
  );
  utils.book_append_sheet(workbook, hojaEgresos, 'Egresos');

  writeFile(workbook, `Cierre-Caja-${nombrePeriodo(fechaInicio, fechaFin)}.xlsx`);
}
