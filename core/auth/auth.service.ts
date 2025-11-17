import { randomUUID } from 'crypto'
import type { User } from '@supabase/supabase-js'
import { createSupabaseRouteClient } from '@/lib/supabase/server'
import { getSupabaseServiceClient } from '@/lib/supabase/service'
import type { AuthContext, AuthenticatedProfile } from './auth.types'
import { eventBus } from '../events/event-bus'
import { assignPseudonym } from '../pseudonyms/pseudonyms.service'

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

  const now = new Date().toISOString()

  // Check if profile exists
  const { data: existing } = await supabase
    .from('profiles')
    .select('user_id')
    .eq('user_id', authUser.id)
    .maybeSingle()

  let data
  let error

  if (existing) {
    // Update existing profile - only update fields that can change
    const result = await supabase
      .from('profiles')
      .update({
        email: authUser.email ?? '',
        full_name: authUser.user_metadata?.full_name ?? null,
        avatar_url: authUser.user_metadata?.avatar_url ?? null,
        updated_at: now,
      })
      .eq('user_id', authUser.id)
      .select('user_id, email, full_name, avatar_url')
      .single()
    data = result.data
    error = result.error
  } else {
    // Insert new profile - explicitly set all required fields
    const result = await supabase
      .from('profiles')
      .insert({
        id: randomUUID(),
        user_id: authUser.id,
        email: authUser.email ?? '',
        full_name: authUser.user_metadata?.full_name ?? null,
        avatar_url: authUser.user_metadata?.avatar_url ?? null,
        created_at: now,
        updated_at: now,
      })
      .select('user_id, email, full_name, avatar_url')
      .single()
    data = result.data
    error = result.error
  }

  if (error || !data) {
    console.error('[syncProfileFromAuthUser] Supabase error:', {
      error: error?.message,
      code: error?.code,
      details: error?.details,
      hint: error?.hint,
      userId: authUser.id,
      existing: !!existing,
    })
    throw new Error(error?.message ?? 'Unable to sync profile')
  }

  // Assign pseudonym if this is a new profile
  if (!existing) {
    try {
      await assignPseudonym(authUser.id)
    } catch (pseudonymError) {
      console.error('[syncProfileFromAuthUser] Failed to assign pseudonym:', pseudonymError)
      // Don't fail the entire login if pseudonym assignment fails
    }
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


