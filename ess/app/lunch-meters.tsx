import { ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { CameraCaptureButton } from '@/src/components/CameraCaptureButton';
import { MeterTableEditor } from '@/src/components/MeterTableEditor';
import { PrimaryButton, Screen, Subtitle, Title } from '@/src/components/ui';
import { useEssStore } from '@/src/store/essStore';

export default function LunchMetersScreen() {
  const router = useRouter();
  const rows = useEssStore((s) => s.lunchMeters);
  const setMeterCell = useEssStore((s) => s.setMeterCell);
  const replaceMeterTable = useEssStore((s) => s.replaceMeterTable);

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ gap: 12, paddingBottom: 40 }}>
        <Title>Litros de almuerzo</Title>
        <Subtitle>
          Litros que alguien más dispensó en tu hora de almuerzo. Se restarán
          de los del día.
        </Subtitle>

        <CameraCaptureButton
          kind="meters"
          tableKey="lunch"
          onMeters={(table) => replaceMeterTable('lunch', table)}
        />

        <MeterTableEditor
          rows={rows}
          onChange={(row, field, value) =>
            setMeterCell('lunch', row, field, value)
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
