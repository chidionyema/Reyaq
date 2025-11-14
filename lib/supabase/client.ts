'use client'

import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set')
}

if (!supabaseAnonKey) {
  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set')
}

let client: ReturnType<typeof createBrowserSupabaseClient> | null = null

export const createSupabaseBrowserClient = () =>
  createBrowserSupabaseClient({
    supabaseUrl,
    supabaseKey: supabaseAnonKey,
  })

export const getSupabaseBrowserClient = () => {
  if (!client) {
    client = createSupabaseBrowserClient()
  }
  return client
}



