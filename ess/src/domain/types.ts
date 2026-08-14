export type FuelType = 'diesel' | 'regular' | 'super';
export type CaseType = 'normal' | 'almuercero';

export const FUEL_ORDER: FuelType[] = [
  'diesel',
  'regular',
  'super',
  'diesel',
  'regular',
  'super',
  'diesel',
  'regular',
  'super',
  'diesel',
  'regular',
  'super',
];

export const FUEL_LABELS: Record<FuelType, string> = {
  diesel: 'Diesel',
  regular: 'Regular',
  super: 'Super',
};

export const ROW_COUNT = 12;

export type Prices = {
  diesel: number;
  regular: number;
  super: number;
};

export type CashKey =
  | 'billetes'
  | 'monedas'
  | 'dolares'
  | 'facturas'
  | 'tarjetas'
  | 'vales'
  | 'bancos';

export const CASH_KEYS: CashKey[] = [
  'billetes',
  'monedas',
  'dolares',
  'facturas',
  'tarjetas',
  'vales',
  'bancos',
];

export const CASH_LABELS: Record<CashKey, string> = {
  billetes: 'Billetes',
  monedas: 'Monedas',
  dolares: 'Dolares',
  facturas: 'Facturas',
  tarjetas: 'Tarjetas',
  vales: 'Vales',
  bancos: 'Bancos',
};

export type CashBreakdown = Record<CashKey, number>;

export type MeterRow = {
  ingreso: number | null;
  salida: number | null;
  ambiguous?: boolean;
  ambiguityField?: 'ingreso' | 'salida';
  candidates?: number[];
};

export type MeterTable = MeterRow[];

export type Ambiguity = {
  path: string;
  field: 'ingreso' | 'salida';
  rowIndex: number;
  rawText: string;
  candidates: number[];
};

export type ImageQualityIssue = 'blurry' | 'dark' | 'illegible';

export type MoneyByFuel = Record<FuelType, number>;

export type CaseAResult = {
  netLiters: number[];
  moneyByFuel: MoneyByFuel;
  expectedTotal: number;
  cashTotal: number;
  difference: number;
  unbalanced: boolean;
  meterWarnings: string[];
};

export type CaseBResult = {
  lunchTotals: number[][];
  litersByFuel: Record<FuelType, number[]>;
  moneyByFuel: MoneyByFuel;
  moneyByLunch: number[];
  expectedTotal: number;
  cashTotal: number;
  difference: number;
  unbalanced: boolean;
  meterWarnings: string[];
};

export function emptyMeterTable(): MeterTable {
  return Array.from({ length: ROW_COUNT }, () => ({
    ingreso: null,
    salida: null,
  }));
}

export function emptyCash(): CashBreakdown {
  return {
    billetes: 0,
    monedas: 0,
    dolares: 0,
    facturas: 0,
    tarjetas: 0,
    vales: 0,
    bancos: 0,
  };
}

export function defaultPrices(): Prices {
  return { diesel: 565, regular: 628, super: 632 };
}

export function machineLabel(index: number): string {
  const machine = Math.floor(index / 3) + 1;
  return `M${machine} ${FUEL_LABELS[FUEL_ORDER[index]]}`;
}
