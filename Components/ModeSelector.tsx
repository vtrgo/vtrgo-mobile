import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const TAB_SPACING = 10;
const TAB_WIDTH = (SCREEN_WIDTH - 40 - TAB_SPACING) / 2;

export default function ModeSelector({ selectedMode, onSelect }) {
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: selectedMode === 'live' ? 0 : TAB_WIDTH + TAB_SPACING,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [selectedMode]);

  return (
    <View style={styles.container}>
      {/* Sliding background pill */}
      <Animated.View
        style={[
          styles.slider,
          {
            transform: [{ translateX }],
          },
        ]}
      />
      {['live', 'float'].map((mode) => {
        const isActive = selectedMode === mode;
        return (
          <TouchableOpacity
            key={mode}
            style={styles.touchBox}
            onPress={() => onSelect(mode)}
          >
            <View style={styles.box}>
              <Text style={[styles.text, isActive && styles.textActive]}>
                {mode === 'live' ? 'Live Data' : 'Float Data'}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingTop: 40,
    paddingHorizontal: 20,
    position: 'relative',
    paddingBottom: 20,
  },
  touchBox: {
    width: TAB_WIDTH,
    marginRight: TAB_SPACING,
  },
  box: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  slider: {
    position: 'absolute',
    top: '50%',
    marginTop: 12, // half of pill height
    left: 20,
    width: TAB_WIDTH,
    height: 60,
    backgroundColor: '#2280b0',
    borderRadius: 12,
    zIndex: 0,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2280b0',
  },
  textActive: {
    color: '#fff',
  },
});
