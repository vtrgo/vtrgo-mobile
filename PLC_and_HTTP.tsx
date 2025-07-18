import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ImageBackground, Dimensions, StatusBar, useColorScheme } from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';
import { BarChart } from 'react-native-chart-kit';
import { CartesianChart, Line } from 'victory-native';

const inter = require("../VictoryTest/assets/Inter_18pt-Black.ttf")

const DATA = Array.from({ length: 31 }, (_, i) => ({
  day: i,
  highTmp: 40 + 30 * Math.random(),
}));

const rng = (range: number): number => {
  return Math.floor(Math.random()*range);
};
const sampleHistoricalData = {
  labels: ['0h', '4h', '8h', '12h', '16h', '20h', '24h'],
  datasets: [
    {
      data: Array.from({ length: 7 }, () => rng(100)),
    },
  ],
};

NfcManager.start();

const statusBitLabels0 = [
  "Control Power ON", "Auto Mode", "Purge Mode", "System Idle",
  "Air Pressure OK", "System Faulted", null, null,
  null, null, null, null, null, null, null, null, "Bulk Hopper Enabled", "Bulk Hopper Level Not OK",
  "Elevator Enabled", "Elevator Level Not OK", "Cross Conveyor Enabled", "Cross Conveyor Level Not OK",
  "Orientation Enabled", "Orientation Level Not OK", "Transfer Enabled", "Transfer Level Not OK",
  "Escapement Adv. Enabled", "Escapement Ret. Enabled", null, null,
  null, null
];

const statusBitLabels1 = [
  "High Level - Lane #1", "High Level - Lane #2", "High Level - Lane #3",
  "High Level - Lane #4", "High Level - Lane #5", "High Level - Lane #6", "High Level - Lane #7",
  "High Level - Lane #8", "Not at Low Level - Lane #1", "Not at Low Level - Lane #2", "Not at Low Level - Lane #3",
  "Not at Low Level - Lane #4", "Not at Low Level - Lane #5", "Not at Low Level - Lane #6", "Not at Low Level - Lane #7",
  "Not at Low Level - Lane #8", "Jam In Orientation - Lane #1", "Jam In Orientation - Lane #2",
  "Jam In Orientation - Lane #3", "Jam In Orientation - Lane #4", "Jam In Orientation - Lane #5", "Jam In Orientation - Lane #6",
  "Jam In Orientation - Lane #7", "Jam In Orientation - Lane #8", null, null, null, null, null, null, null, null
];

const wordLabels = [
  null, null, null, null, null, null, "Time In Auto (Minutes)", "Time In Auto (Seconds)", "Time Faulted (Minutes)", "Time Faulted (Seconds)",
  "Fault Count (Any Fault)", "Last Cycle Time (ms)", "Average Cycle Time (ms)", "Bin Empty Time (Minutes)",
  "Air Track Blower Speed", null, "Low Level Time (Minutes) - Lane 1", "Low Level Time (Minutes) - Lane 2",
  "Low Level Time (Minutes) - Lane 3", "Low Level Time (Minutes) - Lane 4", "Low Level Time (Minutes) - Lane 5",
  "Low Level Time (Minutes) - Lane 6", "Low Level Time (Minutes) - Lane 7", "Low Level Time (Minutes) - Lane 8",
  null, null, null, null, null, null, null, null
];

const actualHistoricalData = {
  boolean_percentages: {
    "FeederStatusBits.AirTrackBlowerEnabled": 50,
    "FeederStatusBits.BulkElevatorConveyorEnabledFWD": 50,
    "FeederStatusBits.BulkElevatorConveyorEnabledREV": 0,
    "FeederStatusBits.BulkElevatorLowLevel": 0,
    "FeederStatusBits.OrientationSectionDriveEnabled": 0,
    "FeederStatusBits.Spare": 0,
    "FeederStatusBits.StepperEnabled": 0,
    "LevelStatusBits.HighLevel.Lane1": 50,
    "LevelStatusBits.HighLevel.Lane2": 50,
    "LevelStatusBits.HighLevel.Lane3": 0,
    "LevelStatusBits.HighLevel.Lane4": 0,
    "LevelStatusBits.HighLevel.Lane5": 0,
    "LevelStatusBits.HighLevel.Lane6": 0,
    "LevelStatusBits.HighLevel.Lane7": 0,
    "LevelStatusBits.HighLevel.Lane8": 0,
    "LevelStatusBits.NotatLowLevel.Lane1": 50,
    "LevelStatusBits.NotatLowLevel.Lane2": 50,
    "LevelStatusBits.NotatLowLevel.Lane3": 0,
    "LevelStatusBits.NotatLowLevel.Lane4": 0,
    "LevelStatusBits.NotatLowLevel.Lane5": 0,
    "LevelStatusBits.NotatLowLevel.Lane6": 0,
    "LevelStatusBits.NotatLowLevel.Lane7": 0,
    "LevelStatusBits.NotatLowLevel.Lane8": 0,
    "SystemStatusBits.AirPressureOK": 100,
    "SystemStatusBits.AutoMode": 100,
    "SystemStatusBits.ControlPowerON": 100,
    "SystemStatusBits.PurgeMode": 0,
    "SystemStatusBits.SystemFaulted": 0,
    "SystemStatusBits.SystemIdle": 0
  },
  fault_counts: {
    "FaultBits.AirPressureNotOKFault": 0,
    "FaultBits.AirTrackBlowerFault": 0,
    "FaultBits.BulkElevatorConveyorFault": 0,
    "FaultBits.JamInOrientation.Lane1": 4,
    "FaultBits.JamInOrientation.Lane2": 1,
    "FaultBits.JamInOrientation.Lane3": 4,
    "FaultBits.JamInOrientation.Lane4": 1,
    "FaultBits.JamInOrientation.Lane5": 0,
    "FaultBits.JamInOrientation.Lane6": 1,
    "FaultBits.JamInOrientation.Lane7": 0,
    "FaultBits.JamInOrientation.Lane8": 0,
    "FaultBits.JamInStorage.Lane1": 0,
    "FaultBits.JamInStorage.Lane2": 1,
    "FaultBits.JamInStorage.Lane3": 0,
    "FaultBits.JamInStorage.Lane4": 0,
    "FaultBits.JamInStorage.Lane5": 0,
    "FaultBits.JamInStorage.Lane6": 0,
    "FaultBits.JamInStorage.Lane7": 0,
    "FaultBits.JamInStorage.Lane8": 0,
    "FaultBits.OrientationSectionDriveFault": 5,
    "FaultBits.PLCtoPLCFault": 1,
    "FaultBits.StepperFault": 0
  },
  float_averages: {
    "Floats.AirTrackBlowerSpeed": 4.3836443622907,
    "Floats.OrientationSectionDrive.Temperature": 4.38339430093765,
    "Floats.OrientationSectionDrive.VibrationX": 4.38254688183467,
    "Floats.OrientationSectionDrive.VibrationY": 4.38285250796212,
    "Floats.OrientationSectionDrive.VibrationZ": 0
  }
};


const App = () => {
  const [selectedMode, setSelectedMode] = useState('live');
  const [timeRange, setTimeRange] = useState('30min');
  const [statusBits0, setStatusBits0] = useState([]);
  const [statusBits1, setStatusBits1] = useState([]);
  const [words, setWords] = useState([]);
  const [currentLaneValues, setCurrentLaneValues] = useState(Array(8).fill(0));
  const [historicalData, setHistoricalData] = useState({
  boolean_percentages: {},
  fault_counts: {},
  float_averages: {},
  });



  const readNfc = async () => {
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      console.log('Raw tag:', JSON.stringify(tag, null, 2));
      console.log('Raw payload (hex):', Array.from(new Uint8Array(tag.ndefMessage[0].payload))
        .map(b => b.toString(16).padStart(2, '0')).join(' '));

      if (!tag.ndefMessage) return;

      const payload = new Uint8Array(tag.ndefMessage[0].payload);
      const start = payload[0] === 0x02 ? 1 : 0;
      const data = payload.slice(start);
      console.log('Full payload length:', data.length);


      // === Parse 2-byte word data ===
      const vals = [];
      for (let i = 0; i < 220; i += 2) {
        vals.push((data[i + 1] << 8) | data[i]);
      }

      const [b0, b1, b2, b3] = vals;
      const wordVals = vals.slice(4, 110);
      const cb0 = b0 | (b1 << 16);
      const cb1 = b2 | (b3 << 16);

      const disp0 = statusBitLabels0.map((l, i) => ({
        label: l,
        state: (cb0 & (1 << i)) ? 'ON' : 'OFF'
      }));
      const disp1 = statusBitLabels1.map((l, i) => ({
        label: l,
        state: (cb1 & (1 << i)) ? 'ON' : 'OFF'
      }));

      const wp = wordVals
        .map((v, i) => wordLabels[i] ? { label: wordLabels[i], value: v } : null)
        .filter(x => x);

      setStatusBits0(disp0);
      setStatusBits1(disp1);
      setWords(wp);

      const lanes = Array(8).fill(0);
      for (let ln = 1; ln <= 8; ln++) lanes[ln - 1] = wordVals[15 + ln] || 0;
      setCurrentLaneValues(lanes);

      // === Extract FLOATS ===
      const floatStartIndex = 221; // First 220 bytes = 110 words
      const floatBytes = data.slice(floatStartIndex, floatStartIndex + 228); // 57 floats
      console.log('Available float bytes:', floatBytes.length);
      const dv = new DataView(floatBytes.buffer);

      const floatLabels = [
        // 29 boolean percentages
        "FeederStatusBits.AirTrackBlowerEnabled",
        "FeederStatusBits.BulkElevatorConveyorEnabledFWD",
        "FeederStatusBits.BulkElevatorConveyorEnabledREV",
        "FeederStatusBits.BulkElevatorLowLevel",
        "FeederStatusBits.OrientationSectionDriveEnabled",
        "FeederStatusBits.Spare",
        "FeederStatusBits.StepperEnabled",
        "LevelStatusBits.HighLevel.Lane1",
        "LevelStatusBits.HighLevel.Lane2",
        "LevelStatusBits.HighLevel.Lane3",
        "LevelStatusBits.HighLevel.Lane4",
        "LevelStatusBits.HighLevel.Lane5",
        "LevelStatusBits.HighLevel.Lane6",
        "LevelStatusBits.HighLevel.Lane7",
        "LevelStatusBits.HighLevel.Lane8",
        "LevelStatusBits.NotatLowLevel.Lane1",
        "LevelStatusBits.NotatLowLevel.Lane2",
        "LevelStatusBits.NotatLowLevel.Lane3",
        "LevelStatusBits.NotatLowLevel.Lane4",
        "LevelStatusBits.NotatLowLevel.Lane5",
        "LevelStatusBits.NotatLowLevel.Lane6",
        "LevelStatusBits.NotatLowLevel.Lane7",
        "LevelStatusBits.NotatLowLevel.Lane8",
        "SystemStatusBits.AirPressureOK",
        "SystemStatusBits.AutoMode",
        "SystemStatusBits.ControlPowerON",
        "SystemStatusBits.PurgeMode",
        "SystemStatusBits.SystemFaulted",
        "SystemStatusBits.SystemIdle",

        // 23 fault counts
        "FaultBits.AirPressureNotOKFault",
        "FaultBits.AirTrackBlowerFault",
        "FaultBits.BulkElevatorConveyorFault",
        "FaultBits.JamInOrientation.Lane1",
        "FaultBits.JamInOrientation.Lane2",
        "FaultBits.JamInOrientation.Lane3",
        "FaultBits.JamInOrientation.Lane4",
        "FaultBits.JamInOrientation.Lane5",
        "FaultBits.JamInOrientation.Lane6",
        "FaultBits.JamInOrientation.Lane7",
        "FaultBits.JamInOrientation.Lane8",
        "FaultBits.JamInStorage.Lane1",
        "FaultBits.JamInStorage.Lane2",
        "FaultBits.JamInStorage.Lane3",
        "FaultBits.JamInStorage.Lane4",
        "FaultBits.JamInStorage.Lane5",
        "FaultBits.JamInStorage.Lane6",
        "FaultBits.JamInStorage.Lane7",
        "FaultBits.JamInStorage.Lane8",
        "FaultBits.OrientationSectionDriveFault",
        "FaultBits.PLCtoPLCFault",
        "FaultBits.StepperFault",

        // 5 float_averages
        "Floats.AirTrackBlowerSpeed",
        "Floats.OrientationSectionDrive.Temperature",
        "Floats.OrientationSectionDrive.VibrationX",
        "Floats.OrientationSectionDrive.VibrationY",
        "Floats.OrientationSectionDrive.VibrationZ"
      ];

      const extractedFloats = {};
      for (let i = 0; i < 57; i++) {
        extractedFloats[floatLabels[i]] = dv.getFloat32(i * 4, true); // big-endian
      }

      // === Build structured historical data ===
      const historicalData = {
        boolean_percentages: Object.fromEntries(floatLabels.slice(0, 29).map((k, i) => [k, extractedFloats[k]])),
        fault_counts: Object.fromEntries(floatLabels.slice(29, 52).map((k, i) => [k, extractedFloats[k]])),
        float_averages: Object.fromEntries(floatLabels.slice(52).map((k, i) => [k, extractedFloats[k]]))
      };

      setHistoricalData(historicalData);

    } catch (e) {
      console.warn(e);
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
  };


  const renderBarChart = () => {
    const hasData = currentLaneValues.some(v => v > 0);
    if (!hasData) return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Lane Low Level Time Comparison</Text>
        <Text style={styles.noDataText}>No data available - scan NFC to populate</Text>
      </View>
    );

    const data = { labels: ['L1','L2','L3','L4','L5','L6','L7','L8'], datasets: [{ data: currentLaneValues }]};
    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Lane Low Level Time Comparison (Minutes)</Text>
        <BarChart
          data={data}
          width={Dimensions.get('window').width - 80}
          height={250}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(34,128,176,${opacity})`,
            labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
            style: { borderRadius: 16 },
            barPercentage: 0.5,
            paddingLeft: 20
          }}
          style={[styles.chart, { marginLeft: 0 }]}
          showValuesOnTopOfBars
        />
        <View style={styles.valuesSummary}>
          <Text style={styles.summaryTitle}>Current Values:</Text>
          <View style={styles.valuesGrid}>
            {currentLaneValues.map((v, i) => (
              <View key={i} style={styles.valueItem}>
                <Text style={styles.valueLane}>Lane {i+1}</Text>
                <Text style={styles.valueNumber}>{v}m</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  return (
    <ImageBackground
      source={require('./assets/vtrfeedersolutionsinc_logo.jpg')}
      style={{ flex: 1 }}
      resizeMode="contain"
      imageStyle={{ opacity: 0.2 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
                {/* Selection Boxes */}
        <View style={styles.selectionContainer}>
          <TouchableOpacity
            style={[styles.selectionBox, selectedMode === 'live' && styles.selectionBoxActive]}
            onPress={() => setSelectedMode('live')}
          >
            <Text style={[styles.selectionText, selectedMode === 'live' && styles.selectionTextActive]}>Live Data</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.selectionBox, selectedMode === 'historical' && styles.selectionBoxActive]}
            onPress={() => setSelectedMode('historical')}
          >
            <Text style={[styles.selectionText, selectedMode === 'historical' && styles.selectionTextActive]}>Historical Data</Text>
          </TouchableOpacity>
        </View>

        {/* Date Range Selector for Historical Mode */}
        {selectedMode === 'historical' && (
          <View style={styles.rangeContainer}>
            {['30min','hour','day'].map(range => (
              <TouchableOpacity
                key={range}
                style={[styles.rangeBox, timeRange === range && styles.rangeBoxActive]}
                onPress={() => setTimeRange(range)}
              >
                <Text style={[styles.rangeText, timeRange === range && styles.rangeTextActive]}>{
                  range === '30min' ? '30 min' : range === 'hour' ? '1 hour' : '1 day'
                }</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Scan Button */}
        <TouchableOpacity style={styles.scanButton} onPress={readNfc}>
          <Text style={styles.scanButtonText}>🔄 Scan NFC</Text>
        </TouchableOpacity>

        {/* Live Data Mode */}
        {selectedMode === 'live' && (
          <>
            {/* System, Feeder, Level, Jam, Word, and Chart Cards (unchanged) */}
            <View style={styles.card}>
              <Text style={styles.header}>System Status</Text>
              {statusBits0.slice(0,16).map(({label,state},idx) => label && (
                <Text key={idx} style={styles.item}>• {label}: <Text style={state==='ON'?styles.on:styles.off}>{state==='ON'?'🟢 ON':'🔴 OFF'}</Text></Text>
              ))}
            </View>
            <View style={styles.card}>
              <Text style={styles.header}>Feeder Status</Text>
              {statusBits0.slice(16).map(({label,state},idx) => label && (
                <Text key={idx} style={styles.item}>• {label}: <Text style={state==='ON'?styles.on:styles.off}>{state==='ON'?'🟢 ON':'🔴 OFF'}</Text></Text>
              ))}
            </View>
            <View style={styles.card}>
              <Text style={styles.header}>Level Status</Text>
              {statusBits1.slice(0,16).map(({label,state},idx) => label && (
                <Text key={idx} style={styles.item}>• {label}: <Text style={state==='ON'?styles.on:styles.off}>{state==='ON'?'🟢 ON':'🔴 OFF'}</Text></Text>
              ))}
            </View>
            <View style={styles.card}>
              <Text style={styles.header}>Jam Status</Text>
              {statusBits1.slice(16).map(({label,state},idx) => label && (
                <Text key={idx} style={styles.item}>• {label}: <Text style={state==='ON'?styles.on:styles.off}>{state==='ON'?'🟢 ON':'🔴 OFF'}</Text></Text>
              ))}
            </View>
            <View style={styles.card}>
              <Text style={styles.header}>Word Values</Text>
              {words.map(({label,value},idx) => (
                <Text key={idx} style={styles.item}>• {label}: <Text style={styles.bold}>{value}</Text></Text>
              ))}
            </View>
            <View style={styles.chartsSection}>
              <Text style={styles.sectionHeader}>📊 Lane Low Level Time Comparison</Text>
              <View style={styles.card}>{renderBarChart()}</View>
            </View>
          </>
        )}

        {/* Historical Data Mode */}
        {selectedMode === 'historical' && (
          <>
            <View style={styles.card}>
              <Text style={styles.header}>Historical Trends</Text>
              <Text style={styles.item}>• Viewing: <Text style={styles.bold}>{{
                '30min': 'Last 30 minutes',
                'hour': 'Last 1 hour',
                'day': 'Last 24 hours',
              }[timeRange]}</Text></Text>
              <View style={{ height: 300 }}>
                <CartesianChart data={DATA} xKey="day" yKeys={["highTmp"]}>
                  {({ points }) => (
                    <Line points={points.highTmp} color="red" strokeWidth={3} />
                  )}
                </CartesianChart>
              </View>
            </View>
              {historicalData && (
                <>
                  <View style={styles.card}>
                    <Text style={styles.header}>Boolean Percentages</Text>
                    {Object.entries(historicalData.boolean_percentages).map(([key, val]) => (
                      <Text key={key} style={styles.item}>• {key}: <Text style={styles.bold}>{val}%</Text></Text>
                    ))}
                  </View>
                  <View style={styles.card}>
                    <Text style={styles.header}>Fault Counts</Text>
                    {Object.entries(historicalData.fault_counts).map(([key, val]) => (
                      <Text key={key} style={styles.item}>• {key}: <Text style={styles.bold}>{val}</Text></Text>
                    ))}
                  </View>
                  <View style={styles.card}>
                    <Text style={styles.header}>Float Averages</Text>
                    {Object.entries(historicalData.float_averages).map(([key, val]) => (
                      <Text key={key} style={styles.item}>• {key}: <Text style={styles.bold}>{val.toFixed(2)}</Text></Text>
                    ))}
                  </View>
                </>
              )}

          </>
        )}

      </ScrollView>
    </ImageBackground>
  );
};

export default App;

// styles unchanged


const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 40, marginBottom: 50, paddingBottom: 100 },
  selectionContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  selectionBox: { flex: 1, marginHorizontal: 5, padding: 20, borderRadius: 12, backgroundColor: '#ffffffcc', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  selectionBoxActive: { backgroundColor: '#2280b0' },
  selectionText: { fontSize: 16, fontWeight: 'bold', color: '#2280b0' },
  selectionTextActive: { color: '#fff' },
  rangeContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  rangeBox: { flex: 1, marginHorizontal: 5, paddingVertical: 10, borderRadius: 8, backgroundColor: '#ffffffcc', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  rangeBoxActive: { backgroundColor: '#2280b0' },
  rangeText: { fontSize: 14, fontWeight: '500', color: '#2280b0' },
  rangeTextActive: { color: '#fff' },
  scanButton: { backgroundColor: '#007bff', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10, alignItems: 'center', marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 3 },
  scanButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  card: { backgroundColor: '#ffffffcc', borderRadius: 16, padding: 28, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 2 },
  header: { fontSize: 18, fontWeight: 'bold', marginTop: 20 },
  item: { fontSize: 16, marginVertical: 3 },
  bold: { fontWeight: 'bold' },
  chartsSection: { marginTop: 20 },
  sectionHeader: { fontSize: 22, fontWeight: 'bold', marginTop: 20, marginBottom: 10, textAlign: 'center', color: '#2280b0' },
  chartContainer: { alignItems: 'center' },
  chartTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#2280b0' },
  chart: { marginVertical: 8, borderRadius: 16 },
  valuesSummary: { marginTop: 15, alignItems: 'center' },
  summaryTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#2280b0' },
  valuesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  valueItem: { alignItems: 'center', margin: 8, backgroundColor: '#f8f9fa', padding: 8, borderRadius: 8, minWidth: 60 },
  valueLane: { fontSize: 12, color: '#666', fontWeight: '500' },
  valueNumber: { fontSize: 14, fontWeight: 'bold', color: '#2280b0' },
  noDataText: { fontSize: 14, color: '#999', fontStyle: 'italic', textAlign: 'center', padding: 20 }
});
