import AsyncStorage from '@react-native-async-storage/async-storage';

const HISTORY_KEY = 'history';

export async function getHistory() {
  try {
    const jsonValue = await AsyncStorage.getItem(HISTORY_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('[getHistory] Error:', e);
    return [];
  }
}

export async function saveToHistory(entry) {
  try {
    const history = await getHistory();
    const newHistory = [
      { id: Date.now().toString(), timestamp: new Date().toISOString(), ...entry },
      ...history,
    ];
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  } catch (e) {
    console.error('[saveToHistory] Error:', e);
  }
}

export async function deleteHistoryItem(id) {
  try {
    const history = await getHistory();
    const newHistory = history.filter((item) => item.id !== id);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  } catch (e) {
    console.error('[deleteHistoryItem] Error:', e);
  }
}

export async function clearHistory() {
  try {
    await AsyncStorage.removeItem(HISTORY_KEY);
  } catch (e) {
    console.error('[clearHistory] Error:', e);
  }
}
