import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { NumberField, colors } from './ui';
import { MeterTable, machineLabel } from '../domain/types';
import { rowTotal } from '../domain/calc';

type Props = {
  title?: string;
  rows: MeterTable;
  onChange: (
    rowIndex: number,
    field: 'ingreso' | 'salida',
    value: number | null,
  ) => void;
  readOnly?: boolean;
};

export function MeterTableEditor({ title, rows, onChange, readOnly }: Props) {
  return (
    <View style={styles.wrap}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      <View style={styles.header}>
        <Text style={[styles.cell, styles.fuel, styles.headerText]}>Comb.</Text>
        <Text style={[styles.cell, styles.headerText]}>Ingreso</Text>
        <Text style={[styles.cell, styles.headerText]}>Salida</Text>
        <Text style={[styles.cell, styles.headerText]}>Total*</Text>
      </View>
      <ScrollView style={{ maxHeight: 420 }}>
        {rows.map((row, i) => {
          const total = rowTotal(row.ingreso, row.salida);
          const zebra = i % 2 === 1;
          const warn =
            row.ambiguous ||
            (row.ingreso != null &&
              row.salida != null &&
              row.salida < row.ingreso);
          return (
            <View
              key={i}
              style={[styles.row, zebra && styles.zebra, warn && styles.warnRow]}
            >
              <Text style={[styles.cell, styles.fuel]}>{machineLabel(i)}</Text>
              {readOnly ? (
                <>
                  <Text style={styles.cell}>{row.ingreso ?? ''}</Text>
                  <Text style={styles.cell}>{row.salida ?? ''}</Text>
                </>
              ) : (
                <>
                  <NumberField
                    value={row.ingreso}
                    warn={warn && row.ambiguityField === 'ingreso'}
                    onChange={(v) => onChange(i, 'ingreso', v)}
                    style={styles.field}
                  />
                  <NumberField
                    value={row.salida}
                    warn={warn && row.ambiguityField === 'salida'}
                    onChange={(v) => onChange(i, 'salida', v)}
                    style={styles.field}
                  />
                </>
              )}
              <Text style={[styles.cell, styles.total]}>
                {total == null ? '—' : total}
              </Text>
            </View>
          );
        })}
      </ScrollView>
      <Text style={styles.hint}>
        * Litros totales = salida − ingreso (calculado; no viene en el papel)
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 6 },
  title: { fontWeight: '700', fontSize: 16, color: colors.text },
  header: {
    flexDirection: 'row',
    backgroundColor: colors.header,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  headerText: { color: colors.headerText, fontWeight: '700', fontSize: 12 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 4,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  zebra: { backgroundColor: colors.zebra },
  warnRow: { backgroundColor: '#fff3e0' },
  cell: {
    flex: 1,
    fontSize: 12,
    color: colors.text,
    textAlign: 'right',
    paddingHorizontal: 2,
  },
  fuel: { flex: 1.3, textAlign: 'left', fontSize: 11 },
  total: { fontWeight: '700' },
  field: { flex: 1, marginHorizontal: 2 },
  hint: { fontSize: 11, color: colors.muted },
});
