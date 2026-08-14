import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import {
  PrimaryButton,
  Screen,
  SecondaryButton,
  Subtitle,
  Title,
  colors,
} from '@/src/components/ui';
import { AmbiguityModal } from '@/src/components/AmbiguityModal';
import { useEssStore } from '@/src/store/essStore';
import { exportCurrentExcel } from '@/src/excel/exportExcel';
import { FUEL_LABELS } from '@/src/domain/types';

export default function ResultScreen() {
  const router = useRouter();
  const caseType = useEssStore((s) => s.caseType);
  const ambiguities = useEssStore((s) => s.ambiguities);
  const resolveAmbiguity = useEssStore((s) => s.resolveAmbiguity);
  const setAmbiguities = useEssStore((s) => s.setAmbiguities);
  const getCaseAResult = useEssStore((s) => s.getCaseAResult);
  const getCaseBResult = useEssStore((s) => s.getCaseBResult);
  const [exporting, setExporting] = useState(false);

  const result =
    caseType === 'almuercero' ? getCaseBResult() : getCaseAResult();
  const currentAmbiguity = ambiguities[0] ?? null;

  async function onExport() {
    setExporting(true);
    try {
      await exportCurrentExcel();
    } catch (e) {
      Alert.alert(
        'Exportación',
        e instanceof Error ? e.message : 'No se pudo exportar',
      );
    } finally {
      setExporting(false);
    }
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ gap: 14, paddingBottom: 48 }}>
        <Title>Resultado</Title>
        <Subtitle>
          Comparación entre dinero de caja y dinero según litros × precio.
        </Subtitle>

        {result.unbalanced && (
          <View style={styles.alert}>
            <Text style={styles.alertTitle}>Monto muy desbalanceado</Text>
            <Text style={styles.alertBody}>
              La diferencia supera el umbral. Revise números ambiguos del OCR o
              del papel manuscrito.
            </Text>
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.label}>Total dispensado (esperado)</Text>
          <Text style={styles.value}>
            {result.expectedTotal.toLocaleString()}
          </Text>
          <Text style={styles.label}>Total caja / pistero</Text>
          <Text style={styles.value}>{result.cashTotal.toLocaleString()}</Text>
          <Text style={styles.label}>Resultado</Text>
          <Text
            style={[
              styles.result,
              result.difference >= 0 ? styles.positive : styles.negative,
            ]}
          >
            {result.difference >= 0 ? 'Sobra' : 'Falta'}{' '}
            {Math.abs(result.difference).toLocaleString()}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.section}>Desglose por combustible</Text>
          {(['diesel', 'regular', 'super'] as const).map((f) => (
            <Text key={f} style={styles.line}>
              {FUEL_LABELS[f]}: {result.moneyByFuel[f].toLocaleString()}
            </Text>
          ))}
        </View>

        <PrimaryButton
          label={exporting ? 'Generando Excel…' : 'Exportar Excel'}
          onPress={onExport}
          disabled={exporting}
        />
        <SecondaryButton
          label="Volver a revisión"
          onPress={() => router.push('/review')}
        />
        <SecondaryButton label="Inicio" onPress={() => router.replace('/')} />
      </ScrollView>

      <AmbiguityModal
        item={currentAmbiguity}
        onChoose={(value) => {
          if (currentAmbiguity) resolveAmbiguity(currentAmbiguity.path, value);
        }}
        onSkip={() => {
          if (currentAmbiguity) {
            setAmbiguities(
              ambiguities.filter((a) => a.path !== currentAmbiguity.path),
            );
          }
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: { color: colors.muted, fontSize: 13 },
  value: { fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: 8 },
  result: { fontSize: 28, fontWeight: '800' },
  positive: { color: colors.accent },
  negative: { color: colors.danger },
  section: { fontWeight: '700', marginBottom: 4 },
  line: { color: colors.text },
  alert: {
    backgroundColor: '#ffebee',
    borderRadius: 10,
    padding: 12,
    gap: 4,
  },
  alertTitle: { fontWeight: '700', color: colors.danger },
  alertBody: { color: colors.text },
});
