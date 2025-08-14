import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useColorScheme } from 'react-native';
import "./global.css";

import NfcScreen from './screens/NfcScreen'; 
import HelpScreen from './screens/HelpScreen';
import SettingsScreen from './screens/SettingsScreen';
import DrawerContent from './Components/DrawerContent';
import { TestModeProvider } from './context/testModeContext';

import { lightTheme, darkTheme } from './theme';

const Drawer = createDrawerNavigator();

export default function App() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  return (
    <TestModeProvider>
      <NavigationContainer>
        <Drawer.Navigator
          drawerContent={(props) => <DrawerContent {...props} theme={theme} />}
          screenOptions={{
            headerStyle: { backgroundColor: theme.background },
            headerTintColor: theme.text,
          }}
        >
          <Drawer.Screen name="NFC" options={{ title: 'NFC Scanner' }}>
            {(props) => <NfcScreen {...props} theme={theme} />}
          </Drawer.Screen>
          <Drawer.Screen name="Help" options={{ title: 'Help & Tutorial' }}>
            {(props) => <HelpScreen {...props} theme={theme} />}
          </Drawer.Screen>
          <Drawer.Screen name="Settings" options={{ title: 'Settings' }}>
            {(props) => <SettingsScreen {...props} theme={theme} />}
          </Drawer.Screen> 
        </Drawer.Navigator>
      </NavigationContainer>

    </TestModeProvider>
  );
}
