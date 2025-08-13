// hooks/useNfc.ts
import { useCallback } from 'react';
import { Alert } from 'react-native';
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';
import Sound from 'react-native-sound';
import { groupByPrefix, printStructuredJson } from '../utils/dataUtils';
import { fakeNfcData } from '../utils/testData';

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

function handleNfcError(e: any) {
  if (e instanceof Error && e.message?.toLowerCase().includes('cancel')) {
    console.log('👋 NFC action cancelled by user.');
  } else {
    console.warn('❌ NFC error:', e);
  }
}

export function useNfc({
  testMode,
  onFloatScan,
  onLiveScan,
  setPromptVisible,
  setFormattedFloatData,
  setGraphTitle,
}: {
  testMode: boolean;
  onFloatScan: (data: any) => void;
  onLiveScan: (data: any) => void;
  setPromptVisible: (visible: boolean) => void;
  setFormattedFloatData: (data: any) => void;
  setGraphTitle: (title: string) => void;
}) {
  const cancelTech = useCallback(async () => {
    try {
      await NfcManager.cancelTechnologyRequest();
    } catch {}
  }, []);

  const readNfc = useCallback(async () => {
    if (testMode) {
      console.log('🔹 Test mode active: returning fake data');
      onLiveScan(fakeNfcData);

      // Format float_averages for chart
      const expanded = [];
      Object.entries(fakeNfcData.float_averages).forEach(([key, value]) => {
        const parts = key.split('.');
        if (parts.length !== 3) return;
        const [, group, field] = parts;
        expanded.push({
          group,
          field,
          value,
          timestamp: Date.now(),
        });
      });
      setFormattedFloatData(expanded);
      return;
    }

    setPromptVisible(true);
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      if (!tag.ndefMessage) return;

      const payload = new Uint8Array(tag.ndefMessage[0].payload);
      const jsonString = String.fromCharCode(...payload);

      let jsonPayload = null;
      try {
        jsonPayload = JSON.parse(jsonString);
      } catch (err) {
        console.error('❌ Failed to parse JSON:', err.message);
        Alert.alert(
          'Data Error',
          'Received incomplete or corrupted data. Please rescan.'
        );
        return;
      }

      printStructuredJson(jsonPayload);
      playBeep();

      const groupedData = { ...jsonPayload };

      // Boolean percentages
      if (groupedData.boolean_percentages) {
        groupedData.boolean_percentages = groupByPrefix(groupedData.boolean_percentages);
      }

      // Fault counts
      if (groupedData.fault_counts) {
        groupedData.fault_counts = groupByPrefix(groupedData.fault_counts);
      }

      // Float averages
      if (groupedData.float_averages) {
        const nestedFloats: Record<string, Record<string, number>> = {};
        Object.entries(groupedData.float_averages).forEach(([key, value]) => {
          const parts = key.split('.');
          if (parts.length !== 3) return;
          const [, group, field] = parts;
          if (!nestedFloats[group]) nestedFloats[group] = {};
          nestedFloats[group][field] = value;
        });
        groupedData.float_averages = nestedFloats;

        // Format for chart/list
        const expanded = [];
        Object.entries(nestedFloats).forEach(([group, fields]) => {
          Object.entries(fields).forEach(([field, value]) => {
            expanded.push({
              group,
              field,
              value,
              timestamp: Date.now(),
            });
          });
        });
        setFormattedFloatData(expanded);
      }

      onLiveScan(groupedData);
    } catch (e) {
      handleNfcError(e);
    } finally {
      setPromptVisible(false);
      cancelTech();
    }
  }, [testMode, onLiveScan, setPromptVisible, setFormattedFloatData, cancelTech]);

  const scanFloatTab = useCallback(async () => {
    if (testMode) {
      console.log('🔹 Test mode: returning fake float tab data');
      const expanded = [];
      Object.entries(fakeNfcData.float_averages).forEach(([key, value]) => {
        const parts = key.split('.');
        if (parts.length !== 3) return;
        const [, group, field] = parts;
        expanded.push({
          group,
          field,
          value,
          timestamp: Date.now(),
        });
      });
      onFloatScan(expanded);
      setFormattedFloatData(expanded);
      return;
    }

    setPromptVisible(true);
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      if (!tag.ndefMessage) return;

      const payload = new Uint8Array(tag.ndefMessage[0].payload);
      const jsonString = String.fromCharCode(...payload);
      const parsedData = JSON.parse(jsonString);

      if (!parsedData.start || !parsedData.interval || !Array.isArray(parsedData.values)) {
        throw new Error('Invalid float format');
      }

      playBeep();

      const startTime = new Date(parsedData.start).getTime();
      const intervalMs = parsedData.interval * 1000;

      const expanded = parsedData.values.map((value: number, i: number) => ({
        time: new Date(startTime + i * intervalMs).toISOString(),
        value,
      }));

      onFloatScan(expanded);
      setFormattedFloatData(expanded.map(d => ({ ...d, timestamp: new Date(d.time).getTime() })));
    } catch (e) {
      handleNfcError(e);
    } finally {
      setPromptVisible(false);
      cancelTech();
    }
  }, [testMode, onFloatScan, setFormattedFloatData, setPromptVisible, cancelTech]);

  const writeNfcFloatRequest = useCallback(
    async (fieldName: string, range = '-30m') => {
      const fullFieldName = fieldName.startsWith('Floats.') ? fieldName : `Floats.${fieldName}`;
      const payload = { cmd: 'float_range', field: fullFieldName, start: range, stop: 'now()' };

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
    [setGraphTitle, setPromptVisible, cancelTech]
  );

  return { readNfc, scanFloatTab, writeNfcFloatRequest, cancelTech };
}
