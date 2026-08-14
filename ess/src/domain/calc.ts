import {
  CaseAResult,
  CaseBResult,
  CashBreakdown,
  CASH_KEYS,
  FuelType,
  FUEL_ORDER,
  MeterTable,
  MoneyByFuel,
  Prices,
  ROW_COUNT,
} from './types';

export const UNBALANCE_THRESHOLD = 1000;

export function rowTotal(ingreso: number | null, salida: number | null): number | null {
  if (ingreso == null || salida == null) return null;
  return salida - ingreso;
}

export function cashTotal(cash: CashBreakdown): number {
  return CASH_KEYS.reduce((sum, key) => sum + (cash[key] || 0), 0);
}

export function meterTotals(table: MeterTable): (number | null)[] {
  return table.map((row) => rowTotal(row.ingreso, row.salida));
}

export function collectMeterWarnings(table: MeterTable, label: string): string[] {
  const warnings: string[] = [];
  table.forEach((row, i) => {
    if (row.ingreso != null && row.salida != null && row.salida < row.ingreso) {
      warnings.push(`${label} fila ${i + 1}: salida < ingreso`);
    }
    if (row.ambiguous) {
      warnings.push(`${label} fila ${i + 1}: valor ambiguo`);
    }
  });
  return warnings;
}

function emptyMoney(): MoneyByFuel {
  return { diesel: 0, regular: 0, super: 0 };
}

export function calculateCaseA(
  prices: Prices,
  cash: CashBreakdown,
  day: MeterTable,
  lunch: MeterTable,
): CaseAResult {
  const dayTotals = meterTotals(day);
  const lunchTotals = meterTotals(lunch);
  const netLiters: number[] = [];
  const moneyByFuel = emptyMoney();
  const meterWarnings = [
    ...collectMeterWarnings(day, 'Día'),
    ...collectMeterWarnings(lunch, 'Almuerzo'),
  ];

  for (let i = 0; i < ROW_COUNT; i++) {
    const d = dayTotals[i];
    const l = lunchTotals[i];
    const net = (d ?? 0) - (l ?? 0);
    netLiters.push(net);
    const fuel = FUEL_ORDER[i];
    moneyByFuel[fuel] += net * prices[fuel];
  }

  const expectedTotal =
    moneyByFuel.diesel + moneyByFuel.regular + moneyByFuel.super;
  const totalCash = cashTotal(cash);
  const difference = totalCash - expectedTotal;

  return {
    netLiters,
    moneyByFuel,
    expectedTotal,
    cashTotal: totalCash,
    difference,
    unbalanced: Math.abs(difference) >= UNBALANCE_THRESHOLD,
    meterWarnings,
  };
}

export function calculateCaseB(
  prices: Prices,
  cash: CashBreakdown,
  lunches: MeterTable[],
): CaseBResult {
  const lunchTotals = lunches.map((table) =>
    meterTotals(table).map((v) => v ?? 0),
  );
  const litersByFuel: Record<FuelType, number[]> = {
    diesel: [0, 0, 0, 0],
    regular: [0, 0, 0, 0],
    super: [0, 0, 0, 0],
  };
  const moneyByLunch = [0, 0, 0, 0];
  const moneyByFuel = emptyMoney();
  const meterWarnings = lunches.flatMap((table, n) =>
    collectMeterWarnings(table, `Almuerzo ${n + 1}`),
  );

  for (let n = 0; n < lunches.length; n++) {
    for (let i = 0; i < ROW_COUNT; i++) {
      const liters = lunchTotals[n][i];
      const fuel = FUEL_ORDER[i];
      litersByFuel[fuel][n] += liters;
      const money = liters * prices[fuel];
      moneyByLunch[n] += money;
      moneyByFuel[fuel] += money;
    }
  }

  const expectedTotal =
    moneyByFuel.diesel + moneyByFuel.regular + moneyByFuel.super;
  const totalCash = cashTotal(cash);
  const difference = totalCash - expectedTotal;

  return {
    lunchTotals,
    litersByFuel,
    moneyByFuel,
    moneyByLunch,
    expectedTotal,
    cashTotal: totalCash,
    difference,
    unbalanced: Math.abs(difference) >= UNBALANCE_THRESHOLD,
    meterWarnings,
  };
}

/** Sample data from the planilla (Caso A) for demos / tests */
export function sampleCaseADay(): MeterTable {
  const pairs: [number, number][] = [
    [1852695, 1852815],
    [2006007, 2006075],
    [1013234, 1013419],
    [1300686, 1300795],
    [1980847, 1980987],
    [1125795, 1126243],
    [975477, 975577],
    [1822024, 1822164],
    [1030518, 1030777],
    [1302192, 1302329],
    [2271503, 2271580],
    [1177024, 1177150],
  ];
  return pairs.map(([ingreso, salida]) => ({ ingreso, salida }));
}

export function sampleCaseALunch(): MeterTable {
  const pairs: [number, number][] = [
    [1852769, 1852805],
    [2006007, 2006007],
    [1013235, 1013235],
    [1300686, 1300735],
    [1980875, 1980903],
    [1125878, 1125963],
    [975477, 975485],
    [1822052, 1822080],
    [1030518, 1030518],
    [1302192, 1302192],
    [2271542, 2271581],
    [1177042, 1177060],
  ];
  // Use derived totals from image 4: net = day - lunch => lunch = day - net
  // From user image 4 nets: 84,68,184,60,112,363,92,112,259,137,38,108
  // day totals: 120,68,185,109,140,448,100,140,259,137,77,126
  // lunch = day - net
  const day = sampleCaseADay();
  const nets = [84, 68, 184, 60, 112, 363, 92, 112, 259, 137, 38, 108];
  return day.map((row, i) => {
    const dayTotal = (row.salida ?? 0) - (row.ingreso ?? 0);
    const lunchTotal = dayTotal - nets[i];
    return {
      ingreso: row.ingreso,
      salida: (row.ingreso ?? 0) + lunchTotal,
    };
  });
}
