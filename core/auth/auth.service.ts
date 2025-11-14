import type { User } from '@supabase/supabase-js'
import { prisma } from '@/lib/prisma'
import { createSupabaseRouteClient } from '@/lib/supabase/server'
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
  const rawUrl = process.env.DATABASE_URL ?? ''
  if (!rawUrl) {
    console.error('[DB] DATABASE_URL missing')
  } else {
    const maskedUrl = rawUrl.replace(
      /\/\/([^:]+):([^@]+)@/,
      (_match, user) => `//${user}:***@`
    )
    console.error('[DB] DATABASE_URL (masked):', maskedUrl)
  }

  const profile = await prisma.profile.upsert({
    where: { userId: authUser.id },
    update: {
      email: authUser.email ?? '',
      fullName: authUser.user_metadata?.full_name ?? null,
      avatarUrl: authUser.user_metadata?.avatar_url ?? null,
      updatedAt: new Date(),
    },
    create: {
      userId: authUser.id,
      email: authUser.email ?? '',
      fullName: authUser.user_metadata?.full_name ?? null,
      avatarUrl: authUser.user_metadata?.avatar_url ?? null,
    },
  })

  eventBus.emit('user_logged_in', { userId: profile.userId })

  return toAuthenticatedProfile(profile)
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


