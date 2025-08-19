import { useCallback } from 'react';
import { Alert } from 'react-native';
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';
import { groupByPrefix, printStructuredJson } from '../utils/dataUtils';
import { fakeNfcData, fakeNfcFloatData } from '../utils/testData';
import Sound from 'react-native-sound';
import { useTestMode } from '../context/testModeContext'; // ✅ now from context

Sound.setCategory('Playback');
const scanBeep = new Sound('scan_beep.mp3', Sound.MAIN_BUNDLE, (err) => {
  if (err) console.warn('🔇 Failed to load sound', err);
});
const playBeep = () => {
  if (scanBeep && scanBeep.isLoaded()) {
    scanBeep.setVolume(1.0);
    scanBeep.play((success) => {
      if (!success) console.warn('⚠️ Sound playback failed');
    });
  }
};

function handleNfcError(e: unknown) {
  if (e instanceof Error && e.message?.toLowerCase().includes('cancel')) {
    console.log('👋 NFC action cancelled by user.');
  } else {
    console.warn('❌ NFC error:', e);
  }
}

export function useNfc({
  onFloatScan,
  onLiveScan,
  setPromptVisible,
  setFormattedFloatData,
  setGraphTitle,
}: {
  onFloatScan: (data: any) => void;
  onLiveScan: (data: any) => void;
  setPromptVisible: (v: boolean) => void;
  setFormattedFloatData: (v: any) => void;
  setGraphTitle: (title: string) => void;
}) {
  const { testMode } = useTestMode(); // ✅ always up-to-date

  const cancelTech = async () => {
    try {
      await NfcManager.cancelTechnologyRequest();
    } catch {}
  };

  const processTagData = (jsonPayload: any) => {
    const groupedData = { ...jsonPayload };
    if (groupedData.boolean_percentages) {
      groupedData.boolean_percentages = groupByPrefix(groupedData.boolean_percentages);
    }
    if (groupedData.fault_counts) {
      groupedData.fault_counts = groupByPrefix(groupedData.fault_counts);
    }
    if (groupedData.float_averages) {
      const nestedFloats: Record<string, any> = {};
      Object.entries(groupedData.float_averages).forEach(([key, value]) => {
        const parts = key.split('.');
        if (parts.length < 3) return;
        const [, group, field] = parts;
        if (!nestedFloats[group]) nestedFloats[group] = {};
        nestedFloats[group][field] = value;
      });
      groupedData.float_averages = nestedFloats;
    }
    return groupedData;
  };

  const readNfc = useCallback(async () => {
    setPromptVisible(true);

    try {
      let jsonPayload: any;

      if (testMode) {
        jsonPayload = fakeNfcData;
      } else {
        await NfcManager.requestTechnology(NfcTech.Ndef);
        const tag = await NfcManager.getTag();
        if (!tag.ndefMessage) return;

        const payload = new Uint8Array(tag.ndefMessage[0].payload);
        const jsonString = String.fromCharCode(...payload);

        try {
          jsonPayload = JSON.parse(jsonString);
        } catch (err) {
          console.error('❌ Failed to parse JSON:', err);
          Alert.alert('Data Error', 'Received incomplete or corrupted data. Rescan NFC data.');
          return;
        }
      }

      printStructuredJson(jsonPayload);
      playBeep();

      const groupedData = processTagData(jsonPayload);
      onLiveScan(groupedData);
    } catch (e) {
      handleNfcError(e);
    } finally {
      setPromptVisible(false);
      cancelTech();
    }
  }, [onLiveScan, setPromptVisible, testMode]); // ✅ testMode in deps

const scanFloatTab = useCallback(async () => {
  setPromptVisible(true);

  try {
    let jsonPayload: any;

    if (testMode) {
      jsonPayload = fakeNfcFloatData;
    } else {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      if (!tag.ndefMessage) return;

      const payload = new Uint8Array(tag.ndefMessage[0].payload);
      const jsonString = String.fromCharCode(...payload);

      try {
        jsonPayload = JSON.parse(jsonString);
      } catch (err) {
        console.error('❌ Failed to parse JSON:', err);
        Alert.alert('Data Error', 'Received incomplete or corrupted float data. Rescan NFC data.');
        return;
      }
    }

    // Validate structure
    if (!jsonPayload.start || !jsonPayload.interval || !Array.isArray(jsonPayload.values)) {
      console.error('❌ Invalid float format:', jsonPayload);
      throw new Error('Invalid float format');
    }

    playBeep();

    const startTime = new Date(jsonPayload.start).getTime();
    const intervalMs = jsonPayload.interval * 1000;

    // Create expanded data with unique timestamps
    const expanded = jsonPayload.values.map((value, i) => {
      return {
        value,
        timestamp: startTime + i * intervalMs, // numeric timestamp
      };
    });


    // Pass to chart
    onFloatScan(expanded);
    setFormattedFloatData(expanded);
  } catch (e) {
    console.error('❌ scanFloatTab error:', e);
    handleNfcError(e);
  } finally {
    setPromptVisible(false);
    cancelTech();
  }
}, [onFloatScan, setFormattedFloatData, setPromptVisible, testMode]);




  const writeNfcFloatRequest = useCallback(
    async (fieldName: string, range = '-30m') => {
      const fullFieldName = fieldName.startsWith('Floats.') ? fieldName : `Floats.${fieldName}`;

      const payload = {
        cmd: 'float_range',
        field: fullFieldName,
        start: range,
        stop: 'now()',
      };

      setGraphTitle(fullFieldName);

      try {
        await cancelTech();
        setPromptVisible(true);
        await NfcManager.requestTechnology(NfcTech.Ndef);

        const bytes = Ndef.encodeMessage([Ndef.textRecord(JSON.stringify(payload))]);
        await NfcManager.ndefHandler.writeNdefMessage(bytes);
      } catch (err) {
        console.warn('❌ NFC write error:', err);
      } finally {
        setPromptVisible(false);
        cancelTech();
      }
    },
    [setGraphTitle, setPromptVisible]
  );

  return {
    readNfc,
    scanFloatTab,
    writeNfcFloatRequest,
  };
}
