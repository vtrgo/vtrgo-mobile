import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ImageBackground, Modal } from 'react-native';
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';
import { CartesianChart, Line, useChartPressState, Area } from 'victory-native';
import { Circle, LinearGradient, vec, useFont, Text as SKText } from "@shopify/react-native-skia";
import {useDerivedValue, type SharedValue} from "react-native-reanimated"
//import { LinearGradient } from 'react-native-svg';



NfcManager.start();

function ToolTip({ x, y }: { x: SharedValue<number>; y: SharedValue<number> }) {
  return <Circle cx={x} cy={y} r={8} color="black" />;
}

function printStructuredJson(data: Record<string, any>) {
  if (!data || typeof data !== 'object') {
    console.warn('Invalid or empty JSON data');
    return;
  }

  Object.entries(data).forEach(([section, content]) => {
    if (typeof content === 'object' && content !== null) {
      console.log(`\n📂 ${section}:`);
      Object.entries(content).forEach(([key, value]) => {
        if (typeof value !== 'object') {
          console.log(`   - ${key}: ${value}`);
        } else {
          console.log(`   - ${key}: [nested object]`);
        }
      });
    } else {
      console.log(`- ${section}: ${content}`);
    }
  });
}

const App = () => {
  const [selectedMode, setSelectedMode] = useState('live');
  const [timeRange, setTimeRange] = useState('-30m');
  const [floatData, setFloatData] = useState([]); // ✅ NOT null or {}
  const [formattedFloatData, setFormattedFloatData] = useState([]);
  const [graphTitle, setGraphTitle] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [currentFieldName, setCurrentFieldName] = useState(null);
  const [selectedRange, setSelectedRange] = useState(null);
  const {state, isActive} = useChartPressState({x:0, y: {value: 0}});
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [historicalData, setHistoricalData] = useState({
  boolean_percentages: {},
  fault_counts: {},
  float_averages: {},
  });

  const font = useFont(require("./roboto.ttf"), 12);
  const ttFont = useFont(require("./roboto-bold.ttf"), 18);
  const ttvalue = useDerivedValue(() => {
    return state.y.value.value.value.toFixed(2);
  }, [state]);

  useEffect(() => {
    setScrollEnabled(!isActive);
  }, [isActive]);




  const readNfc = async () => {
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      console.log('📡 Raw tag:', JSON.stringify(tag, null, 2));

      if (!tag.ndefMessage) return;

      const payloadBytes = Array.from(new Uint8Array(tag.ndefMessage[0].payload));
      console.log('📦 Raw payload (hex):', payloadBytes.map(b => b.toString(16).padStart(2, '0')).join(' '));

      const payload = new Uint8Array(tag.ndefMessage[0].payload);
      const jsonString = String.fromCharCode(...payload);

      let jsonPayload = null;
      try {
        jsonPayload = JSON.parse(jsonString);
        console.log('✅ Parsed JSON:', JSON.stringify(jsonPayload, null, 2));
      } catch (parseError) {
        console.error('❌ Failed to parse JSON:', parseError.message);
        console.log('📝 Raw string:', jsonString);
      }

      printStructuredJson(jsonPayload);
      // Optional: Store parsed JSON in state or variable
      setHistoricalData(jsonPayload);

    } catch (e) {
      console.warn(e);
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
  };
  const scanFloatTab = async () => {
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      console.log('📡 Raw tag:', JSON.stringify(tag, null, 2));

      if (!tag.ndefMessage) return;

      const payload = new Uint8Array(tag.ndefMessage[0].payload);
      const jsonString = String.fromCharCode(...payload);

      let parsedData = null;
      try {
        parsedData = JSON.parse(jsonString);

        if (
          typeof parsedData !== 'object' ||
          !parsedData.start ||
          !parsedData.interval ||
          !Array.isArray(parsedData.values)
        ) {
          throw new Error('Invalid format');
        }

        const startTime = new Date(parsedData.start).getTime(); // in ms
        const intervalMs = parsedData.interval * 1000;
        const expanded = parsedData.values.map((value, i) => ({
          time: new Date(startTime + i * intervalMs).toISOString(),
          value: value,
        }));

        console.log('✅ Expanded Float Data:', expanded);

        setFloatData(expanded);

        const formattedData = expanded.map(d => ({
          ...d,
          timestamp: new Date(d.time).getTime(),
        }));

        setFormattedFloatData(formattedData);
      } catch (parseError) {
        console.error('❌ Failed to parse compact float data:', parseError.message);
        console.log('📝 Raw string:', jsonString);
      }
    } catch (e) {
      console.warn('⚠️ NFC error:', e);
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
  };

  const writeNfcFloatRequest = async (fieldName, range = timeRange) => {
    const payload = {
      cmd: "float_range",
      field: fieldName,
      start: range, // ✅ use passed value
      stop: "now()",
    };

    console.log("📝 Writing NFC payload:", JSON.stringify(payload, null, 2));
    setGraphTitle(fieldName);

    try {
      await NfcManager.cancelTechnologyRequest().catch(() => null);
      await NfcManager.requestTechnology(NfcTech.Ndef);

      const bytes = Ndef.encodeMessage([
        Ndef.textRecord(JSON.stringify(payload))
      ]);

      await NfcManager.ndefHandler.writeNdefMessage(bytes);
      console.log("✅ NFC write successful");
    } catch (err) {
      console.warn("❌ NFC write error:", err);
    } finally {
      await NfcManager.cancelTechnologyRequest().catch(() => null);
    }
  };

  return (
    <ImageBackground
      source={require('./assets/vtrfeedersolutionsinc_logo.jpg')}
      style={{ flex: 1 }}
      resizeMode="contain"
      imageStyle={{ opacity: 0.2 }}
    >
        {/* Sticky Header */}
        <View style={[styles.selectionContainer, { backgroundColor: '#fff', paddingTop: 40, zIndex: 10 }]}>
          {['live','float'].map(mode => (
            <TouchableOpacity
              key={mode}
              style={[styles.selectionBox, selectedMode === mode && styles.selectionBoxActive]}
              onPress={() => setSelectedMode(mode as any)}
            >
              <Text style={[styles.selectionText, selectedMode === mode && styles.selectionTextActive]}>
                {mode === 'live' ? 'Live Data' : mode === 'float' ? 'Float Data' : 'Historic Data'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      <ScrollView contentContainerStyle={styles.container} scrollEnabled={scrollEnabled}>
          {/* Float Data Tab */}
          <Text style={styles.header}>Float Data</Text>
          <TouchableOpacity style={styles.floatScanButton} onPress={scanFloatTab}>
              <Text style={styles.scanButtonText}>🔄 Scan Float Data</Text>
          </TouchableOpacity>
          {selectedMode === 'float' && (
            
            <View style={styles.card}>
              {graphTitle !== '' && (
                <Text style={styles.header}>
                  {graphTitle.replace(/\./g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Text>
              )}

              <View style={{ height: 300}}>
                <CartesianChart
                  chartPressState={state}
                  data={formattedFloatData}
                  xKey="timestamp"
                  yKeys={["value"]}
                  domainPadding={{ bottom: 50, right: 15 }}
                  xAxis={{
                    font,
                    labelRotate: -45,
                    labelPosition: 'inset',
                    formatXLabel: (label) =>
                      new Date(label).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      }).replace(/\s/g, ' '),
                  }}
                  yAxis={[
                    {
                      font,
                      labelPosition: 'outset',
                      domain: [0],
                    },
                  ]}
                >
                  {({ points, chartBounds }) => (
                    <>
                      <SKText
                        x={20}
                        y={15}
                        font={ttFont}
                        text={ttvalue}
                        color={"red"}
                        style={"fill"}
                      />
                      <Area
                        points={points.value}
                        y0={chartBounds.bottom}
                        animate={{ type: "timing", duration: 500 }}
                      >
                        <LinearGradient
                          start={vec(chartBounds.left, chartBounds.top)}
                          end={vec(chartBounds.left, chartBounds.bottom)}
                          colors={["#ff000091", "#ff000000"]}
                        />
                      </Area>
                      <Line
                        points={points.value}
                        color="red"
                        strokeWidth={3}
                        animate={{ type: "timing", duration: 500 }}
                      />
                      {isActive && (
                        <ToolTip
                          x={state.x.position}
                          y={state.y.value.position}
                          leftBound={chartBounds.left}
                          rightBound={chartBounds.right}
                        />
                      )}
                    </>
                  )}

                </CartesianChart>



              </View>
              <Text style={styles.header}>Data Points</Text>
              {floatData.length > 0 ? (
              <View>
                {floatData.map((item, index) => (
                  <Text key={index} style={styles.item}>
                    • {new Date(item.time).toLocaleTimeString()}: <Text style={styles.bold}>{item.value.toFixed(2)}</Text>
                  </Text>
                ))}
              </View>

              ) : (
                <Text style={styles.noDataText}>No float data. Tap "Scan Float Data".</Text>
              )}
            </View>
          )}

        <Modal visible={modalVisible} transparent animationType="slide">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Time Range</Text>

                {[
                  { label: 'Last 60 Minutes', value: '-60m' },
                  { label: 'Last 3 Hours', value: '-3h' },
                  { label: 'Last 12 hours', value: '-12h' },
                ].map(({ label, value }) => (
                  <TouchableOpacity
                    key={value}
                    style={styles.rangeButton}
                    onPress={() => {
                      setSelectedRange(value);
                      setModalVisible(false);
                      writeNfcFloatRequest(currentFieldName, value); // 🟡 ← Pass selected range
                    }}

                  >
                    <Text style={styles.rangeText}>{label}</Text>
                  </TouchableOpacity>
                ))}

                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

        {/* Scan Button */}
        <TouchableOpacity style={styles.scanButton} onPress={readNfc}>
          <Text style={styles.scanButtonText}>🔄 Scan NFC</Text>
        </TouchableOpacity>


          {selectedMode === 'live' && historicalData && (
            <>
              {Object.entries(historicalData).map(([sectionTitle, entries]) => (
                <View key={sectionTitle} style={styles.card}>
                  <Text style={styles.header}>
                    {sectionTitle.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Text>
                  {Object.entries(entries).map(([key, value], idx) => (
                    <View key={idx} style={styles.itemRow}>
                      <Text style={styles.item}>
                        • {key}: <Text style={styles.bold}>{value}</Text>
                      </Text>
                      {sectionTitle === 'float_averages' && (
                      <TouchableOpacity
                        style={styles.nfcButton}
                        onPress={() => {
                          setCurrentFieldName(key); // track what float key was requested
                          setModalVisible(true);    // open range picker
                        }}
                      >
                        <Text style={styles.nfcButtonText}>Request Data</Text>
                      </TouchableOpacity>
                      )}
                    </View>
                  ))}
                </View>
              ))}
            </>
          )}
        

      </ScrollView>
    </ImageBackground>
  );
};

export default App;

// styles unchanged


const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 0, marginBottom: 50, paddingBottom: 100, },
  selectionContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  selectionBox: { flex: 1, marginHorizontal: 5, padding: 20, borderRadius: 12, backgroundColor: '#ffffffcc', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  selectionBoxActive: { backgroundColor: '#2280b0' },
  selectionText: { fontSize: 16, fontWeight: 'bold', color: '#2280b0' },
  selectionTextActive: { color: '#fff' },
  rangeContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  rangeBox: { flex: 1, marginHorizontal: 5, paddingVertical: 10, borderRadius: 8, backgroundColor: '#ffffffcc', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  rangeBoxActive: { backgroundColor: '#2280b0' },
  rangeText: { fontSize: 14, fontWeight: '500', color: '#000000ff' },
  rangeTextActive: { color: '#fff' },
  scanButton: { backgroundColor: '#007bff', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10, alignItems: 'center', marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 3 },
  scanButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  floatScanButton: {backgroundColor: '#24eb98ff', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10, alignItems: 'center', marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 3 },
  card: { backgroundColor: '#ffffffcc', borderRadius: 16, padding: 28, marginBottom: 16,  borderWidth: 15, borderColor: '#f5f5f5ff'},
  header: { fontSize: 18, fontWeight: 'bold', marginTop: 20 },
  item: { fontSize: 16, marginVertical: 3 },
  bold: { fontWeight: 'bold' },
  sectionHeader: { fontSize: 22, fontWeight: 'bold', marginTop: 20, marginBottom: 10, textAlign: 'center', color: '#2280b0' },
  noDataText: { fontSize: 14, color: '#999', fontStyle: 'italic', textAlign: 'center', padding: 20 },
  itemRow: {marginBottom: 8, paddingVertical: 6, paddingHorizontal: 4, borderBottomWidth: 0.5, borderColor: '#ccc',},
  nfcButton: {marginTop: 4, backgroundColor: '#007AFF', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, alignSelf: 'flex-start',},
  nfcButtonText: {color: '#fff',fontSize: 14,fontWeight: '600',},
  button: {padding: 12,backgroundColor: '#007AFF', borderRadius: 8, marginVertical: 10,},
  buttonText: {color: 'white', textAlign: 'center',},
  modalOverlay: {flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center',},
  modalContent: {width: '80%', backgroundColor: 'white', padding: 20, borderRadius: 12, alignItems: 'center',},
  modalTitle: {fontSize: 18, fontWeight: 'bold', marginBottom: 16,},
  rangeButton: {padding: 12, backgroundColor: '#E0E0E0', borderRadius: 6, marginVertical: 6, width: '100%', alignItems: 'center',},
  cancelButton: {marginTop: 10,},
  cancelText: {color: 'red', fontSize: 16,},
});
