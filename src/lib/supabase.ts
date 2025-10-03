import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface SpinResult {
  id: string
  created_at: string
  symbols: string[]
  bet_amount: number
  win_amount: number
  is_winner: boolean
}
