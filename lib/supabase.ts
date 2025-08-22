
import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

// ⚠️ Replace these with your Supabase project values
const supabaseUrl = 'https://xathodinfetkjqnjudnr.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhdGhvZGluZmV0a2pxbmp1ZG5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3ODE4NjEsImV4cCI6MjA3MTM1Nzg2MX0._DXbknoAqm633AJq5Ttwu-q9iNOlBUbNv8JC-CG2Sm4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
