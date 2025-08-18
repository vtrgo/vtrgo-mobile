// context/HistoryContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HistoryContext = createContext();

export const HistoryProvider = ({ children }) => {
  const [history, setHistory] = useState([]);
  const [currentData, setCurrentData] = useState(null); // <-- loaded snapshot

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
    console.log('🔹 [HistoryContext] saveToHistory called with snapshot:', snapshot);

    const newEntry = {
      timestamp: new Date().toISOString(),
      projectName: snapshot.projectName || 'Untitled Project',
      floatData: snapshot.floatData,
      historicalData: snapshot.historicalData,
    };

    console.log('🔹 [HistoryContext] newEntry:', newEntry);

    const updated = [newEntry, ...history];
    setHistory(updated);

    await AsyncStorage.setItem('history', JSON.stringify(updated));
    console.log('🔹 [HistoryContext] History saved. Total entries:', updated.length);
  };


  const deleteHistoryEntry = async (timestamp) => {
    try {
      const updated = history.filter(item => item.timestamp !== timestamp);
      setHistory(updated);
      await AsyncStorage.setItem('history', JSON.stringify(updated));
    } catch (error) {
      console.error('[HistoryContext] Failed to delete entry:', error);
    }
  };

  const loadHistoryEntry = (timestamp) => {
    const entry = history.find(item => item.timestamp === timestamp);
    if (entry) {
      setCurrentData(entry); // <- you were using entry.data before
    }
  };


  const clearHistory = async () => {
    try {
      setHistory([]);
      await AsyncStorage.removeItem('history');
    } catch (error) {
      console.error('[HistoryContext] Failed to clear history:', error);
    }
  };

  return (
    <HistoryContext.Provider
      value={{
        history,
        currentData,
        saveToHistory,
        deleteHistoryEntry,
        clearHistory,
        loadHistoryEntry
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistoryData = () => useContext(HistoryContext);
