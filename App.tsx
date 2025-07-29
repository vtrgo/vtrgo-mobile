import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ImageBackground, Modal, Alert, ActivityIndicator, useColorScheme } from 'react-native';
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';
import { CartesianChart, Line, useChartPressState, Area, useChartTransformState } from 'victory-native';
import { Circle, LinearGradient, vec, useFont, Text as SKText } from "@shopify/react-native-skia";
import {useDerivedValue, type SharedValue} from "react-native-reanimated"

import ModeSelector from './Components/ModeSelector';
import FloatChart from './Components/FloatChart';
import FloatDataList from './Components/FloatDataList';
import NfcPromptModal from './Components/NfcPromptModal';
import TimeRangeModal from './Components/TimeRangeModal';
import LiveDataSection from './Components/LiveDataSection';
import { useNfc } from './hooks/useNfc';
import { createStyles } from './styles';
import { lightTheme, darkTheme } from './theme';

NfcManager.start();

const App = () => {
  const [selectedMode, setSelectedMode] = useState('live');
  const [timeRange, setTimeRange] = useState('-30m');
  const [floatData, setFloatData] = useState([]);
  const [formattedFloatData, setFormattedFloatData] = useState([]);
  const [graphTitle, setGraphTitle] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [currentFieldName, setCurrentFieldName] = useState(null);
  const [selectedRange, setSelectedRange] = useState(null);
  const { state, isActive } = useChartPressState({ x: 0, y: { value: 0 } });
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [nfcPromptVisible, setNfcPromptVisible] = useState(false);
  const [tooltipText, setTooltipText] = useState('');
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  const styles = createStyles(theme);

  const [historicalData, setHistoricalData] = useState({
    boolean_percentages: {},
    fault_counts: {},
    float_averages: {}
  });

  const font = useFont(require('./roboto.ttf'), 12);
  const ttFont = useFont(require('./roboto-bold.ttf'), 24);
  const ttvalue = useDerivedValue(() => {
    return state.y.value.value.value.toFixed(2);
  }, [state]);

  useEffect(() => {
    setScrollEnabled(!isActive);
  }, [isActive]);

  const transformState = useChartTransformState({
    scaleX: 1.0,
    scaleY: 1.0
  });

  useEffect(() => {
    const id = setInterval(() => {
      setTooltipText(ttvalue.value);
    }, 100);

    return () => clearInterval(id);
  }, []);

  const { readNfc, scanFloatTab, writeNfcFloatRequest } = useNfc({
    onFloatScan: setFloatData,
    onLiveScan: setHistoricalData,
    setFormattedFloatData,
    setGraphTitle,
    setPromptVisible: setNfcPromptVisible
  });

  return (
    <ImageBackground
      source={require('./assets/vtrfeedersolutionsinc_logo.png')}
      style={{ flex: 1 , backgroundColor: theme.background}}
      resizeMode="contain"
      imageStyle={{ opacity: 0.2 }}
    >
      {/* Sticky Header */}
      <ModeSelector selectedMode={selectedMode} onSelect={setSelectedMode} theme={theme} />

      <ScrollView contentContainerStyle={styles.container} scrollEnabled={scrollEnabled}>
        {/* Float Data Tab */}
        {selectedMode === 'float' && (
          <>
             <TouchableOpacity style={styles.floatScanButton} onPress={scanFloatTab}>
              <Text style={styles.scanButtonText}>🔄 Scan Float Data</Text>
            </TouchableOpacity>
            <View style={styles.card}>
              <FloatChart
                formattedFloatData={formattedFloatData}
                graphTitle={graphTitle}
                font={font}
                ttvalue={ttvalue}
                state={state}
                isActive={isActive}
                theme={theme}
              />
            </View>

            <View style={styles.card}>
              <FloatDataList data={floatData} theme={theme} />
            </View>
          </>
        )}

        <TimeRangeModal
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          onSelect={(value) => {
            setSelectedRange(value);
            setModalVisible(false);
            writeNfcFloatRequest(currentFieldName, value);
          }}
          theme={theme}
        />

        <NfcPromptModal
          visible={nfcPromptVisible}
          onCancel={() => setNfcPromptVisible(false)}
          theme={theme}
        />

        {selectedMode === 'live' && (
          <View>
            <TouchableOpacity style={styles.scanButton} onPress={readNfc}>
              <Text style={styles.scanButtonText}>🔄 Scan NFC</Text>
            </TouchableOpacity>

            <LiveDataSection
              historicalData={historicalData}
              onRequestField={(field) => {
                setCurrentFieldName(field);
                setModalVisible(true);
              }}
              theme={theme}
            />
          </View>
        )}

      </ScrollView>
    </ImageBackground>
  );
};

export default App;
