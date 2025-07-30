import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function FloatDataList({ data }) {
  const [collapsed, setCollapsed] = useState(true);

  if (!data?.length) {
    return <Text style={styles.noData}>No float data. Tap "Scan Float Data".</Text>;
  }

  return (
    <View>
      <TouchableOpacity onPress={() => setCollapsed(!collapsed)}>
        <Text style={styles.header}>
          Data Points {collapsed ? '▸' : '▾'}
        </Text>
      </TouchableOpacity>

      {!collapsed &&
        data.map((item, index) => (
          <Text key={index} style={styles.item}>
            • {new Date(item.time).toLocaleTimeString()}: <Text style={styles.bold}>{item.value.toFixed(2)}</Text>
          </Text>
        ))
      }
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  item: {
    fontSize: 16,
    marginVertical: 3,
  },
  bold: {
    fontWeight: 'bold',
  },
  noData: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
  },
});
