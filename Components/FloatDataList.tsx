import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { createStyles } from '../styles'; // adjust path to where your styles.ts is

function getMs(item: any): number {
  const raw = item?.timestamp ?? item?.time;
  if (raw == null) return NaN;

  if (typeof raw === 'number') return raw;

  if (typeof raw === 'string') {
    const s = raw.trim();
    if (/^\d+$/.test(s)) return Number(s);             // numeric string ms
    const parsed = Date.parse(s);                       // ISO or date-like string
    return Number.isNaN(parsed) ? NaN : parsed;
  }

  return NaN;
}

export default function FloatDataList({ data, theme }) {
  const styles = createStyles(theme);
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    const len = Array.isArray(data) ? data.length : 0;
    (data ?? []).slice(0, 5).forEach((item, i) => {
      const raw = item?.timestamp ?? item?.time;
      const ms = getMs(item);
    });
  }, [data]);

  if (!data?.length) {
    return <Text style={styles.noData}>No float data. Tap "Scan Float Data".</Text>;
  }

  return (
    <View>
      <TouchableOpacity onPress={() => setCollapsed(!collapsed)}>
        <Text style={styles.header}>
          Data Points {collapsed ? '▸' : '▾'}
        </Text>
      </TouchableOpacity>

      {!collapsed &&
        data.map((item, index) => {
          const ms = getMs(item);
          const timeStr = Number.isFinite(ms)
            ? new Date(ms).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true,
              })
                .replace(/\u202F/g, ' ') // normalize narrow no-break space
                .replace(/\./g, '')      // remove dots in a.m./p.m.
            : 'Invalid Date';

          const val = Number(item?.value);
          const valStr = Number.isFinite(val) ? val.toFixed(2) : String(item?.value ?? '—');

          return (
            <Text key={index} style={styles.item}>
              • {timeStr}: <Text style={styles.bold}>{valStr}</Text>
            </Text>
          );
        })}
    </View>
  );
}