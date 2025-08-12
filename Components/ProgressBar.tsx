import React, { useEffect } from 'react';
import { View, Text } from 'react-native';

interface ProgressBarProps {
  value: number; // 0 to 100
  variant?: 'success' | 'warning' | 'default';
}

export function ProgressBar({ value = 0, variant = 'default' }: ProgressBarProps) {
  const clamped = Math.min(Math.max(value, 0), 100);

  // Determine fill color based on variant (or value)
  let fillColor;
  switch (variant) {
    case 'success':
      fillColor = '#22c55e'; // green-400
      break;
    case 'warning':
      fillColor = '#facc15'; // yellow-400
      break;
    case 'danger':
      fillColor = '#ef4444'; // red-500
      break;
    default:
      fillColor = '#3b82f6'; // blue-500
  }

  // Determine background (track) color based on progress value
  let backgroundColor;
  if (clamped < 30) backgroundColor = '#fdb8b8ff'; // light red (red-100)
  else if (clamped < 75) backgroundColor = '#f8e7a3ff'; // light yellow (yellow-100)
  else backgroundColor = '#c4fcc7ff'; // light green (green-100)

  return (
    <View
      style={{
        width: '100%',
        height: 20,
        backgroundColor,
        borderRadius: 10,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#999',
        marginVertical: 10,
      }}
    >
      <View
        style={{
          width: `${clamped}%`,
          height: 20,
          backgroundColor: fillColor,
          borderRadius: 10,
        }}
      />
    </View>
  );
}
