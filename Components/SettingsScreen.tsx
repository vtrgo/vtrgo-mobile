import React from 'react';
import { View, Text } from 'react-native';

export default function SettingsScreen({ theme }) {
  return (
    <View style={{ flex: 1, backgroundColor: theme.background, padding: 16 }}>
      <Text style={{ color: theme.text, fontSize: 22, fontWeight: 'bold' }}>Settings</Text>
      <Text style={{ color: theme.text, marginTop: 10 }}>
        Settings options will go here...
      </Text>
    </View>
  );
}
