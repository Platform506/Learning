import { ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { CameraCaptureButton } from '@/src/components/CameraCaptureButton';
import { MeterTableEditor } from '@/src/components/MeterTableEditor';
import { PrimaryButton, Screen, Subtitle, Title } from '@/src/components/ui';
import { useEssStore } from '@/src/store/essStore';

export default function DayMetersScreen() {
  const router = useRouter();
  const rows = useEssStore((s) => s.dayMeters);
  const setMeterCell = useEssStore((s) => s.setMeterCell);
  const replaceMeterTable = useEssStore((s) => s.replaceMeterTable);

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ gap: 12, paddingBottom: 40 }}>
        <Title>Litros del día</Title>
        <Subtitle>
          Solo ingreso y salida vienen del papel. El total lo calcula la app.
        </Subtitle>

        <CameraCaptureButton
          kind="meters"
          tableKey="day"
          onMeters={(table) => replaceMeterTable('day', table)}
        />

        <MeterTableEditor
          rows={rows}
          onChange={(row, field, value) =>
            setMeterCell('day', row, field, value)
          }
        />

        <PrimaryButton
          label="Siguiente — Litros almuerzo"
          onPress={() => router.push('/lunch-meters')}
        />
      </ScrollView>
    </Screen>
  );
}
