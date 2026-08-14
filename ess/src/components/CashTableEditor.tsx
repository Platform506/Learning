import { StyleSheet, Text, View } from 'react-native';
import { NumberField, colors } from './ui';
import {
  CASH_KEYS,
  CASH_LABELS,
  CashBreakdown,
  CashKey,
} from '../domain/types';
import { cashTotal } from '../domain/calc';

type Props = {
  cash: CashBreakdown;
  onChange: (key: CashKey, value: number) => void;
};

export function CashTableEditor({ cash, onChange }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Text style={[styles.cell, styles.headerText, { flex: 1.4 }]}>Dato</Text>
        <Text style={[styles.cell, styles.headerText]}>Datos Pistero</Text>
      </View>
      {CASH_KEYS.map((key, i) => (
        <View
          key={key}
          style={[styles.row, i % 2 === 1 && styles.zebra]}
        >
          <Text style={[styles.cell, { flex: 1.4, textAlign: 'left' }]}>
            {CASH_LABELS[key]}
          </Text>
          <NumberField
            value={cash[key] || null}
            onChange={(v) => onChange(key, v ?? 0)}
            style={{ flex: 1 }}
          />
        </View>
      ))}
      <View style={[styles.row, styles.totalRow]}>
        <Text style={[styles.cell, { flex: 1.4, textAlign: 'left', fontWeight: '700' }]}>
          Total
        </Text>
        <Text style={[styles.cell, { fontWeight: '700' }]}>
          {cashTotal(cash).toLocaleString()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { borderRadius: 6, overflow: 'hidden' },
  header: {
    flexDirection: 'row',
    backgroundColor: colors.header,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  headerText: { color: '#fff', fontWeight: '700' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  zebra: { backgroundColor: colors.zebra },
  totalRow: { backgroundColor: '#e8f5e9' },
  cell: { flex: 1, color: colors.text, textAlign: 'right' },
});
