import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ModeSelector({ selectedMode, onSelect }) {
  return (
    <View style={styles.container}>
      {['live', 'float'].map((mode) => (
        <TouchableOpacity
          key={mode}
          style={[styles.box, selectedMode === mode && styles.boxActive]}
          onPress={() => onSelect(mode)}
        >
          <Text style={[styles.text, selectedMode === mode && styles.textActive]}>
            {mode === 'live' ? 'Live Data' : 'Float Data'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 40 },
  box: { flex: 1, marginHorizontal: 5, padding: 20, borderRadius: 12, backgroundColor: '#ffffffcc', alignItems: 'center' },
  boxActive: { backgroundColor: '#2280b0' },
  text: { fontSize: 16, fontWeight: 'bold', color: '#2280b0' },
  textActive: { color: '#fff' },
});