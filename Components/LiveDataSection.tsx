import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles';

export default function LiveDataSection({ historicalData, onRequestField }) {
  if (!historicalData) return null;

  return (
    <>
      {Object.entries(historicalData).map(([sectionTitle, entries]) => (
        <View key={sectionTitle} style={styles.card}>
          <Text style={styles.header}>
            {sectionTitle.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </Text>

          {typeof entries === 'object' &&
          Object.values(entries)[0] &&
          typeof Object.values(entries)[0] === 'object' ? (
            Object.entries(entries).map(([group, groupEntries]) => (
              <View key={group}>
                <Text style={styles.subheader}>
                  {group.replace(/([A-Z])/g, ' $1').trim()}
                </Text>

                {Object.entries(groupEntries).map(([key, value], idx) => (
                  <View key={idx} style={styles.itemRow}>
                    <Text style={styles.item}>
                      • {key.replace(/([A-Z])/g, ' $1').trim()}: <Text style={styles.bold}>{value}</Text>
                    </Text>

                    {sectionTitle === 'float_averages' && (
                      <TouchableOpacity
                        style={styles.nfcButton}
                        onPress={() => onRequestField(`${group}.${key}`)}
                      >
                        <Text style={styles.nfcButtonText}>Request Data</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>
            ))
          ) : (
            Object.entries(entries).map(([key, value], idx) => (
              <View key={idx} style={styles.itemRow}>
                <Text style={styles.item}>
                  • {key}: <Text style={styles.bold}>{value}</Text>
                </Text>
              </View>
            ))
          )}
        </View>
      ))}
    </>
  );
}
