import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ImageBackground, useColorScheme } from 'react-native';
import NfcManager from 'react-native-nfc-manager';
import { useChartPressState, useChartTransformState } from 'victory-native';
import { useFont } from "@shopify/react-native-skia";
import { useDerivedValue } from "react-native-reanimated";
import AsyncStorage from '@react-native-async-storage/async-storage';

import ModeSelector from '../Components/ModeSelector';
import FloatChart from '../Components/FloatChart';
import FloatDataList from '../Components/FloatDataList';
import NfcPromptModal from '../Components/NfcPromptModal';
import TimeRangeModal from '../Components/TimeRangeModal';
import LiveDataSection from '../Components/LiveDataSection';
import FullscreenChartModal from '../Components/FullscreenChartModal';
import SettingsScreen from './SettingsScreen';
import { useNfc } from '../hooks/useNfc';
import { createStyles } from '../styles';

NfcManager.start();

export default function NfcScreen({ theme }) {
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
  const [showModal, setShowModal] = useState(false);
  const styles = createStyles(theme);
  const [isTestMode, setIsTestMode] = useState(false)

    useEffect(() => {
      AsyncStorage.getItem('testModeEnabled').then((val) => {
        const isTest = val === 'true';
        setIsTestMode(val === 'true');
        console.log('🔹 Test mode read from AsyncStorage:', isTest);
      });
    }, []);
  
  const [historicalData, setHistoricalData] = useState({
    boolean_percentages: {},
    fault_counts: {},
    float_averages: {}
  });

  const handleNfcCancel = async () => {
    try {
      await NfcManager.cancelTechnologyRequest();
    } catch (e) {
      console.warn('No active NFC request to cancel:', e);
    } finally {
      setNfcPromptVisible(false);
    }
  };

  const font = useFont(require('../roboto.ttf'), 12);
  const ttFont = useFont(require('../roboto-bold.ttf'), 24);
  const ttvalue = useDerivedValue(() => {
    return state.y.value.value.value.toFixed(2);
  }, [state]);

  useEffect(() => {
    setScrollEnabled(!isActive);
  }, [isActive]);

  const transformState = useChartTransformState({ scaleX: 1.0, scaleY: 1.0 });

  useEffect(() => {
    const id = setInterval(() => {
      setTooltipText(ttvalue.value);
    }, 100);
    return () => clearInterval(id);
  }, []);

  console.log('🔹 Passing testMode to useNfc:', isTestMode);
  const { readNfc, scanFloatTab, writeNfcFloatRequest } = useNfc({
    onFloatScan: setFloatData,
    onLiveScan: setHistoricalData,
    setFormattedFloatData,
    setGraphTitle,
    setPromptVisible: setNfcPromptVisible,
    testMode: isTestMode,
  });

  return (
    <ImageBackground
      source={require('../assets/vtrfeedersolutionsinc_logo.png')}
      style={{ flex: 1, backgroundColor: theme.background }}
      resizeMode="contain"
      imageStyle={{ opacity: 0.2 }}
    >
      <ModeSelector selectedMode={selectedMode} onSelect={setSelectedMode} theme={theme} />

      <ScrollView contentContainerStyle={styles.container} scrollEnabled={scrollEnabled}>
        {selectedMode === 'float' && (
          <>
            <TouchableOpacity style={styles.floatScanButton} onPress={scanFloatTab}>
              <Text style={styles.scanButtonText}>🔄 Scan Float Data</Text>
            </TouchableOpacity>
            <View style={styles.card}>
              <TouchableOpacity style={styles.fullscreenButton} onPress={() => setShowModal(true)}>
                <Text style={{ color: 'white' }}>🔍 Fullscreen</Text>
              </TouchableOpacity>
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

        <NfcPromptModal visible={nfcPromptVisible} onCancel={handleNfcCancel} theme={theme} />

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

      <FullscreenChartModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        theme={theme}
        formattedFloatData={formattedFloatData}
        transformState={transformState}
        font={font}
        ttFont={ttFont}
        state={state}
        isActive={isActive}
      />
    </ImageBackground>
  );
}
