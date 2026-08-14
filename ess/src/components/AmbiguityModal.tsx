import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ambiguity } from '../domain/types';
import { colors } from './ui';

type Props = {
  item: Ambiguity | null;
  onChoose: (value: number) => void;
  onSkip: () => void;
};

export function AmbiguityModal({ item, onChoose, onSkip }: Props) {
  if (!item) return null;
  return (
    <Modal visible transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>Número ambiguo</Text>
          <Text style={styles.body}>
            No estamos seguros del valor en {item.path} (leído: “{item.rawText}”).
            ¿Cuál es el correcto?
          </Text>
          {item.candidates.map((c) => (
            <Pressable
              key={c}
              style={styles.option}
              onPress={() => onChoose(c)}
            >
              <Text style={styles.optionText}>{c.toLocaleString()}</Text>
            </Pressable>
          ))}
          <Pressable onPress={onSkip} style={styles.skip}>
            <Text style={styles.skipText}>Corregir después a mano</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    gap: 10,
  },
  title: { fontSize: 18, fontWeight: '700', color: colors.warn },
  body: { color: colors.text, lineHeight: 20 },
  option: {
    backgroundColor: colors.accent,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  optionText: { color: '#fff', fontWeight: '700' },
  skip: { alignItems: 'center', padding: 8 },
  skipText: { color: colors.muted },
});
