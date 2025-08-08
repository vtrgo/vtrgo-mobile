import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { createStyles } from '../styles';

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

  // Format value (you can customize if needed)
  const formatValue = (sectionTitle, key, value) => {
    if (typeof value === 'number') {
      // Round to 2 decimals
      value = value.toFixed(2);
    }
    // Check keys for specific units
    if (key.toLowerCase().includes('temperature')) {
      return `${value} °C`;
    }
    if (key.toLowerCase().includes('voltage')) {
      return `${value}`; // could append " V" if raw number (adjust as needed)
    }
    if (key.toLowerCase().includes('current')) {
      return `${value}`; // e.g. " A"
    }
    if (sectionTitle === 'boolean_percentages') {
      return `${value}%`;
    }
    return value;
  };

  const renderRow = (sectionTitle, group, key, value, idx) => (
    <View key={key + idx} style={styles.itemRow}>
      <Text style={styles.item}>
        • {key.replace(/([A-Z])/g, ' $1').trim()}:{" "}
        <Text style={styles.bold}>{formatValue(sectionTitle, key, value)}</Text>
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

  // Render System Health Summary + Fault Counts details inside
  const renderSystemHealthSummary = () => {
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

    return (
      <View style={styles.card}>
        <Text style={styles.header}>System Health Summary</Text>
        <Text style={styles.subheader}>Overall status for the last Past 1 hour.</Text>

        <View style={styles.healthSummaryRow}>
          <Text style={styles.item}>• Parts Per Minute:</Text>
          <Text style={[styles.item, styles.bold]}>
            {partsPerMinute != null ? partsPerMinute.toFixed(1) : 'N/A'}
          </Text>
        </View>

        <View style={styles.healthSummaryRow}>
          <Text style={styles.item}>• Total Parts:</Text>
          <Text style={[styles.item, styles.bold]}>
            {totalParts != null ? Math.round(totalParts).toLocaleString() : '0'}
          </Text>
        </View>

        <View style={styles.healthSummaryRow}>
          <Text style={styles.item}>• Automatic Mode:</Text>
          <Text style={[styles.item, styles.bold]}>
            {autoMode != null ? autoMode.toFixed(1) + '%' : '0%'}
          </Text>
        </View>

        <View style={styles.healthSummaryRow}>
          <Text style={styles.item}>• Faults:</Text>
          <Text style={[styles.item, styles.bold]}>{faults}</Text>
        </View>

        <View style={styles.healthSummaryRow}>
          <Text style={styles.item}>• Warnings:</Text>
          <Text style={[styles.item, styles.bold]}>{warnings}</Text>
        </View>

        {/* Detailed Fault Counts section inside System Health Summary */}
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
                  {Object.entries(groupEntries).map(([key, value], idx) =>
                    renderRow('fault_counts', group, key, value, idx)
                  )}
                </View>
              ))
            ) : (
              Object.entries(historicalData.fault_counts).map(([key, value], idx) =>
                renderRow('fault_counts', null, key, value, idx)
              )
            )}
          </>
        )}
      </View>
    );
  };

  // Render Feeder Details Card
  const renderFeederDetails = () => {
    if (!historicalData.project_meta) return null;

    return (
      <View style={styles.card}>
        <Text style={styles.header}>{historicalData.project_meta['Project Name']}</Text>
        <Text style={styles.subheader}>{historicalData.project_meta['Project Description']}</Text>
        <Text style={styles.subheader}>
          Manufactured by: {historicalData.project_meta['Manufacturer']} ({historicalData.project_meta['Created On']})
        </Text>
        <Text style={styles.subheader}>Serial #{historicalData.project_meta['Project Number']}</Text>

        <Text style={[styles.subheader, { marginTop: 16 }]}>ELECTRICAL SPECIFICATIONS</Text>

        <View style={styles.specsContainer}>
          <View style={styles.specsRow}>
            <Text style={styles.item}>Input Voltage:</Text>
            <Text style={[styles.item, styles.bold]}>{historicalData.project_meta['Input Voltage']}</Text>
          </View>
          <View style={styles.specsRow}>
            <Text style={styles.item}>Input Phase:</Text>
            <Text style={[styles.item, styles.bold]}>{historicalData.project_meta['Input Phase']}</Text>
          </View>
          <View style={styles.specsRow}>
            <Text style={styles.item}>Input Frequency:</Text>
            <Text style={[styles.item, styles.bold]}>{historicalData.project_meta['Input Frequency']}</Text>
          </View>
          <View style={styles.specsRow}>
            <Text style={styles.item}>Input Current:</Text>
            <Text style={[styles.item, styles.bold]}>{historicalData.project_meta['Input Current']}</Text>
          </View>
          <View style={styles.specsRow}>
            <Text style={styles.item}>Control Voltage:</Text>
            <Text style={[styles.item, styles.bold]}>{historicalData.project_meta['Control Voltage']}</Text>
          </View>
          <View style={styles.specsRow}>
            <Text style={styles.item}>Output Power:</Text>
            <Text style={[styles.item, styles.bold]}>{historicalData.project_meta['Output Power']}</Text>
          </View>
          <View style={styles.specsRow}>
            <Text style={styles.item}>Enclosure Rating:</Text>
            <Text style={[styles.item, styles.bold]}>{historicalData.project_meta['Enclosure Rating']}</Text>
          </View>
        </View>
      </View>
    );
  };

  // Render detailed cards for boolean_percentages, float_averages
  const renderNestedDetailCard = (sectionTitle, entries) => {
    if (!entries) return null;

    return (
      <View key={sectionTitle} style={styles.card}>
        <Text style={styles.header}>
          {sectionTitle.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </Text>

        {typeof entries === 'object' &&
        Object.values(entries)[0] &&
        typeof Object.values(entries)[0] === 'object' ? (
          Object.entries(entries).map(([group, groupEntries]) => (
            <View key={group}>
              <Text style={styles.subheader}>
                {group.replace(/([A-Z])/g, ' $1').trim()}
              </Text>

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
    );
  };

  // Render other data sections excluding all handled above
  const renderOtherDataSections = () => {
    return Object.entries(historicalData)
      .filter(
        ([sectionKey]) =>
          ![
            'project_meta',
            'float_averages',
            'boolean_percentages',
            'fault_counts',
          ].includes(sectionKey)
      )
      .map(([sectionTitle, entries]) => (
        <View key={sectionTitle} style={styles.card}>
          <Text style={styles.header}>
            {sectionTitle.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </Text>

          {typeof entries === 'object' &&
          Object.values(entries)[0] &&
          typeof Object.values(entries)[0] === 'object' ? (
            Object.entries(entries).map(([group, groupEntries]) => (
              <View key={group}>
                <Text style={styles.subheader}>
                  {group.replace(/([A-Z])/g, ' $1').trim()}
                </Text>

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
      {renderSystemHealthSummary()}
      {renderNestedDetailCard('boolean_percentages', historicalData.boolean_percentages)}
      {renderNestedDetailCard('float_averages', historicalData.float_averages)}
      {renderOtherDataSections()}
    </>
  );
}
