import { create } from 'zustand';
import {
  calculateCaseA,
  calculateCaseB,
  sampleCaseADay,
  sampleCaseALunch,
} from './../domain/calc';
import {
  Ambiguity,
  CaseAResult,
  CaseBResult,
  CaseType,
  CashBreakdown,
  CashKey,
  defaultPrices,
  emptyCash,
  emptyMeterTable,
  MeterRow,
  MeterTable,
  Prices,
} from './../domain/types';

type EssState = {
  caseType: CaseType | null;
  prices: Prices;
  cash: CashBreakdown;
  dayMeters: MeterTable;
  lunchMeters: MeterTable;
  lunchQuadrants: MeterTable[];
  ambiguities: Ambiguity[];
  setCaseType: (c: CaseType) => void;
  setPrice: (fuel: keyof Prices, value: number) => void;
  setCash: (key: CashKey, value: number) => void;
  setMeterCell: (
    table: 'day' | 'lunch' | `quad-${number}`,
    rowIndex: number,
    field: 'ingreso' | 'salida',
    value: number | null,
    meta?: Partial<MeterRow>,
  ) => void;
  replaceMeterTable: (
    table: 'day' | 'lunch' | `quad-${number}`,
    rows: MeterTable,
  ) => void;
  setAmbiguities: (items: Ambiguity[]) => void;
  resolveAmbiguity: (path: string, value: number) => void;
  loadSampleA: () => void;
  resetAll: () => void;
  getCaseAResult: () => CaseAResult;
  getCaseBResult: () => CaseBResult;
};

function cloneTable(table: MeterTable): MeterTable {
  return table.map((row) => ({ ...row }));
}

export const useEssStore = create<EssState>((set, get) => ({
  caseType: null,
  prices: defaultPrices(),
  cash: emptyCash(),
  dayMeters: emptyMeterTable(),
  lunchMeters: emptyMeterTable(),
  lunchQuadrants: [
    emptyMeterTable(),
    emptyMeterTable(),
    emptyMeterTable(),
    emptyMeterTable(),
  ],
  ambiguities: [],

  setCaseType: (caseType) => set({ caseType }),

  setPrice: (fuel, value) =>
    set((s) => ({ prices: { ...s.prices, [fuel]: value } })),

  setCash: (key, value) =>
    set((s) => ({ cash: { ...s.cash, [key]: value } })),

  setMeterCell: (table, rowIndex, field, value, meta) =>
    set((s) => {
      const apply = (rows: MeterTable) => {
        const next = cloneTable(rows);
        next[rowIndex] = {
          ...next[rowIndex],
          [field]: value,
          ...meta,
        };
        return next;
      };

      if (table === 'day') return { dayMeters: apply(s.dayMeters) };
      if (table === 'lunch') return { lunchMeters: apply(s.lunchMeters) };
      const idx = Number(table.split('-')[1]);
      const quads = s.lunchQuadrants.map(cloneTable);
      quads[idx] = apply(quads[idx]);
      return { lunchQuadrants: quads };
    }),

  replaceMeterTable: (table, rows) =>
    set((s) => {
      if (table === 'day') return { dayMeters: cloneTable(rows) };
      if (table === 'lunch') return { lunchMeters: cloneTable(rows) };
      const idx = Number(table.split('-')[1]);
      const quads = s.lunchQuadrants.map(cloneTable);
      quads[idx] = cloneTable(rows);
      return { lunchQuadrants: quads };
    }),

  setAmbiguities: (ambiguities) => set({ ambiguities }),

  resolveAmbiguity: (path, value) => {
    const [table, rowStr, field] = path.split('.');
    const rowIndex = Number(rowStr);
    get().setMeterCell(
      table as 'day' | 'lunch' | `quad-${number}`,
      rowIndex,
      field as 'ingreso' | 'salida',
      value,
      { ambiguous: false, candidates: undefined },
    );
    set((s) => ({
      ambiguities: s.ambiguities.filter((a) => a.path !== path),
    }));
  },

  loadSampleA: () =>
    set({
      caseType: 'normal',
      prices: defaultPrices(),
      cash: {
        billetes: 472000,
        monedas: 2000,
        dolares: 0,
        facturas: 0,
        tarjetas: 521178,
        vales: 0,
        bancos: 0,
      },
      dayMeters: sampleCaseADay(),
      lunchMeters: sampleCaseALunch(),
    }),

  resetAll: () =>
    set({
      caseType: null,
      prices: defaultPrices(),
      cash: emptyCash(),
      dayMeters: emptyMeterTable(),
      lunchMeters: emptyMeterTable(),
      lunchQuadrants: [
        emptyMeterTable(),
        emptyMeterTable(),
        emptyMeterTable(),
        emptyMeterTable(),
      ],
      ambiguities: [],
    }),

  getCaseAResult: () => {
    const s = get();
    return calculateCaseA(s.prices, s.cash, s.dayMeters, s.lunchMeters);
  },

  getCaseBResult: () => {
    const s = get();
    return calculateCaseB(s.prices, s.cash, s.lunchQuadrants);
  },
}));
