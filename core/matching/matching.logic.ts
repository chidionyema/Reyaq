import { randomUUID } from 'crypto'
import { getSupabaseServiceClient } from '@/lib/supabase/service'

type QueueEntry = {
  userId: string
  moodId: string
  joinedAt: Date
}

export const enqueueUser = async (
  moodId: string,
  userId: string
): Promise<QueueEntry> => {
  const supabase = getSupabaseServiceClient()
  const now = new Date().toISOString()

  // Remove user from any existing queue entries first
  await supabase
    .from('matching_queue')
    .delete()
    .eq('user_id', userId)

  // Insert new queue entry
  const { error } = await supabase.from('matching_queue').insert({
    id: randomUUID(),
    user_id: userId,
    mood_id: moodId,
    joined_at: now,
  })

  if (error) {
    throw new Error(`Failed to enqueue user: ${error.message}`)
  }

  return {
    userId,
    moodId,
    joinedAt: new Date(now),
  }
}

export const popPartner = async (
  moodId: string,
  currentUserId: string
): Promise<QueueEntry | null> => {
  const supabase = getSupabaseServiceClient()

  // Find a partner in the same mood queue (excluding current user)
  const { data: partner, error } = await supabase
    .from('matching_queue')
    .select('user_id, mood_id, joined_at')
    .eq('mood_id', moodId)
    .neq('user_id', currentUserId)
    .order('joined_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (error || !partner) {
    return null
  }

  // Remove the partner from queue
  await supabase.from('matching_queue').delete().eq('user_id', partner.user_id)

  return {
    userId: partner.user_id,
    moodId: partner.mood_id,
    joinedAt: new Date(partner.joined_at),
  }
}

export const removeUserFromQueue = async (userId: string) => {
  const supabase = getSupabaseServiceClient()
  await supabase.from('matching_queue').delete().eq('user_id', userId)
}


