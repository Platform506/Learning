import {
  calculateCaseA,
  sampleCaseADay,
  sampleCaseALunch,
} from './calc';
import { defaultPrices, emptyCash } from './types';

/** Expected difference for the reference planilla: -455 */
export function smokeCaseA(): number {
  const cash = {
    ...emptyCash(),
    billetes: 472000,
    monedas: 2000,
    tarjetas: 521178,
  };
  const result = calculateCaseA(
    defaultPrices(),
    cash,
    sampleCaseADay(),
    sampleCaseALunch(),
  );
  return result.difference;
}
