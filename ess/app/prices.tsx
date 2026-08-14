import { View } from 'react-native';
import { useRouter } from 'expo-router';
import {
  NumberField,
  PrimaryButton,
  Screen,
  Subtitle,
  Title,
} from '@/src/components/ui';
import { useEssStore } from '@/src/store/essStore';
import { FUEL_LABELS, FuelType } from '@/src/domain/types';

export default function PricesScreen() {
  const router = useRouter();
  const prices = useEssStore((s) => s.prices);
  const setPrice = useEssStore((s) => s.setPrice);

  return (
    <Screen>
      <Title>Precios actuales</Title>
      <Subtitle>Confirma o ajusta los precios del día (Imagen 1).</Subtitle>

      {(['diesel', 'regular', 'super'] as FuelType[]).map((fuel) => (
        <View
          key={fuel}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <Title>{FUEL_LABELS[fuel]}</Title>
          <NumberField
            value={prices[fuel]}
            onChange={(v) => setPrice(fuel, v ?? 0)}
            style={{ minWidth: 120 }}
          />
        </View>
      ))}

      <PrimaryButton label="Siguiente — Caja" onPress={() => router.push('/cash')} />
    </Screen>
  );
}
