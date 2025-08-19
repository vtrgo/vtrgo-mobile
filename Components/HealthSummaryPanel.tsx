import React from 'react';
import { View, Text } from 'react-native';
import { ShieldCheck } from 'lucide-react-native';

interface HealthSummaryPanelProps {
  historicalData: any;
  theme: any;
  styles: any;
  sumNestedValues: (obj: any) => number;
  ProgressBar: React.ComponentType<{ value: number; reverse?: boolean }>;
}

export default function HealthSummaryPanel({
  historicalData,
  theme,
  styles,
  sumNestedValues,
  ProgressBar,
}: HealthSummaryPanelProps) {
  if (!historicalData.float_averages || !historicalData.boolean_percentages) return null;

  const cycleTime = historicalData.float_averages.Performance?.CycleTime ?? 0;
  const partsPerMinute = historicalData.float_averages.Performance?.PartsPerMinute ?? 0;
  const totalParts = Math.floor(historicalData.float_averages.Performance?.SystemTotalParts ?? 0);

  const autoMode = historicalData.boolean_percentages.SystemStatusBits?.AutoMode ?? 0;
  const eStopOk = historicalData.boolean_percentages.SystemStatusBits?.EStopOk ?? 0;
  const controlPowerOn = historicalData.boolean_percentages.SystemStatusBits?.ControlPowerOn ?? 0;
  const systemFaulted = historicalData.boolean_percentages.SystemStatusBits?.SystemFaulted ?? 0;

  // Sum total faults and warnings
  const faults = historicalData.fault_counts
    ? sumNestedValues(
        Object.entries(historicalData.fault_counts)
          .filter(([key]) => key !== 'WarningBits')
          .reduce((acc, [key, val]) => ({ ...acc, [key]: val }), {})
      )
    : 0;

  const warnings = historicalData.fault_counts?.WarningBits
    ? sumNestedValues(historicalData.fault_counts.WarningBits)
    : 0;

  // Recursive rendering for nested faults
  const renderFaultValue = (value: any): React.ReactNode => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'object') {
      return Object.entries(value).map(([k, v]) => (
        <Text key={k} style={styles.item}>
          • {k.replace(/([A-Z])/g, ' $1').trim()}: {renderFaultValue(v)}
        </Text>
      ));
    }
    return value.toString();
  };

  const renderSystemStatus = (statusObj: any) => {
    const entries = statusObj.SystemStatusBits || statusObj;
    return (
      <View style={{ marginTop: 16, flexDirection: 'row', flexWrap: 'wrap', marginLeft: 50 }}>
        {Object.entries(entries).map(([key, value]) => (
          <View
            key={key}
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                backgroundColor: value ? 'green' : 'red',
                marginRight: 8,
              }}
            />
            <Text style={styles.item}>
              {key.split('.').pop()?.replace(/([A-Z])/g, ' $1').trim()}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  // Add reverse where a HIGH value means "bad"
  const statusBars = [
    { label: 'Automatic Mode', value: autoMode, reverse: false },
    { label: 'E-Stop OK', value: eStopOk, reverse: false },
    { label: 'Control Power On', value: controlPowerOn, reverse: false },
    { label: 'System Faulted', value: systemFaulted, reverse: true }, // reversed logic
  ];

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={{ marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
          <ShieldCheck size={32} color={theme.header} strokeWidth={2} />
          <Text style={[styles.header, { marginLeft: 8 }]}>System Health Summary</Text>
        </View>
        <Text
          style={{
            fontSize: 18,
            fontWeight: '400',
            marginTop: 0,
            color: theme.header,
            textAlign: 'center',
          }}
        >
          A high-level overview of the system's health.
        </Text>
      </View>

      {/* Metrics row with cards */}
      <View style={{ flexDirection: 'row', marginBottom: 16 }}>
        <View style={[styles.metricCard, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.metricLabel}>Cycle Time</Text>
          <Text style={styles.metricValue}>{cycleTime.toFixed(1)}s</Text>
        </View>

        <View style={[styles.metricCard, { flex: 1, marginHorizontal: 4 }]}>
          <Text style={styles.metricLabel}>Parts/Min</Text>
          <Text style={styles.metricValue}>{partsPerMinute.toFixed(1)}</Text>
        </View>

        <View style={[styles.metricCard, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.metricLabel}>Total Parts</Text>
          <Text style={styles.metricValue}>{totalParts}</Text>
        </View>
      </View>

      {/* System Status bits */}
      {historicalData.boolean_percentages?.SystemStatusBits &&
        renderSystemStatus(historicalData.boolean_percentages)}

      {/* Horizontal progress bars */}
      <View style={{ marginTop: 16 }}>
        <Text style={styles.subheader}>Status for the past 1 hour</Text>
        {statusBars.map((status) => (
          <View key={status.label} style={{ marginBottom: 12 }}>
            <Text style={styles.item}>{status.label}</Text>
            <ProgressBar value={status.value} reverse={status.reverse} theme={theme} />
            <Text style={[styles.item, { marginTop: 4 }]}>{status.value.toFixed(1)}%</Text>
          </View>
        ))}
      </View>

      {/* Fault counts */}
      {historicalData.fault_counts && (
        <View style={{ marginTop: 16 }}>
          <Text style={styles.header}>Fault Counts Details</Text>
          {Object.entries(historicalData.fault_counts).map(([group, groupEntries]) => (
            <View key={group} style={{ marginBottom: 12 }}>
              <Text style={styles.subheader}>{group.replace(/([A-Z])/g, ' $1').trim()}</Text>
              {typeof groupEntries === 'object' ? (
                Object.entries(groupEntries).map(([key, value]) => (
                  <Text key={key} style={[styles.item, { marginLeft: 8 }]}>
                    • {key.replace(/([A-Z])/g, ' $1').trim()}: {renderFaultValue(value)}
                  </Text>
                ))
              ) : (
                <Text style={[styles.item, { marginLeft: 8 }]}>{groupEntries}</Text>
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
