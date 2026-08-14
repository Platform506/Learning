import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import {
  PrimaryButton,
  SecondaryButton,
  Screen,
  Subtitle,
  Title,
  colors,
} from '@/src/components/ui';
import { useEssStore } from '@/src/store/essStore';

export default function HomeScreen() {
  const router = useRouter();
  const setCaseType = useEssStore((s) => s.setCaseType);
  const loadSampleA = useEssStore((s) => s.loadSampleA);
  const resetAll = useEssStore((s) => s.resetAll);

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ gap: 16, paddingBottom: 40 }}>
        <Title>Cuadratura de combustibles</Title>
        <Subtitle>
          Todo se calcula en el teléfono. Sin usuarios ni internet. Al final
          exportas un Excel.
        </Subtitle>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Caso A — Día normal</Text>
          <Text style={styles.cardBody}>
            Precios → caja → litros del día → litros de almuerzo → resultado y
            Excel.
          </Text>
          <PrimaryButton
            label="Iniciar día normal"
            onPress={() => {
              resetAll();
              setCaseType('normal');
              router.push('/prices');
            }}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Caso B — Almuercero</Text>
          <Text style={styles.cardBody}>
            Precios → caja → 4 cuadrantes de almuerzo → resultado y Excel.
          </Text>
          <PrimaryButton
            label="Iniciar almuercero"
            onPress={() => {
              resetAll();
              setCaseType('almuercero');
              router.push('/prices');
            }}
          />
        </View>

        <SecondaryButton
          label="Cargar ejemplo Caso A (planilla)"
          onPress={() => {
            loadSampleA();
            router.push('/review');
          }}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: { fontSize: 17, fontWeight: '700', color: colors.text },
  cardBody: { color: colors.muted, lineHeight: 20 },
});
