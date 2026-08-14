import { PropsWithChildren } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  View,
  StyleProp,
} from 'react-native';

export const colors = {
  header: '#1b5e20',
  headerText: '#fff',
  border: '#c8c8c8',
  zebra: '#f3f3f3',
  bg: '#f7f7f2',
  text: '#1a1a1a',
  accent: '#2e7d32',
  danger: '#b71c1c',
  warn: '#e65100',
  muted: '#666',
};

export function Screen({ children }: PropsWithChildren) {
  return <View style={styles.screen}>{children}</View>;
}

export function Title({ children }: PropsWithChildren) {
  return <Text style={styles.title}>{children}</Text>;
}

export function Subtitle({ children }: PropsWithChildren) {
  return <Text style={styles.subtitle}>{children}</Text>;
}

export function PrimaryButton({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, disabled && styles.buttonDisabled]}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
}

export function SecondaryButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.secondaryButton}>
      <Text style={styles.secondaryButtonText}>{label}</Text>
    </Pressable>
  );
}

export function NumberField({
  value,
  onChange,
  placeholder,
  warn,
  style,
}: {
  value: number | null | undefined;
  onChange: (n: number | null) => void;
  placeholder?: string;
  warn?: boolean;
  style?: StyleProp<TextStyle>;
}) {
  return (
    <TextInput
      keyboardType="number-pad"
      value={value == null || Number.isNaN(value) ? '' : String(value)}
      onChangeText={(t) => {
        const cleaned = t.replace(/[^\d]/g, '');
        onChange(cleaned === '' ? null : Number(cleaned));
      }}
      placeholder={placeholder ?? '0'}
      style={[styles.input, warn && styles.inputWarn, style]}
    />
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: 16,
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: 4,
  },
  button: {
    backgroundColor: colors.accent,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  secondaryButton: {
    borderWidth: 1,
    borderColor: colors.accent,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  secondaryButtonText: { color: colors.accent, fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#fff',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    minWidth: 72,
    textAlign: 'right',
    color: colors.text,
  },
  inputWarn: {
    borderColor: colors.warn,
    backgroundColor: '#fff8e1',
  },
});
