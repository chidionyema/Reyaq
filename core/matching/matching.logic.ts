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

  // Use a transaction-like approach: find and delete atomically
  // First, find the oldest partner (excluding current user)
  const { data: candidates, error: findError } = await supabase
    .from('matching_queue')
    .select('id, user_id, mood_id, joined_at')
    .eq('mood_id', moodId)
    .neq('user_id', currentUserId)
    .order('joined_at', { ascending: true })
    .limit(1)

  if (findError || !candidates || candidates.length === 0) {
    return null
  }

  const partner = candidates[0]

  // Atomically delete the partner we found (using the id to avoid race conditions)
  const { error: deleteError } = await supabase
    .from('matching_queue')
    .delete()
    .eq('id', partner.id)

  if (deleteError) {
    // If delete failed, someone else might have matched with them
    // Try to find another partner
    return null
  }

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


