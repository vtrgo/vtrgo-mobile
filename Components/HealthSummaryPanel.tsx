import React from 'react';
import { View, Text } from 'react-native';
import { ShieldCheck, Cpu, AlertTriangle, PlayCircle, Info, Package } from 'lucide-react-native';

interface HealthSummaryPanelProps {
  historicalData: any;
  onRequestField?: (field: string) => void;
  theme: any;
  styles: any;
  sumNestedValues: (obj: any) => number;
  ProgressBar: React.ComponentType<{ value: number; variant: string }>;
}

export default function HealthSummaryPanel({
  historicalData,
  theme,
  styles,
  sumNestedValues,
  ProgressBar,
}: HealthSummaryPanelProps) {
  if (!historicalData.float_averages || !historicalData.boolean_percentages) return null;

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

  const partsPerMinute = historicalData.float_averages.Performance?.PartsPerMinute;
  const totalParts = historicalData.float_averages.Performance?.SystemTotalParts;
  const autoMode = historicalData.boolean_percentages.SystemStatusBits?.AutoMode;

  // Helper to render fault counts recursively
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

  // Render system status properly
  const renderSystemStatus = (statusObj: any) => {
    const topLevelKey = 'SystemStatusBits';
    const entriesToRender = statusObj[topLevelKey] || statusObj;

    return (
      <View style={{ marginTop: 16 }}>
        <Text style={styles.header}>System Status</Text>
        {Object.entries(entriesToRender).map(([key, value]) => (
        <View
          key={key}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 6,
          }}
        >
          <View
            style={{
              width: 20,          // bigger circle
              height: 20,
              borderRadius: 10,   // perfectly round
              backgroundColor: value ? 'green' : 'red',
              marginRight: 8,     // spacing between circle and text
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

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <ShieldCheck size={32} color={theme.header} strokeWidth={2} />
        <Text style={styles.header}>
          System Health Summary{'\n'}
          <Text style={styles.item}>
            A high-level overview of the system's health.
          </Text>
        </Text>
      </View>

      {/* Parts per minute */}
      <View style={styles.healthSummaryRow}>
        <View style={styles.leftGroup}>
          <Cpu size={16} color={theme.header} strokeWidth={2} />
          <Text style={[styles.item, { marginLeft: 6 }]}>Parts Per Minute:</Text>
        </View>
        <Text style={[styles.item, styles.bold]}>
          {partsPerMinute != null ? partsPerMinute.toFixed(1) : 'N/A'}
        </Text>
      </View>

      {/* Total parts */}
      <View style={styles.healthSummaryRow}>
        <View style={styles.leftGroup}>
          <Package size={16} color={theme.header} strokeWidth={2} />
          <Text style={[styles.item, { marginLeft: 6 }]}>Total Parts:</Text>
        </View>
        <Text style={[styles.item, styles.bold]}>
          {totalParts != null ? Math.round(totalParts).toLocaleString() : '0'}
        </Text>
      </View>

      {/* Automatic mode */}
      <View style={styles.healthSummaryRow}>
        <View style={styles.leftGroup}>
          <PlayCircle size={16} color={theme.header} strokeWidth={2} />
          <Text style={[styles.item, { marginLeft: 6 }]}>Automatic Mode:</Text>
        </View>
        <Text style={[styles.item, styles.bold]}>
          {autoMode != null ? autoMode.toFixed(1) + '%' : '0%'}
        </Text>
      </View>

      {autoMode != null && (
        <ProgressBar
          value={autoMode}
          variant={autoMode >= 75 ? 'success' : autoMode >= 50 ? 'warning' : 'danger'}
        />
      )}

      {/* Faults */}
      <View style={styles.healthSummaryRow}>
        <View style={styles.leftGroup}>
          <AlertTriangle size={16} color={theme.header} strokeWidth={2} />
          <Text style={[styles.item, { marginLeft: 6 }]}>Faults:</Text>
        </View>
        <Text style={[styles.item, styles.bold]}>{faults}</Text>
      </View>

      {/* Warnings */}
      <View style={styles.healthSummaryRow}>
        <View style={styles.leftGroup}>
          <Info size={16} color={theme.header} strokeWidth={2} />
          <Text style={[styles.item, { marginLeft: 6 }]}>Warnings:</Text>
        </View>
        <Text style={[styles.item, styles.bold]}>{warnings}</Text>
      </View>

      {/* System Status */}
      {historicalData.boolean_percentages?.SystemStatusBits &&
        renderSystemStatus(historicalData.boolean_percentages)}

      {/* Fault count details */}
      {historicalData.fault_counts && (
        <>
          <Text style={[styles.header, { marginTop: 20 }]}>Fault Counts Details</Text>
          {typeof historicalData.fault_counts === 'object' &&
          Object.values(historicalData.fault_counts)[0] &&
          typeof Object.values(historicalData.fault_counts)[0] === 'object' ? (
            Object.entries(historicalData.fault_counts).map(([group, groupEntries]) => (
              <View key={group} style={{ marginBottom: 12 }}>
                <Text style={styles.subheader}>
                  {group.replace(/([A-Z])/g, ' $1').trim()}
                </Text>
                {typeof groupEntries === 'object' ? (
                  Object.entries(groupEntries).map(([key, value]) => (
                    <View key={key} style={styles.itemRow}>
                      <Text style={styles.item}>
                        • {key.replace(/([A-Z])/g, ' $1').trim()}:{" "}
                        <Text style={styles.bold}>{renderFaultValue(value)}</Text>
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.item}>{groupEntries.toString()}</Text>
                )}
              </View>
            ))
          ) : (
            Object.entries(historicalData.fault_counts).map(([key, value], idx) => (
              <View key={key + idx} style={styles.itemRow}>
                <Text style={styles.item}>
                  • {key.replace(/([A-Z])/g, ' $1').trim()}:{" "}
                  <Text style={styles.bold}>{value}</Text>
                </Text>
              </View>
            ))
          )}
        </>
      )}
    </View>
  );
}
