import React from 'react';
import { View, Text } from 'react-native';
import { ProgressBar } from './ProgressBar'; // Adjust path if needed

interface HealthSummaryPanelProps {
  partsPerMinute: number;
  autoModePercentage: number;
  totalFaults: number;
}

export default function HealthSummaryPanel({
  partsPerMinute,
  autoModePercentage,
  totalFaults,
}: HealthSummaryPanelProps) {
  const autoModeVariant = autoModePercentage >= 90 ? 'success' : 'warning';
  const faultColor = totalFaults > 0 ? 'text-yellow-500' : 'text-green-500';

  return (
    <View className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md space-y-4">
      <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">System Health Summary</Text>

      <View className="flex flex-row justify-between">
        <Text className="text-gray-600 dark:text-gray-300">Parts Per Minute:</Text>
        <Text className="font-bold text-gray-900 dark:text-gray-100">{partsPerMinute.toFixed(1)}</Text>
      </View>

      <View className="flex flex-row justify-between items-center">
        <Text className="text-gray-600 dark:text-gray-300">Automatic Mode:</Text>
        <Text className="font-bold text-gray-900 dark:text-gray-100">{autoModePercentage.toFixed(1)}%</Text>
      </View>

      <ProgressBar value={autoModePercentage} variant={autoModeVariant} />

      <View className="flex flex-row justify-between">
        <Text className={`font-medium ${faultColor}`}>Total Faults:</Text>
        <Text className={`font-bold ${faultColor}`}>{totalFaults}</Text>
      </View>
    </View>
  );
}
