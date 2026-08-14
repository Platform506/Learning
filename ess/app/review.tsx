import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { CashTableEditor } from '@/src/components/CashTableEditor';
import { MeterTableEditor } from '@/src/components/MeterTableEditor';
import {
  PrimaryButton,
  Screen,
  Subtitle,
  Title,
  colors,
} from '@/src/components/ui';
import { useEssStore } from '@/src/store/essStore';
import { FUEL_LABELS, machineLabel } from '@/src/domain/types';

export default function ReviewScreen() {
  const router = useRouter();
  const caseType = useEssStore((s) => s.caseType);
  const prices = useEssStore((s) => s.prices);
  const cash = useEssStore((s) => s.cash);
  const setCash = useEssStore((s) => s.setCash);
  const dayMeters = useEssStore((s) => s.dayMeters);
  const lunchMeters = useEssStore((s) => s.lunchMeters);
  const quads = useEssStore((s) => s.lunchQuadrants);
  const setMeterCell = useEssStore((s) => s.setMeterCell);
  const getCaseAResult = useEssStore((s) => s.getCaseAResult);
  const getCaseBResult = useEssStore((s) => s.getCaseBResult);

  const resultA = caseType === 'normal' ? getCaseAResult() : null;
  const resultB = caseType === 'almuercero' ? getCaseBResult() : null;
  const warnings =
    resultA?.meterWarnings ?? resultB?.meterWarnings ?? [];

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ gap: 14, paddingBottom: 48 }}>
        <Title>Revisión</Title>
        <Subtitle>
          Corrige cualquier número mal leído del papel manuscrito antes del
          resultado.
        </Subtitle>

        {warnings.length > 0 && (
          <View style={styles.warnBox}>
            <Text style={styles.warnTitle}>Avisos</Text>
            {warnings.map((w) => (
              <Text key={w} style={styles.warnText}>
                • {w}
              </Text>
            ))}
          </View>
        )}

        <Text style={styles.section}>
          Precios — D {prices.diesel} / R {prices.regular} / S {prices.super}
        </Text>
        <CashTableEditor cash={cash} onChange={setCash} />

        {caseType === 'normal' && (
          <>
            <MeterTableEditor
              title="Litros del día"
              rows={dayMeters}
              onChange={(r, f, v) => setMeterCell('day', r, f, v)}
            />
            <MeterTableEditor
              title="Litros almuerzo"
              rows={lunchMeters}
              onChange={(r, f, v) => setMeterCell('lunch', r, f, v)}
            />
            {resultA && (
              <View style={styles.card}>
                <Text style={styles.section}>Litros dispensados (día − almuerzo)</Text>
                {resultA.netLiters.map((n, i) => (
                  <Text key={i} style={styles.line}>
                    {machineLabel(i)}: {n}
                  </Text>
                ))}
                <Text style={styles.section}>Dinero por combustible</Text>
                {(['diesel', 'regular', 'super'] as const).map((f) => (
                  <Text key={f} style={styles.line}>
                    {FUEL_LABELS[f]}: {resultA.moneyByFuel[f].toLocaleString()}
                  </Text>
                ))}
              </View>
            )}
          </>
        )}

        {caseType === 'almuercero' && (
          <>
            {quads.map((table, qi) => (
              <MeterTableEditor
                key={qi}
                title={`Almuerzo ${qi + 1}`}
                rows={table}
                onChange={(r, f, v) =>
                  setMeterCell(`quad-${qi}` as `quad-${number}`, r, f, v)
                }
              />
            ))}
            {resultB && (
              <View style={styles.card}>
                <Text style={styles.section}>Dinero por almuerzo</Text>
                {resultB.moneyByLunch.map((m, i) => (
                  <Text key={i} style={styles.line}>
                    Alm {i + 1}: {m.toLocaleString()}
                  </Text>
                ))}
              </View>
            )}
          </>
        )}

        <PrimaryButton
          label="Ver resultado"
          onPress={() => router.push('/result')}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: { fontWeight: '700', fontSize: 15, color: colors.text },
  line: { color: colors.text, fontSize: 13 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  warnBox: {
    backgroundColor: '#fff3e0',
    borderRadius: 8,
    padding: 12,
    gap: 4,
  },
  warnTitle: { fontWeight: '700', color: colors.warn },
  warnText: { color: colors.text, fontSize: 13 },
});
