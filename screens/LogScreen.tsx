import React, { useState } from 'react'
import { View, Button, StyleSheet, Text } from 'react-native'
import { supabase } from '../lib/supabase'
import { useHistoryData } from '../context/HistoryContext'

export default function LogScreen({ theme }) {
  const [status, setStatus] = useState<string | null>(null)
  const { currentData } = useHistoryData()

  async function logCurrentData() {
    if (!currentData) {
      setStatus('⚠️ No current data selected')
      return
    }

    const { data, error } = await supabase
      .from('History')
      .insert([currentData])

    if (error) {
      console.error('Error inserting:', error.message)
      setStatus(`❌ ${error.message}`)
    } else {
      console.log('Inserted into Supabase:', data)
      setStatus('✅ Current data logged to Supabase!')
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log Current Data to Supabase</Text>
      <Button title="Send Current Data" onPress={logCurrentData} />
      {status && <Text style={styles.status}>{status}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  status: {
    marginTop: 12,
    textAlign: 'center',
  },
})
