// SettingsScreen.tsx
import React from 'react';
import { View, Text, Switch } from 'react-native';
import { useTestMode } from '../context/testModeContext'; // new context import

export default function SettingsScreen({ theme }) {
  const { testMode, setTestMode } = useTestMode();

  return (
    <View style={{ flex: 1, backgroundColor: theme.background, padding: 16 }}>
      <Text style={{ color: theme.text, fontSize: 22, fontWeight: 'bold' }}>
        Settings
      </Text>

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
          onValueChange={setTestMode}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={testMode ? '#f5dd4b' : '#f4f3f4'}
        />
      </View>

      <Text
        style={{
          color: theme.text,
          fontSize: 14,
          marginTop: 8,
          fontStyle: 'italic',
        }}
      >
        ⚠️ Test Mode is still a work in progress
      </Text>
    </View>
  );
}
