import { StyleSheet } from 'react-native';

export const createStyles = (theme: {
  background: string;
  text: string;
  card: string;
  primary: string;
  danger: string;
  fadedText: string;
  header: string;
  border: string;
  modal: string;
}) =>
  StyleSheet.create({
    container: {
      padding: 20,
      marginTop: 0,
      marginBottom: 50,
      paddingBottom: 100,
      backgroundColor: theme.background,
    },
    selectionContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    selectionBox: {
      flex: 1,
      marginHorizontal: 5,
      padding: 20,
      borderRadius: 12,
      backgroundColor: theme.card,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    selectionBoxActive: {
      backgroundColor: theme.primary,
    },
    selectionText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.primary,
    },
    selectionTextActive: {
      color: '#fff',
    },
    rangeContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    rangeBox: {
      flex: 1,
      marginHorizontal: 5,
      paddingVertical: 10,
      borderRadius: 8,
      backgroundColor: theme.card,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    rangeBoxActive: {
      backgroundColor: theme.primary,
    },
    rangeText: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.text,
    },
    rangeTextActive: {
      color: '#fff',
    },
    scanButton: {
      backgroundColor: theme.primary,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 10,
      alignItems: 'center',
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 3,
    },
    scanButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    floatScanButton: {
      backgroundColor: theme.danger,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 10,
      alignItems: 'center',
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 3,
    },
    card: {
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 28,
      marginBottom: 16,
      borderWidth: 15,
      borderColor: theme.border,
    },
    header: {
      fontSize: 24,
      fontWeight: '900',
      marginTop: 10,
      color: theme.header,
    },
    item: {
      fontSize: 16,
      marginVertical: 3,
      color: theme.text,
    },
    bold: {
      fontWeight: 'bold',
    },
    sectionHeader: {
      fontSize: 22,
      fontWeight: 'bold',
      marginTop: 20,
      marginBottom: 10,
      textAlign: 'center',
      color: theme.primary,
    },
    noDataText: {
      fontSize: 14,
      color: theme.fadedText,
      fontStyle: 'italic',
      textAlign: 'center',
      padding: 20,
    },
    itemRow: {
      marginBottom: 8,
      paddingVertical: 6,
      paddingHorizontal: 4,
      borderBottomWidth: 0.5,
      borderColor: theme.border,
    },
    nfcButton: {
      marginTop: 4,
      backgroundColor: theme.primary,
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 8,
      alignSelf: 'flex-start',
    },
    nfcButtonText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: '600',
    },
    button: {
      padding: 12,
      backgroundColor: theme.primary,
      borderRadius: 8,
      marginVertical: 10,
    },
    buttonText: {
      color: 'white',
      textAlign: 'center',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.4)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      width: '80%',
      backgroundColor: theme.modal,
      padding: 20,
      borderRadius: 12,
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 16,
      color: theme.text,
    },
    rangeButton: {
      padding: 12,
      backgroundColor: '#E0E0E0',
      borderRadius: 6,
      marginVertical: 6,
      width: '100%',
      alignItems: 'center',
    },
    cancelButton: {
      marginTop: 10,
    },
    cancelText: {
      color: 'red',
      fontSize: 16,
    },
    chartValue: {
      textAlign: 'center',
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 10,
      color: theme.text,
    },
    subheader: {
      fontSize: 18,
      fontWeight: '600',
      marginTop: 15,
      marginBottom: 5,
      color: theme.fadedText,
    },
  });
