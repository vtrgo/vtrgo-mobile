import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { createStyles } from '../styles';
import { ProgressBar } from './ProgressBar';
import { Info } from 'lucide-react-native';
import HealthSummaryPanel from './HealthSummaryPanel';

export default function LiveDataSection({ historicalData, onRequestField, theme }) {
  const styles = createStyles(theme);
  if (!historicalData) return null;

  // Recursive sum helper for faults
  function sumNestedValues(obj) {
    if (typeof obj !== 'object' || obj === null) return 0;
    return Object.values(obj).reduce((sum, val) => {
      if (typeof val === 'object') return sum + sumNestedValues(val);
      return sum + (typeof val === 'number' ? val : 0);
    }, 0);
  }

  // Format values
  const formatValue = (sectionTitle, key, value) => {
    if (typeof value === 'number') value = value.toFixed(2);
    if (key.toLowerCase().includes('temperature')) return `${value} °C`;
    if (key.toLowerCase().includes('voltage')) return `${value}`;
    if (key.toLowerCase().includes('current')) return `${value}`;
    if (sectionTitle === 'boolean_percentages') return `${value}%`;
    return value;
  };

  const formatSystemStatusValue = (value) => {
    return value ? '✅ OK' : '❌ Fault';
  };

  const getStatusColor = (value) => (value ? 'green' : 'red');

  // Render key/value rows
  const renderRow = (sectionTitle, group, key, value, idx) => (
    <View key={key + idx} style={styles.itemRow}>
      <Text style={styles.item}>
        • {key.replace(/([A-Z])/g, ' $1').trim()}:{" "}
        <Text style={[styles.bold, sectionTitle === 'system_status' && { color: getStatusColor(value) }]}>
          {sectionTitle === 'system_status' ? formatSystemStatusValue(value) : formatValue(sectionTitle, key, value)}
        </Text>
      </Text>

      {sectionTitle === 'float_averages' && group && (
        <TouchableOpacity
          style={styles.nfcButton}
          onPress={() => onRequestField(`${group}.${key}`)}
        >
          <Text style={styles.nfcButtonText}>Request Data</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // Feeder Details Card
  const renderFeederDetails = () => {
    if (!historicalData.project_meta) return null;
    return (
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Info size={30} color={theme.header} strokeWidth={2} />
          <Text style={styles.header}>{historicalData.project_meta['Project Name']}</Text>
        </View>
        <Text style={styles.subheader}>{historicalData.project_meta['Project Description']}</Text>
        <Text style={styles.subheader}>
          Manufactured by: {historicalData.project_meta['Manufacturer']} ({historicalData.project_meta['Created On']})
        </Text>
        <Text style={styles.subheader}>Serial #{historicalData.project_meta['Project Number']}</Text>

        <Text style={[styles.subheader, { marginTop: 16 }]}>ELECTRICAL SPECIFICATIONS:</Text>
        <View style={styles.specsContainer}>
          {['Input Voltage', 'Input Phase', 'Input Frequency', 'Input Current', 'Control Voltage', 'Output Power', 'Enclosure Rating'].map(key => (
            <View key={key} style={styles.specsRow}>
              <Text style={styles.item}>{key}:</Text>
              <Text style={[styles.item, styles.bold]}>{historicalData.project_meta[key]}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  // Render nested entries recursively
  const renderNestedEntries = (sectionTitle, group, entries, depth = 0) => {
    if (typeof entries !== 'object' || entries === null) return renderRow(sectionTitle, group, '', entries, 0);
    return Object.entries(entries).map(([key, value], idx) => {
      if (typeof value === 'object' && value !== null) {
        return (
          <View key={key} style={{ marginLeft: depth === 0 ? 12 : depth === 1 ? 24 : depth * 16 }}>
            <Text style={depth === 0 ? styles.subheader : styles.subSubheader}>
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </Text>
            {renderNestedEntries(sectionTitle, group ? `${group}.${key}` : key, value, depth + 1)}
          </View>
        );
      } else {
        return renderRow(sectionTitle, group, key, value, idx);
      }
    });
  };

  // Nested detail card
  const renderNestedDetailCard = (sectionTitle, entries) => {
    if (!entries) return null;
    return (
      <View key={sectionTitle} style={styles.card}>
        <Text style={styles.header}>
          {sectionTitle.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </Text>
        {renderNestedEntries(sectionTitle, null, entries)}
      </View>
    );
  };

  // System Status Card
  const renderSystemStatusCard = (systemStatus) => {
    if (!systemStatus) return null;
    return (
      <View key="system_status" style={styles.card}>
        <Text style={styles.header}>System Status</Text>
        {Object.entries(systemStatus).map(([key, value]) => (
          <View key={key} style={styles.itemRow}>
            <Text style={styles.item}>
              • {key.replace(/([A-Z])/g, ' $1').trim()}:{" "}
              <Text style={[styles.bold, { color: getStatusColor(value) }]}>
                {formatSystemStatusValue(value)}
              </Text>
            </Text>
          </View>
        ))}
      </View>
    );
  };

  // Render other sections
  const renderOtherDataSections = () => {
    return Object.entries(historicalData)
      .filter(([sectionKey]) => !['project_meta','float_averages','boolean_percentages','fault_counts','system_status'].includes(sectionKey))
      .map(([sectionTitle, entries]) => (
        <View key={sectionTitle} style={styles.card}>
          <Text style={styles.header}>
            {sectionTitle.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </Text>
          {typeof entries === 'object' && Object.values(entries)[0] && typeof Object.values(entries)[0] === 'object' ? (
            Object.entries(entries).map(([group, groupEntries]) => (
              <View key={group}>
                <Text style={styles.subheader}>{group.replace(/([A-Z])/g, ' $1').trim()}</Text>
                {Object.entries(groupEntries).map(([key, value], idx) =>
                  renderRow(sectionTitle, group, key, value, idx)
                )}
              </View>
            ))
          ) : (
            Object.entries(entries).map(([key, value], idx) =>
              renderRow(sectionTitle, null, key, value, idx)
            )
          )}
        </View>
      ));
  };

  return (
    <>
      {renderFeederDetails()}
      <HealthSummaryPanel
        historicalData={historicalData}
        theme={theme}
        styles={styles}
        sumNestedValues={sumNestedValues}
        ProgressBar={ProgressBar}
      />
      {renderNestedDetailCard('boolean_percentages', historicalData.boolean_percentages)}
      {renderNestedDetailCard('float_averages', historicalData.float_averages)}
      {renderOtherDataSections()}
    </>
  );
}
