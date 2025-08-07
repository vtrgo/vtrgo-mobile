import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { createStyles } from '../styles';

const SCREEN_WIDTH = Dimensions.get('window').width;
const TAB_SPACING = 10;
const TAB_WIDTH = (SCREEN_WIDTH - 40 - TAB_SPACING) / 2;

export default function ModeSelector({ selectedMode, onSelect, theme }) {
  const styles = createStyles(theme);
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: selectedMode === 'live' ? 0 : TAB_WIDTH + TAB_SPACING,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [selectedMode]);

  return (
    <View style={styles.modeSelectorContainer}>
      {/* Sliding background pill */}
      <Animated.View
        style={[
          styles.modeSelectorSlider,
          {
            transform: [{ translateX }],
            width: TAB_WIDTH,
          },
        ]}
      />
      {['live', 'float'].map((mode) => {
        const isActive = selectedMode === mode;
        return (
          <TouchableOpacity
            key={mode}
            style={[styles.modeTouchBox, { width: TAB_WIDTH, marginRight: TAB_SPACING }]}
            onPress={() => onSelect(mode)}
          >
            <View style={styles.modeBox}>
              <Text style={[styles.modeText, isActive && styles.modeTextActive]}>
                {mode === 'live' ? 'Live Data' : 'Float Data'}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
