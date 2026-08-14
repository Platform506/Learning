import { useState } from 'react';
import { ScrollView, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { CameraCaptureButton } from '@/src/components/CameraCaptureButton';
import { MeterTableEditor } from '@/src/components/MeterTableEditor';
import { PrimaryButton, Screen, Subtitle, Title } from '@/src/components/ui';
import { useEssStore } from '@/src/store/essStore';

export default function QuadrantsScreen() {
  const router = useRouter();
  const quads = useEssStore((s) => s.lunchQuadrants);
  const setMeterCell = useEssStore((s) => s.setMeterCell);
  const replaceMeterTable = useEssStore((s) => s.replaceMeterTable);
  const [active, setActive] = useState(0);

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ gap: 12, paddingBottom: 40 }}>
        <Title>4 cuadrantes de almuerzo</Title>
        <Subtitle>
          Cada cuadrante: Diesel/Regular/Super × 4 máquinas. Solo ingreso y
          salida del papel; total calculado.
        </Subtitle>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[0, 1, 2, 3].map((i) => (
            <PrimaryButton
              key={i}
              label={`Almuerzo ${i + 1}${active === i ? ' ✓' : ''}`}
              onPress={() => setActive(i)}
            />
          ))}
        </ScrollView>

        <Text style={{ fontWeight: '700' }}>Editando Almuerzo {active + 1}</Text>

        <CameraCaptureButton
          kind="meters"
          tableKey={`quad-${active}`}
          label={`Foto Almuerzo ${active + 1}`}
          onMeters={(table) =>
            replaceMeterTable(`quad-${active}` as `quad-${number}`, table)
          }
        />

        <MeterTableEditor
          title={`Almuerzo ${active + 1}`}
          rows={quads[active]}
          onChange={(row, field, value) =>
            setMeterCell(`quad-${active}` as `quad-${number}`, row, field, value)
          }
        />

        <PrimaryButton
          label="Siguiente — Revisión"
          onPress={() => router.push('/review')}
        />
      </ScrollView>
    </Screen>
  );
}
