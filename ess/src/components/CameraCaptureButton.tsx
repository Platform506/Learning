import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors } from './ui';
import { processTableImage } from '../ocr/imagePipeline';
import { Ambiguity, MeterTable } from '../domain/types';
import { useEssStore } from '../store/essStore';

type Props = {
  kind: 'meters' | 'cash';
  label?: string;
  tableKey?: 'day' | 'lunch' | `quad-${number}`;
  onMeters?: (rows: MeterTable) => void;
  onCash?: (partial: Partial<Record<string, number>>) => void;
};

export function CameraCaptureButton({
  kind,
  label = 'Tomar / elegir foto',
  tableKey = 'day',
  onMeters,
  onCash,
}: Props) {
  const [busy, setBusy] = useState(false);
  const [retakeVisible, setRetakeVisible] = useState(false);
  const [retakeMessage, setRetakeMessage] = useState('');
  const setAmbiguities = useEssStore((s) => s.setAmbiguities);

  async function pick(fromCamera: boolean) {
    const permission = fromCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a la cámara/galería.');
      return;
    }

    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({
          quality: 0.8,
          allowsEditing: false,
        })
      : await ImagePicker.launchImageLibraryAsync({
          quality: 0.8,
          allowsEditing: false,
        });

    if (result.canceled || !result.assets?.[0]?.uri) return;

    setBusy(true);
    try {
      const processed = await processTableImage(result.assets[0].uri, kind);
      if (!processed.ok) {
        setRetakeMessage(processed.message);
        setRetakeVisible(true);
        return;
      }

      if (kind === 'meters' && onMeters && processed.rows) {
        const hasData = processed.rows.some(
          (r) => r.ingreso != null || r.salida != null,
        );
        if (!hasData) {
          Alert.alert(
            'Foto aceptada',
            'La imagen se ve legible, pero el OCR automático de manuscrita es limitado. Complete o corrija la tabla a mano.',
          );
        } else {
          const amb: Ambiguity[] = [];
          processed.rows.forEach((row, i) => {
            if (row.ambiguous) {
              amb.push({
                path: `${tableKey}.${i}.salida`,
                field: 'salida',
                rowIndex: i,
                rawText: `${row.ingreso}/${row.salida}`,
                candidates: row.candidates ?? [],
              });
            }
          });
          if (amb.length) setAmbiguities(amb);
        }
        onMeters(processed.rows);
      }
      if (kind === 'cash' && onCash) {
        onCash(processed.cash ?? {});
        if (!processed.cash || Object.keys(processed.cash).length === 0) {
          Alert.alert(
            'Foto aceptada',
            'Complete los montos a mano si el OCR no pudo leerlos.',
          );
        }
      }
    } catch (e) {
      Alert.alert(
        'Error',
        e instanceof Error ? e.message : 'No se pudo procesar la imagen',
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={styles.wrap}>
      <Pressable
        style={styles.camButton}
        onPress={() =>
          Alert.alert(label, 'Elija origen', [
            { text: 'Cámara', onPress: () => pick(true) },
            { text: 'Galería', onPress: () => pick(false) },
            { text: 'Cancelar', style: 'cancel' },
          ])
        }
        disabled={busy}
      >
        {busy ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.camText}>📷 {label}</Text>
        )}
      </Pressable>

      <Modal visible={retakeVisible} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Foto poco legible</Text>
            <Text style={styles.modalBody}>{retakeMessage}</Text>
            <Pressable
              style={styles.camButton}
              onPress={() => {
                setRetakeVisible(false);
                pick(true);
              }}
            >
              <Text style={styles.camText}>Tomar de nuevo</Text>
            </Pressable>
            <Pressable
              style={styles.secondary}
              onPress={() => setRetakeVisible(false)}
            >
              <Text style={styles.secondaryText}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  camButton: {
    backgroundColor: colors.header,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  camText: { color: '#fff', fontWeight: '700' },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    gap: 12,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: colors.danger },
  modalBody: { color: colors.text, lineHeight: 20 },
  secondary: { alignItems: 'center', padding: 8 },
  secondaryText: { color: colors.muted },
});
