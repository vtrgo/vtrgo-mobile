// screens/HistoryScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useHistoryData } from '../context/HistoryContext';
import { useNavigation } from '@react-navigation/native'; // ✅ add this

export default function HistoryScreen({ theme }) {
  const { history, loadHistoryEntry, deleteHistoryEntry, clearHistory } = useHistoryData();
  const [refreshFlag, setRefreshFlag] = useState(false);
  const navigation = useNavigation(); // ✅ get navigation

  const handleLoad = (timestamp) => {
    loadHistoryEntry(timestamp);   // sets currentData in context
    navigation.navigate('NFC'); // ✅ jump straight to NfcScreen
  };

  const handleDelete = async (id) => {
    await deleteHistoryEntry(id);
    setRefreshFlag(!refreshFlag);
  };

  const renderItem = ({ item }) => {
    const floatCount = item.floatData?.length || 0;
    const faultCount = Object.keys(item.historicalData?.fault_counts || {}).length;
    const booleanCount = Object.keys(item.historicalData?.boolean_percentages || {}).length;

    return (
      <View
        style={{
          backgroundColor: theme.card,
          padding: 10,
          marginBottom: 8,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: theme.text, fontWeight: 'bold', fontSize: 16 }}>
          {item.projectName || 'Untitled Project'}
        </Text>
        <Text style={{ color: theme.text, fontSize: 12 }}>
          {new Date(item.timestamp).toLocaleString()}
        </Text>
        <Text style={{ color: theme.text, fontSize: 12 }}>
          Floats: {floatCount} | Fault Counts: {faultCount} | Booleans: {booleanCount}
        </Text>

        <View style={{ flexDirection: 'row', marginTop: 8 }}>
          <TouchableOpacity style={{ marginRight: 16 }} onPress={() => handleLoad(item.timestamp)}>
            <Text style={{ color: theme.primary }}>Load</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item.timestamp)}>
            <Text style={{ color: 'red' }}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background, padding: 10 }}>
      {history.length > 0 && (
        <TouchableOpacity onPress={clearHistory} style={{ marginBottom: 10 }}>
          <Text style={{ color: 'red' }}>Clear All</Text>
        </TouchableOpacity>
      )}
      <FlatList
        data={history}
        keyExtractor={(item) => item.timestamp}
        extraData={refreshFlag}
        renderItem={renderItem}
      />
    </View>
  );
}
