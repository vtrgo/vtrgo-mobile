import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TEST_MODE_KEY = 'testModeEnabled';

export const TestModeContext = createContext({
  testMode: false,
  setTestMode: (val: boolean) => {},
});

export const TestModeProvider = ({ children }) => {
  const [testMode, setTestModeState] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(TEST_MODE_KEY).then((value) => {
      if (value !== null) setTestModeState(value === 'true');
    });
  }, []);

  const setTestMode = async (val: boolean) => {
    setTestModeState(val);
    await AsyncStorage.setItem(TEST_MODE_KEY, val.toString());
  };

  return (
    <TestModeContext.Provider value={{ testMode, setTestMode }}>
      {children}
    </TestModeContext.Provider>
  );
};
