import type { User } from '@supabase/supabase-js'
import { prisma } from '@/lib/prisma'
import { createSupabaseRouteClient } from '@/lib/supabase/server'
import type { AuthContext } from './auth.types'
import { eventBus } from '../events/event-bus'

export const syncProfileFromAuthUser = async (authUser: User) => {
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


