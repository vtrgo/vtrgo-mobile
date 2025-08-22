// components/Auth.tsx
import React, { useState } from 'react'
import { Alert, View, TextInput, Button, StyleSheet } from 'react-native'
import { supabase } from '../lib/supabase'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function signInWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  async function signUpWithEmail() {
    setLoading(true)
    const { data: { session }, error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) Alert.alert(error.message)
    if (!session) Alert.alert('Check your inbox for email verification!')
    setLoading(false)
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        autoCapitalize="none"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <View style={styles.button}>
        <Button title="Sign In" onPress={signInWithEmail} disabled={loading} />
      </View>
      <View style={styles.button}>
        <Button title="Sign Up" onPress={signUpWithEmail} disabled={loading} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 6,
    padding: 10,
    marginVertical: 8,
  },
  button: {
    marginVertical: 6,
  },
})
