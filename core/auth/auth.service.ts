import type { User } from '@supabase/supabase-js'
import { createSupabaseRouteClient } from '@/lib/supabase/server'
import { getSupabaseServiceClient } from '@/lib/supabase/service'
import type { AuthContext, AuthenticatedProfile } from './auth.types'
import { eventBus } from '../events/event-bus'

const toAuthenticatedProfile = (payload: {
  userId: string
  email: string
  fullName: string | null
  avatarUrl: string | null
}): AuthenticatedProfile => ({
  userId: payload.userId,
  email: payload.email,
  fullName: payload.fullName,
  avatarUrl: payload.avatarUrl,
})

export const syncProfileFromAuthUser = async (authUser: User) => {
  const supabase = getSupabaseServiceClient()

  const payload = {
    user_id: authUser.id,
    email: authUser.email ?? '',
    full_name: authUser.user_metadata?.full_name ?? null,
    avatar_url: authUser.user_metadata?.avatar_url ?? null,
  }

  const { data, error } = await supabase
    .from('profiles')
    .upsert(payload, { onConflict: 'user_id' })
    .select('user_id, email, full_name, avatar_url')
    .single()

  if (error || !data) {
    throw new Error(error?.message ?? 'Unable to sync profile')
  }

  const profile = toAuthenticatedProfile({
    userId: data.user_id,
    email: data.email,
    fullName: data.full_name,
    avatarUrl: data.avatar_url,
  })

  eventBus.emit('user_logged_in', { userId: profile.userId })

  return profile
}

export const authenticateRequest = async (): Promise<AuthContext> => {
  const supabase = createSupabaseRouteClient()
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()

  if (error || !session?.user) {
    throw new Error('Invalid session')
  }

  const profile = await syncProfileFromAuthUser(session.user)

  return { profile, accessToken: session.access_token ?? '' }
}


