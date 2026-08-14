import { ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { CashTableEditor } from '@/src/components/CashTableEditor';
import { CameraCaptureButton } from '@/src/components/CameraCaptureButton';
import { PrimaryButton, Screen, Subtitle, Title } from '@/src/components/ui';
import { useEssStore } from '@/src/store/essStore';
import { CashKey } from '@/src/domain/types';

export default function CashScreen() {
  const router = useRouter();
  const cash = useEssStore((s) => s.cash);
  const setCash = useEssStore((s) => s.setCash);
  const caseType = useEssStore((s) => s.caseType);

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ gap: 12, paddingBottom: 40 }}>
        <Title>Datos de caja</Title>
        <Subtitle>
          Foto del papel o captura manual. Si la imagen está borrosa se pedirá
          tomarla de nuevo.
        </Subtitle>

        <CameraCaptureButton
          kind="cash"
          onCash={(partial) => {
            (Object.keys(partial) as CashKey[]).forEach((key) => {
              if (partial[key] != null) setCash(key, partial[key]!);
            });
          }}
        />

        <CashTableEditor cash={cash} onChange={setCash} />

        <PrimaryButton
          label={
            caseType === 'almuercero'
              ? 'Siguiente — 4 almuerzos'
              : 'Siguiente — Litros del día'
          }
          onPress={() =>
            router.push(caseType === 'almuercero' ? '/quadrants' : '/day-meters')
          }
        />
      </ScrollView>
    </Screen>
  );
}
