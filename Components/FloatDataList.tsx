import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function FloatDataList({ data }) {
  if (!data?.length) {
    return <Text style={styles.noData}>No float data. Tap "Scan Float Data".</Text>;
  }

  return (
    <View>
      <Text style={styles.header}>Data Points</Text>
      {data.map((item, index) => (
        <Text key={index} style={styles.item}>
          • {new Date(item.time).toLocaleTimeString()}: <Text style={styles.bold}>{item.value.toFixed(2)}</Text>
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  item: { fontSize: 16, marginVertical: 3 },
  bold: { fontWeight: 'bold' },
  noData: { fontSize: 14, fontStyle: 'italic', color: '#777', textAlign: 'center', marginTop: 20 },
});
