import React from 'react';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { View, Text } from 'react-native';

export default function DrawerContent(props) {
  const { theme } = props;

  return (
    <DrawerContentScrollView {...props} style={{ backgroundColor: theme.background }}>
      <View style={{ padding: 16 }}>
        <Text style={{ color: theme.text, fontSize: 18, fontWeight: 'bold' }}>Menu</Text>
      </View>
      <DrawerItem
        label="NFC Scanner"
        labelStyle={{ color: theme.text }}
        onPress={() => props.navigation.navigate('NFC')}
      />
      <DrawerItem
        label="Help & Tutorial"
        labelStyle={{ color: theme.text }}
        onPress={() => props.navigation.navigate('Help')}
      />
      <DrawerItem
        label="Settings"
        labelStyle={{ color: theme.text }}
        onPress={() => props.navigation.navigate('Settings')}
      />
    </DrawerContentScrollView>
  );
}
