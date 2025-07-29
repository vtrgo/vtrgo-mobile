import React from 'react';
import { Modal, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { createStyles } from '../styles';

const NfcPromptModal = ({ visible, onCancel, theme }) => {
  if (!theme) {
    console.error('❌ NfcPromptModal received undefined theme');
    return null; // or a fallback modal
  }

  const styles = createStyles(theme);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Hold your phone near the tag</Text>
          <ActivityIndicator size="large" color="#007bff" style={{ marginVertical: 20 }} />
          <TouchableOpacity style={styles.button} onPress={onCancel}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default NfcPromptModal;
