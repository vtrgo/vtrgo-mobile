import React from 'react';
import { View, Text, ScrollView } from 'react-native';

export default function HelpScreen({ theme }) {
  const scanColor = theme.accent || '#4CAF50'; // Accent color for highlighting scan steps

  const steps = [
    { text: 'Press ', highlight: 'Scan NFC', rest: ' and scan for the initial data tags and values.' },
    { text: 'Press ', highlight: 'Request Data', rest: ' on a float tag and then select the time range you want. Scan the NFC chip.' },
    { text: 'Navigate to the "Float Data" tab and press ', highlight: 'Scan Float Data', rest: ' to receive the float data. It will populate the graph.' },
    { text: 'Use the fullscreen chart option for a clearer view of trends.' },
    { text: 'Repeat scans as needed to refresh your data or collect new readings.' }
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.background, padding: 16 }}>
      <Text style={{ color: theme.text, fontSize: 22, fontWeight: 'bold' }}>
        How to Use
      </Text>

      {steps.map((step, index) => (
        <Text
          key={index}
          style={{
            color: theme.text,
            marginTop: 8,
            fontSize: 16,
            lineHeight: 22
          }}
        >
          {index + 1}.{' '}
          {step.highlight ? (
            <>
              {step.text}
              <Text style={{ color: scanColor, fontWeight: 'bold' }}>{step.highlight}</Text>
              {step.rest}
            </>
          ) : (
            step.text
          )}
        </Text>
      ))}
    </ScrollView>
  );
}
