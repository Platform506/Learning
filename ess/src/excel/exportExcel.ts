import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import {
  buildWorkbookCasoA,
  buildWorkbookCasoB,
  workbookToBase64,
} from './buildWorkbook';
import { useEssStore } from '../store/essStore';

export async function exportCurrentExcel(): Promise<void> {
  const state = useEssStore.getState();
  if (!state.caseType) throw new Error('Seleccione un caso primero');

  const wb =
    state.caseType === 'normal'
      ? buildWorkbookCasoA({
          prices: state.prices,
          cash: state.cash,
          day: state.dayMeters,
          lunch: state.lunchMeters,
          result: state.getCaseAResult(),
        })
      : buildWorkbookCasoB({
          prices: state.prices,
          cash: state.cash,
          lunches: state.lunchQuadrants,
          result: state.getCaseBResult(),
        });

  const base64 = workbookToBase64(wb);
  const name =
    state.caseType === 'normal'
      ? `ess-dia-normal-${Date.now()}.xlsx`
      : `ess-almuercero-${Date.now()}.xlsx`;
  const path = `${FileSystem.cacheDirectory}${name}`;
  await FileSystem.writeAsStringAsync(path, base64, {
    encoding: FileSystem.EncodingType.Base64,
  });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(path, {
      mimeType:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      dialogTitle: 'Exportar Excel ESS',
      UTI: 'com.microsoft.excel.xlsx',
    });
  } else {
    throw new Error(`Excel guardado en ${path}`);
  }
}
