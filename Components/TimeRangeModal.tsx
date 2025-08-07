import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createStyles } from '../styles';
import { lightTheme, darkTheme } from '../theme';

const ranges = [
  { label: 'Last 60 Minutes', value: '-60m' },
  { label: 'Last 3 Hours', value: '-3h' },
  { label: 'Last 12 Hours', value: '-12h' },
];

export default function TimeRangeModal({ visible, onSelect, onCancel, theme }) {
  const styles = createStyles(theme);
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