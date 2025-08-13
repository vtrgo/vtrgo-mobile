// TestModeContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TEST_MODE_KEY = 'testModeEnabled';
const TestModeContext = createContext({ testMode: false, setTestMode: (v: boolean) => {} });

export const TestModeProvider = ({ children }: { children: React.ReactNode }) => {
  const [testMode, setTestModeState] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(TEST_MODE_KEY).then((value) => {
      if (value !== null) setTestModeState(value === 'true');
    });
  }, []);

  const setTestMode = (v: boolean) => {
    setTestModeState(v);
    AsyncStorage.setItem(TEST_MODE_KEY, v.toString());
  };

  return (
    <TestModeContext.Provider value={{ testMode, setTestMode }}>
      {children}
    </TestModeContext.Provider>
  );
};

export const useTestMode = () => useContext(TestModeContext);
