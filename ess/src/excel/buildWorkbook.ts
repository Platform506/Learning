import * as XLSX from 'xlsx';
import {
  CaseAResult,
  CaseBResult,
  CashBreakdown,
  CASH_KEYS,
  CASH_LABELS,
  FUEL_LABELS,
  FUEL_ORDER,
  MeterTable,
  Prices,
  machineLabel,
} from '../domain/types';
import { cashTotal, rowTotal } from '../domain/calc';

function meterBlock(
  title: string,
  table: MeterTable,
): (string | number | null)[][] {
  const rows: (string | number | null)[][] = [
    [title, '', ''],
    ['Combustible', 'Ingreso', 'Salida', 'Total Litros'],
  ];
  table.forEach((row, i) => {
    rows.push([
      machineLabel(i),
      row.ingreso,
      row.salida,
      rowTotal(row.ingreso, row.salida),
    ]);
  });
  rows.push(['']);
  return rows;
}

export function buildWorkbookCasoA(input: {
  prices: Prices;
  cash: CashBreakdown;
  day: MeterTable;
  lunch: MeterTable;
  result: CaseAResult;
}): XLSX.WorkBook {
  const { prices, cash, day, lunch, result } = input;
  const aoa: (string | number | null)[][] = [];

  aoa.push(['Precios']);
  aoa.push(['Diesel', 'Regular', 'Super']);
  aoa.push([prices.diesel, prices.regular, prices.super]);
  aoa.push(['']);

  aoa.push(['Caja', 'Datos Pistero', 'Datos Revision']);
  CASH_KEYS.forEach((key) => {
    aoa.push([CASH_LABELS[key], cash[key], '']);
  });
  aoa.push(['Total', cashTotal(cash), '']);
  aoa.push(['']);

  aoa.push(...meterBlock('Litros del día', day));
  aoa.push(...meterBlock('Litros de almuerzo', lunch));

  aoa.push(['Litros dispensados']);
  aoa.push(['Combustible', 'Litros']);
  result.netLiters.forEach((liters, i) => {
    aoa.push([machineLabel(i), liters]);
  });
  aoa.push(['']);

  aoa.push(['Combustible', 'Precio', 'Total en Dinero']);
  (['diesel', 'regular', 'super'] as const).forEach((fuel) => {
    aoa.push([FUEL_LABELS[fuel], prices[fuel], result.moneyByFuel[fuel]]);
  });
  aoa.push(['Total', '', result.expectedTotal]);
  aoa.push(['']);

  aoa.push(['Total Dispensado', result.expectedTotal]);
  aoa.push(['Total Pistero', result.cashTotal]);
  aoa.push(['Resultado', result.difference]);
  aoa.push([
    result.difference >= 0 ? 'Sobra' : 'Falta',
    Math.abs(result.difference),
  ]);

  const sheet = XLSX.utils.aoa_to_sheet(aoa);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, sheet, 'Dia_normal');
  return wb;
}

export function buildWorkbookCasoB(input: {
  prices: Prices;
  cash: CashBreakdown;
  lunches: MeterTable[];
  result: CaseBResult;
}): XLSX.WorkBook {
  const { prices, cash, lunches, result } = input;
  const aoa: (string | number | null)[][] = [];

  aoa.push(['Precios']);
  aoa.push(['Diesel', 'Regular', 'Super']);
  aoa.push([prices.diesel, prices.regular, prices.super]);
  aoa.push(['']);

  aoa.push(['Caja almuercero', 'Monto']);
  CASH_KEYS.forEach((key) => {
    aoa.push([CASH_LABELS[key], cash[key]]);
  });
  aoa.push(['Total', cashTotal(cash)]);
  aoa.push(['']);

  for (let n = 0; n < lunches.length; n++) {
    aoa.push(...meterBlock(`Almuerzo ${n + 1}`, lunches[n]));
  }

  aoa.push([
    'Litros por almuerzo',
    'Alm1',
    'Alm2',
    'Alm3',
    'Alm4',
    'Suma',
  ]);
  for (let i = 0; i < FUEL_ORDER.length; i++) {
    const vals = result.lunchTotals.map((t) => t[i] ?? 0);
    const sum = vals.reduce((a, b) => a + b, 0);
    aoa.push([machineLabel(i), ...vals, sum]);
  }
  aoa.push(['']);

  aoa.push(['Resumen litros por combustible', 'Alm1', 'Alm2', 'Alm3', 'Alm4', 'Total']);
  (['diesel', 'regular', 'super'] as const).forEach((fuel) => {
    const vals = result.litersByFuel[fuel];
    const sum = vals.reduce((a, b) => a + b, 0);
    aoa.push([FUEL_LABELS[fuel], ...vals, sum]);
  });
  aoa.push(['']);

  aoa.push(['Dinero por almuerzo', 'Alm1', 'Alm2', 'Alm3', 'Alm4']);
  aoa.push(['Subtotal', ...result.moneyByLunch]);
  aoa.push(['']);

  aoa.push(['Combustible', 'Precio', 'Total en Dinero']);
  (['diesel', 'regular', 'super'] as const).forEach((fuel) => {
    aoa.push([FUEL_LABELS[fuel], prices[fuel], result.moneyByFuel[fuel]]);
  });
  aoa.push(['Total', '', result.expectedTotal]);
  aoa.push(['']);

  aoa.push(['Total Dispensado', result.expectedTotal]);
  aoa.push(['Total Caja Almuercero', result.cashTotal]);
  aoa.push(['Resultado', result.difference]);

  const sheet = XLSX.utils.aoa_to_sheet(aoa);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, sheet, 'Almuercero');
  return wb;
}

export function workbookToBase64(wb: XLSX.WorkBook): string {
  return XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
}
