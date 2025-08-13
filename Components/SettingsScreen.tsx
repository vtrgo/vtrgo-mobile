import React, { useState, useEffect } from 'react';
import { View, Text, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TEST_MODE_KEY = 'testModeEnabled';

export default function SettingsScreen({ theme }) {
  const [testMode, setTestMode] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(TEST_MODE_KEY).then((value) => {
      if (value !== null) setTestMode(value === 'true');
    });
  }, []);

  const toggleTestMode = async () => {
    const newValue = !testMode;
    setTestMode(newValue);
    await AsyncStorage.setItem(TEST_MODE_KEY, newValue.toString());
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background, padding: 16 }}>
      <Text style={{ color: theme.text, fontSize: 22, fontWeight: 'bold' }}>Settings</Text>
      
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 20,
          justifyContent: 'space-between',
        }}
      >
        <Text style={{ color: theme.text, fontSize: 18 }}>Test Mode</Text>
        <Switch
          value={testMode}
          onValueChange={toggleTestMode}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={testMode ? '#f5dd4b' : '#f4f3f4'}
        />
      </View>

      <Text style={{ color: theme.text, fontSize: 14, marginTop: 8, fontStyle: 'italic' }}>
        ⚠️ Test Mode is still a work in progress
      </Text>
    </View>
  );

}
