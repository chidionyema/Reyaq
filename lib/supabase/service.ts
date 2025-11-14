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
    serviceClient = createSupabaseServiceClient()
  }
  return serviceClient!
}



