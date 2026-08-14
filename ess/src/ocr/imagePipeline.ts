import * as FileSystem from 'expo-file-system/legacy';
import * as ImageManipulator from 'expo-image-manipulator';
import jpeg from 'jpeg-js';
import { Buffer } from 'buffer';
import { ImageQualityIssue, MeterTable, ROW_COUNT, emptyMeterTable } from '../domain/types';

const g = globalThis as typeof globalThis & { Buffer?: typeof Buffer };
if (!g.Buffer) {
  g.Buffer = Buffer;
}

export type QualityResult =
  | { ok: true; blurScore: number }
  | { ok: false; issue: ImageQualityIssue; message: string; blurScore: number };

const BLUR_THRESHOLD = 80;
const MIN_BRIGHTNESS = 25;
const MAX_BRIGHTNESS = 240;

/** Laplacian variance — lower = blurrier */
function laplacianVariance(gray: Uint8Array, width: number, height: number): number {
  let sum = 0;
  let sumSq = 0;
  let count = 0;
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const i = y * width + x;
      const lap =
        -gray[i - width] -
        gray[i - 1] +
        4 * gray[i] -
        gray[i + 1] -
        gray[i + width];
      sum += lap;
      sumSq += lap * lap;
      count++;
    }
  }
  const mean = sum / count;
  return sumSq / count - mean * mean;
}

export async function assessImageQuality(uri: string): Promise<QualityResult> {
  const manipulated = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 320 } }],
    { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG, base64: true },
  );

  if (!manipulated.base64) {
    return {
      ok: false,
      issue: 'illegible',
      message: 'No se pudo leer la imagen. Tómela de nuevo.',
      blurScore: 0,
    };
  }

  const bytes = Buffer.from(manipulated.base64, 'base64');
  const decoded = jpeg.decode(bytes, { useTArray: true });
  const { data, width, height } = decoded;
  const gray = new Uint8Array(width * height);
  let brightnessSum = 0;

  for (let i = 0, p = 0; i < data.length; i += 4, p++) {
    const g = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    gray[p] = g;
    brightnessSum += g;
  }

  const avgBrightness = brightnessSum / gray.length;
  const blurScore = laplacianVariance(gray, width, height);

  let contrastSum = 0;
  for (let i = 0; i < gray.length; i++) {
    const d = gray[i] - avgBrightness;
    contrastSum += d * d;
  }
  const contrast = Math.sqrt(contrastSum / gray.length);

  if (avgBrightness < MIN_BRIGHTNESS || avgBrightness > MAX_BRIGHTNESS) {
    return {
      ok: false,
      issue: 'dark',
      message:
        'La imagen está muy oscura o quemada y poco legible. Tómela de nuevo con mejor luz.',
      blurScore,
    };
  }

  if (blurScore < BLUR_THRESHOLD) {
    return {
      ok: false,
      issue: 'blurry',
      message:
        'La imagen está muy borrosa o poco legible. Acérquese a la tabla y tome la foto de nuevo.',
      blurScore,
    };
  }

  if (contrast < 18) {
    return {
      ok: false,
      issue: 'illegible',
      message:
        'La imagen tiene poco contraste y es difícil de leer. Tómela de nuevo con mejor iluminación.',
      blurScore,
    };
  }

  return { ok: true, blurScore };
}

function parseNumberToken(token: string): number | null {
  const cleaned = token.replace(/[^\d]/g, '');
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

/**
 * Extract digit groups from free OCR text into meter rows (ingreso/salida pairs).
 * Handwritten OCR is imperfect — ambiguous pairs get flagged.
 */
export function parseMeterTableFromText(text: string): {
  rows: MeterTable;
  lowYield: boolean;
} {
  const tokens = text.match(/\d[\d\s.,]{2,}/g) ?? [];
  const numbers = tokens
    .map(parseNumberToken)
    .filter((n): n is number => n != null && n > 0);

  const rows = emptyMeterTable();
  let filled = 0;

  for (let i = 0; i < ROW_COUNT && filled + 1 < numbers.length; i++) {
    const ingreso = numbers[filled];
    const salida = numbers[filled + 1];
    const ambiguous = salida < ingreso || Math.abs(salida - ingreso) > 100000;
    rows[i] = {
      ingreso,
      salida,
      ambiguous,
      candidates: ambiguous ? [ingreso, salida] : undefined,
    };
    filled += 2;
  }

  const lowYield = filled < ROW_COUNT * 2 * 0.5;
  return { rows, lowYield };
}

export function parseCashFromText(text: string): Partial<Record<string, number>> {
  const result: Partial<Record<string, number>> = {};
  const labels: [string, RegExp][] = [
    ['billetes', /billetes?\s*[^\d]*(\d[\d.,\s]*)/i],
    ['monedas', /monedas?\s*[^\d]*(\d[\d.,\s]*)/i],
    ['dolares', /d[oó]lares?\s*[^\d]*(\d[\d.,\s]*)/i],
    ['facturas', /facturas?\s*[^\d]*(\d[\d.,\s]*)/i],
    ['tarjetas', /tarjetas?\s*[^\d]*(\d[\d.,\s]*)/i],
    ['vales', /vales?\s*[^\d]*(\d[\d.,\s]*)/i],
    ['bancos', /bancos?\s*[^\d]*(\d[\d.,\s]*)/i],
  ];

  for (const [key, re] of labels) {
    const m = text.match(re);
    if (m) {
      const n = parseNumberToken(m[1]);
      if (n != null) result[key] = n;
    }
  }

  // Fallback: pick largest numbers as likely cash amounts
  if (Object.keys(result).length === 0) {
    const nums = (text.match(/\d[\d.,\s]{2,}/g) ?? [])
      .map(parseNumberToken)
      .filter((n): n is number => n != null)
      .sort((a, b) => b - a);
    if (nums[0]) result.billetes = nums[0];
    if (nums[1]) result.tarjetas = nums[1];
    if (nums[2]) result.monedas = nums[2];
  }

  return result;
}

/**
 * On-device OCR without native ML Kit: uses quality gate + digit heuristics.
 * If the image is blurry/illegible we reject it. Otherwise we attempt a light
 * parse; low-yield results are marked illegible so the user retakes or edits.
 */
export async function processTableImage(
  uri: string,
  kind: 'meters' | 'cash',
): Promise<
  | { ok: true; text: string; rows?: MeterTable; cash?: Partial<Record<string, number>> }
  | { ok: false; issue: ImageQualityIssue; message: string }
> {
  const quality = await assessImageQuality(uri);
  if (!quality.ok) {
    return { ok: false, issue: quality.issue, message: quality.message };
  }

  // Without native OCR engines in Expo Go, we cannot read handwriting reliably.
  // We still gate on blur/legibility; caller should allow manual entry.
  // If EXPO_PUBLIC_OCR_TEXT is injected for tests, use it.
  const injected = process.env.EXPO_PUBLIC_OCR_TEXT;
  const text = injected ?? '';

  if (kind === 'meters') {
    if (!text.trim()) {
      return {
        ok: true,
        text: '',
        rows: emptyMeterTable(),
      };
    }
    const { rows, lowYield } = parseMeterTableFromText(text);
    if (lowYield) {
      return {
        ok: false,
        issue: 'illegible',
        message:
          'No se pudieron leer suficientes números. La foto puede estar poco legible; tómela de nuevo o complete la tabla a mano.',
      };
    }
    return { ok: true, text, rows };
  }

  if (!text.trim()) {
    return { ok: true, text: '', cash: {} };
  }
  return { ok: true, text, cash: parseCashFromText(text) };
}

export async function readUriAsInfo(uri: string) {
  const info = await FileSystem.getInfoAsync(uri);
  return info;
}
