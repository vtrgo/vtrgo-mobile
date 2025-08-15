import React, { createContext, useState, useEffect, useContext } from 'react';
import { Appearance } from 'react-native';
import { lightTheme, darkTheme } from '../theme';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: typeof lightTheme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  themeMode: 'system',
  setThemeMode: () => {},
});

export const ThemeProvider: React.FC = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [theme, setTheme] = useState(lightTheme);

  const updateTheme = (mode: ThemeMode) => {
    setThemeModeState(mode);
    if (mode === 'system') {
      const colorScheme = Appearance.getColorScheme() ?? 'light';
      setTheme(colorScheme === 'dark' ? darkTheme : lightTheme);
    } else {
      setTheme(mode === 'dark' ? darkTheme : lightTheme);
    }
  };

  useEffect(() => {
    if (themeMode === 'system') {
      const subscription = Appearance.addChangeListener(({ colorScheme }) => {
        setTheme(colorScheme === 'dark' ? darkTheme : lightTheme);
      });
      return () => subscription.remove();
    }
  }, [themeMode]);

  return (
    <ThemeContext.Provider value={{ theme, themeMode, setThemeMode: updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
