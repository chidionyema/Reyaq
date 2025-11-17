import { randomUUID } from 'crypto'
import { getSupabaseServiceClient } from '@/lib/supabase/service'
import { eventBus } from '../events/event-bus'

export type FragmentType = 'text' | 'audio' | 'doodle'

export type Fragment = {
  id: string
  moodId: string
  userId: string
  type: FragmentType
  content: string
  createdAt: string
  pseudonym?: string // Included when fetching for display
}

export type CreateFragmentInput = {
  moodId: string
  userId: string
  type: FragmentType
  content: string
}

type FragmentRow = {
  id: string
  mood_id: string
  user_id: string
  type: string
  content: string
  created_at: string
}

const mapFragment = (row: FragmentRow, pseudonym?: string): Fragment => ({
  id: row.id,
  moodId: row.mood_id,
  userId: row.user_id,
  type: row.type as FragmentType,
  content: row.content,
  createdAt: row.created_at,
  ...(pseudonym && { pseudonym }),
})

export const createFragment = async (input: CreateFragmentInput): Promise<Fragment> => {
  const supabase = getSupabaseServiceClient()

  const fragmentId = randomUUID()
  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from('fragments')
    .insert({
      id: fragmentId,
      mood_id: input.moodId,
      user_id: input.userId,
      type: input.type,
      content: input.content,
    })
    .select('id, mood_id, user_id, type, content, created_at')
    .single()

  if (error || !data) {
    throw new Error(error?.message ?? 'Unable to create fragment')
  }

  const fragment = mapFragment(data)

  eventBus.emit('fragment_created', {
    fragmentId: fragment.id,
    moodId: fragment.moodId,
    userId: fragment.userId,
  })

  return fragment
}

export const listFragmentsForMood = async (
  moodId: string,
  limit: number = 50,
  offset: number = 0
): Promise<Fragment[]> => {
  const supabase = getSupabaseServiceClient()

  // Fetch fragments with pseudonyms
  const { data: fragments, error: fragmentsError } = await supabase
    .from('fragments')
    .select('id, mood_id, user_id, type, content, created_at')
    .eq('mood_id', moodId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (fragmentsError || !fragments) {
    throw new Error(fragmentsError?.message ?? 'Unable to load fragments')
  }

  // Fetch pseudonyms for all unique user IDs
  const userIds = [...new Set(fragments.map((f) => f.user_id))]
  const { data: profiles } = await supabase
    .from('profiles')
    .select('user_id, pseudonym')
    .in('user_id', userIds)

  const pseudonymMap = new Map(
    profiles?.map((p) => [p.user_id, p.pseudonym]) ?? []
  )

  return fragments.map((f) =>
    mapFragment(f, pseudonymMap.get(f.user_id) ?? undefined)
  )
}

export const getFragmentById = async (fragmentId: string): Promise<Fragment | null> => {
  const supabase = getSupabaseServiceClient()

  const { data, error } = await supabase
    .from('fragments')
    .select('id, mood_id, user_id, type, content, created_at')
    .eq('id', fragmentId)
    .single()

  if (error || !data) {
    return null
  }

  // Fetch pseudonym
  const { data: profile } = await supabase
    .from('profiles')
    .select('pseudonym')
    .eq('user_id', data.user_id)
    .maybeSingle()

  return mapFragment(data, profile?.pseudonym ?? undefined)
}

