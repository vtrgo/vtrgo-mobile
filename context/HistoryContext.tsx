import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HistoryContext = createContext();

export const HistoryProvider = ({ children }) => {
  const [history, setHistory] = useState([]);
  const [currentData, setCurrentData] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem('history');
        if (stored) setHistory(JSON.parse(stored));
      } catch (error) {
        console.error('[HistoryContext] Failed to load history:', error);
      }
    })();
  }, []);

  const saveToHistory = async (snapshot) => {
    const newEntry = {
      timestamp: new Date().toISOString(),
      projectName: snapshot.projectName || 'Untitled Project',
      floatData: snapshot.floatData || [],
      historicalData: snapshot.historicalData || {},
    };

    const updated = [newEntry, ...history];
    setHistory(updated);
    await AsyncStorage.setItem('history', JSON.stringify(updated));
  };

  const loadHistoryEntry = (timestamp) => {
    const entry = history.find(item => item.timestamp === timestamp);
    if (entry) setCurrentData(entry);
  };

  const deleteHistoryEntry = async (timestamp) => {
    const updated = history.filter(item => item.timestamp !== timestamp);
    setHistory(updated);
    await AsyncStorage.setItem('history', JSON.stringify(updated));
    if (currentData?.timestamp === timestamp) setCurrentData(null);
  };

  const clearHistory = async () => {
    setHistory([]);
    setCurrentData(null);
    await AsyncStorage.removeItem('history');
  };

  return (
    <HistoryContext.Provider
      value={{
        history,
        currentData,
        setCurrentData,
        saveToHistory,
        loadHistoryEntry,
        deleteHistoryEntry,
        clearHistory,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistoryData = () => useContext(HistoryContext);
