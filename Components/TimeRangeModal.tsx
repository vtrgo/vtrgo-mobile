import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ranges = [
  { label: 'Last 60 Minutes', value: '-60m' },
  { label: 'Last 3 Hours', value: '-3h' },
  { label: 'Last 12 Hours', value: '-12h' },
];

export default function TimeRangeModal({ visible, onSelect, onCancel }) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>Select Time Range</Text>

          {ranges.map(({ label, value }) => (
            <TouchableOpacity
              key={value}
              style={styles.rangeButton}
              onPress={() => onSelect(value)}
            >
              <Text style={styles.rangeText}>{label}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  rangeButton: {
    padding: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    marginVertical: 6,
    width: '100%',
    alignItems: 'center',
  },
  rangeText: {
    fontSize: 16,
    fontWeight: '500',
  },
  cancelButton: {
    marginTop: 10,
  },
  cancelText: {
    color: 'red',
    fontSize: 16,
  },
});
