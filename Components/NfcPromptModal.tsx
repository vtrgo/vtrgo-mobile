import React from 'react';
import { Modal, View, Text, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';

export default function NfcPromptModal({ visible, onCancel }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>Hold your phone near the NFC tag</Text>
          <ActivityIndicator size="large" color="#007bff" style={{ marginVertical: 20 }} />
          <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  cancelButton: {
    marginTop: 10,
  },
  cancelText: {
    color: 'red',
    fontSize: 16,
  },
});
