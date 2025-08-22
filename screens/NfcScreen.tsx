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
import { useHistoryData } from '../context/HistoryContext';
import { supabase } from '../lib/supabase';

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
  const [isTestMode, setIsTestMode] = useState(false);
  const { saveToHistory, currentData, setCurrentData } = useHistoryData();

  const saveCurrentData = () => {
    const entry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      floatData,
      historicalData
    };
    saveToHistory(entry); // updates context + AsyncStorage
  };
  useEffect(() => {
    if (currentData) {
      setFloatData(currentData.floatData || []);
      setHistoricalData(currentData.historicalData || {});
      setGraphTitle(currentData.projectName || '');
    }
  }, [currentData]);
  const logToSupabase = async () => {
    const projectName = historicalData?.project_meta?.['Project Name'];

    const snapshot = {
      timestamp: new Date().toISOString(),
      projectName: projectName || 'Untitled Project',
      floatData,
      historicalData,
    };

    const { data, error } = await supabase.from('History').insert([snapshot]);

    if (error) {
      console.error('Supabase insert error:', error.message);
      alert(`❌ ${error.message}`);
    } else {
      console.log('Inserted into Supabase:', data);
      alert('✅ Data logged to Supabase!');
    }
  };


  
  useEffect(() => {
    const formatted = floatData.map(d => ({
      timestamp: d.timestamp || new Date().toISOString(),
      value: d.value ?? 0,
    }));
    setFormattedFloatData(formatted);
  }, [floatData]);

 

    useEffect(() => {
      AsyncStorage.getItem('testModeEnabled').then((val) => {
        const isTest = val === 'true';
        setIsTestMode(val === 'true');
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
        <TouchableOpacity
          style={styles.scanButton}
          onPress={() => {

            const projectName = historicalData?.project_meta?.['Project Name'];

            const snapshot = { floatData, historicalData, projectName };

            saveToHistory(snapshot);
          }}
        >
          <Text style={styles.scanButtonText}>💾 Save to History</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.scanButton}
          onPress={logToSupabase}
        >
          <Text style={styles.scanButtonText}>☁️ Log to Supabase</Text>
        </TouchableOpacity>

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
