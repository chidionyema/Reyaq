import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set')
}

if (!supabaseServiceRoleKey) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')
}

type ServiceClient = SupabaseClient

let serviceClient: ServiceClient | null = null

const createSupabaseServiceClient = () =>
  createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
    },
  })

export const getSupabaseServiceClient = (): ServiceClient => {
  if (!serviceClient) {
    // Verify env vars are set (will throw if missing)
    if (!supabaseUrl || !supabaseServiceRoleKey) {
      console.error('[getSupabaseServiceClient] Missing env vars:', {
        hasUrl: !!supabaseUrl,
        hasServiceKey: !!supabaseServiceRoleKey,
        serviceKeyLength: supabaseServiceRoleKey?.length ?? 0,
      })
    }
    serviceClient = createSupabaseServiceClient()
  }
  return serviceClient!
}



