import React, { useEffect } from 'react';
import { View, Text } from 'react-native';

interface ProgressBarProps {
  value: number; // 0 to 100
  variant?: 'success' | 'warning' | 'default';
}

export function ProgressBar({ value, variant = 'default' }: ProgressBarProps) {
  const clamped = Math.min(Math.max(value ?? 0, 0), 100);

  const bgColorMap = {
    success: 'bg-green-400',
    warning: 'bg-yellow-400',
    default: 'bg-blue-400',
  };

  const bgColor = bgColorMap[variant] || bgColorMap.default;

  useEffect(() => {
    console.log('ProgressBar Debug:');
    console.log('  raw value:', value);
    console.log('  clamped value:', clamped);
    console.log('  variant:', variant);
    console.log('  bgColor class:', bgColor);
    console.log('  width style:', `${clamped}%`);
  }, [value, variant]);

  return (
    <View
      // Added inline styles for guaranteed size & border to debug visibility
      style={{
        width: '100%',
        height: 20,
        backgroundColor: '#ccc',
        borderRadius: 10,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#999',
        marginVertical: 10,
      }}
    >
      <View
        // Temporarily replaced Tailwind class with inline styles to rule out nativewind issues
        style={{
          width: `${clamped}%`,
          height: 20,
          backgroundColor:
            variant === 'success' ? 'green' :
            variant === 'warning' ? 'yellow' :
            'blue',
          borderRadius: 10,
        }}
      />
    </View>
  );
}
