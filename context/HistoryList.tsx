import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useHistory } from './HistoryContext';

export default function HistoryList({ onLoad }) {
  const { history, deleteHistoryEntry, loadHistoryEntry } = useHistory();

  return (
    <FlatList
      data={history}
      keyExtractor={(item) => item.timestamp}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text style={styles.projectName}>{item.projectName}</Text>
          <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleString()}</Text>

          <View style={styles.buttons}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                const entry = loadHistoryEntry(item.timestamp);
                if (entry && onLoad) onLoad(entry);
              }}
            >
              <Text style={styles.buttonText}>Load</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={() => deleteHistoryEntry(item.timestamp)}
            >
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 10,
    marginVertical: 6,
    borderRadius: 8,
    backgroundColor: '#222',
  },
  projectName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  timestamp: {
    fontSize: 12,
    color: '#aaa',
  },
  buttons: {
    flexDirection: 'row',
    marginTop: 8,
  },
  button: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: '#555',
    marginRight: 6,
  },
  deleteButton: {
    backgroundColor: '#b33',
  },
  buttonText: {
    color: '#fff',
  },
});
