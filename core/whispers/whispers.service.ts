import { randomUUID } from 'crypto'
import { getSupabaseServiceClient } from '@/lib/supabase/service'
import { getFragmentById } from '../fragments/fragments.service'

export type Whisper = {
  id: string
  fragmentId: string
  senderId: string
  recipientId: string
  content: string
  createdAt: string
  senderPseudonym?: string
}

export type CreateWhisperInput = {
  fragmentId: string
  senderId: string
  content: string
}

type WhisperRow = {
  id: string
  fragment_id: string
  sender_id: string
  recipient_id: string
  content: string
  created_at: string
}

const mapWhisper = (row: WhisperRow, senderPseudonym?: string): Whisper => ({
  id: row.id,
  fragmentId: row.fragment_id,
  senderId: row.sender_id,
  recipientId: row.recipient_id,
  content: row.content,
  createdAt: row.created_at,
  ...(senderPseudonym && { senderPseudonym }),
})

export const createWhisper = async (input: CreateWhisperInput): Promise<Whisper> => {
  const supabase = getSupabaseServiceClient()

  // Get the fragment to find the recipient (fragment author)
  const fragment = await getFragmentById(input.fragmentId)
  if (!fragment) {
    throw new Error('Fragment not found')
  }

  // Can't whisper to yourself
  if (fragment.userId === input.senderId) {
    throw new Error('Cannot whisper to yourself')
  }

  const whisperId = randomUUID()

  const { data, error } = await supabase
    .from('whispers')
    .insert({
      id: whisperId,
      fragment_id: input.fragmentId,
      sender_id: input.senderId,
      recipient_id: fragment.userId,
      content: input.content,
    })
    .select('id, fragment_id, sender_id, recipient_id, content, created_at')
    .single()

  if (error || !data) {
    throw new Error(error?.message ?? 'Unable to create whisper')
  }

  // Fetch sender pseudonym
  const { data: senderProfile } = await supabase
    .from('profiles')
    .select('pseudonym')
    .eq('user_id', input.senderId)
    .maybeSingle()

  return mapWhisper(data, senderProfile?.pseudonym ?? undefined)
}

export const listWhispersForUser = async (userId: string): Promise<Whisper[]> => {
  const supabase = getSupabaseServiceClient()

  const { data, error } = await supabase
    .from('whispers')
    .select('id, fragment_id, sender_id, recipient_id, content, created_at')
    .eq('recipient_id', userId)
    .order('created_at', { ascending: false })

  if (error || !data) {
    throw new Error(error?.message ?? 'Unable to load whispers')
  }

  // Fetch sender pseudonyms
  const senderIds = [...new Set(data.map((w) => w.sender_id))]
  const { data: profiles } = await supabase
    .from('profiles')
    .select('user_id, pseudonym')
    .in('user_id', senderIds)

  const pseudonymMap = new Map(
    profiles?.map((p) => [p.user_id, p.pseudonym]) ?? []
  )

  return data.map((w) =>
    mapWhisper(w, pseudonymMap.get(w.sender_id) ?? undefined)
  )
}

