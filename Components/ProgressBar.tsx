import React from "react";
import { View } from "react-native";

interface ProgressBarProps {
  value?: number | null; // 0–100
  variant?: "default" | "success" | "warning" | "destructive";
}

export function ProgressBar({ value = 0, variant = "default" }: ProgressBarProps) {
  const clamped = Math.min(Math.max(value ?? 0, 0), 100);

  // Track colors (background)
  const trackColors: Record<string, string> = {
    default: "#E5E7EB",     // gray-200
    success: "#bbf7d0",     // green-200
    warning: "#fde68a",     // yellow-200
    destructive: "#fecaca", // red-200
  };

  // Indicator colors (mimic gradient with two shades)
  const indicatorColors: Record<string, { light: string; dark: string }> = {
    default: { light: "#60a5fa", dark: "#2563eb" },     // blue-400 → blue-600
    success: { light: "#4ade80", dark: "#16a34a" },     // green-400 → green-600
    warning: { light: "#facc15", dark: "#ca8a04" },     // yellow-400 → yellow-700
    destructive: { light: "#f87171", dark: "#b91c1c" }, // red-400 → red-700
  };

  const colors = indicatorColors[variant] ?? indicatorColors["default"];
  const track = trackColors[variant] ?? trackColors["default"];

  return (
    <View
      style={{
        width: "100%",
        height: 16, // h-4
        borderRadius: 9999,
        overflow: "hidden",
        backgroundColor: track,
      }}
    >
      <View
        style={{
          width: `${clamped}%`,
          height: "100%",
          borderRadius: 9999,
          backgroundColor: colors.dark,
        }}
      />
      {/* Fake gradient highlight overlay */}
      <View
        style={{
          width: `${clamped}%`,
          height: "100%",
          borderRadius: 9999,
          backgroundColor: colors.light,
          opacity: 0.4,
          position: "absolute",
        }}
      />
    </View>
  );
}
