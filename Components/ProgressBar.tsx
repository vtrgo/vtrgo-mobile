import React from 'react';
import { View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { createStyles } from '../styles'; // adjust import path

interface ProgressBarProps {
  value: number; // 0–100
  reverse?: boolean; // if true, flips the good/bad color logic
  theme: any; // pass theme into component
}

export function ProgressBar({ value = 0, reverse = false, theme }: ProgressBarProps) {
  const styles = createStyles(theme);

  const clamped = Math.min(Math.max(value, 0), 100);

  const pickColors = (val: number) => {
    if (val < 50) {
      return {
        colors: ['#fca5a5', '#f87171', '#ef4444'], // red
        track: '#fee2e2',
      };
    } else if (val < 75) {
      return {
        colors: ['#fde68a', '#facc15', '#ca8a04'], // yellow
        track: '#fef9c3',
      };
    } else {
      return {
        colors: ['#4ade80', '#22c55e', '#15803d'], // green
        track: '#dcfce7',
      };
    }
  };

  // If reverse is true, flip the logic by inverting the value scale
  const effectiveValue = reverse ? 100 - clamped : clamped;
  const picked = pickColors(effectiveValue);

  return (
    <View style={[styles.progressTrack, { backgroundColor: picked.track }]}>
      <LinearGradient
        colors={picked.colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.progressFill, { width: `${clamped}%` }]}
      />
    </View>
  );
}
