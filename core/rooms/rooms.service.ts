import { getSupabaseServiceClient } from '@/lib/supabase/service'
import { eventBus } from '../events/event-bus'

const normalizePair = (userAId: string, userBId: string) =>
  [userAId, userBId].sort()

type RoomRow = {
  id: string
  user_a_id: string
  user_b_id: string
  created_at: string
}

type MessageRow = {
  id: string
  room_id: string
  sender_id: string
  content: string
  created_at: string
}

type MomentRow = {
  id: string
  prompt: string
  created_at: string
  user_a_response: string | null
  user_b_response: string | null
}

const mapRoom = (row: RoomRow) => ({
  id: row.id,
  userAId: row.user_a_id,
  userBId: row.user_b_id,
  createdAt: row.created_at,
})

const mapMessage = (row: MessageRow) => ({
  id: row.id,
  roomId: row.room_id,
  senderId: row.sender_id,
  content: row.content,
  createdAt: row.created_at,
})

const mapMomentSummary = (row: MomentRow) => ({
  id: row.id,
  prompt: row.prompt,
  createdAt: row.created_at,
  userAResponse: row.user_a_response,
  userBResponse: row.user_b_response,
})

export const getOrCreateRoom = async (userAId: string, userBId: string) => {
  const supabase = getSupabaseServiceClient()
  const [first, second] = normalizePair(userAId, userBId)

  const { data: existing, error: findError } = await supabase
    .from('rooms')
    .select('*')
    .or(
      `and(user_a_id.eq.${first},user_b_id.eq.${second}),and(user_a_id.eq.${second},user_b_id.eq.${first})`
    )
    .limit(1)
    .maybeSingle()

  if (findError && findError.code !== 'PGRST116') {
    throw new Error(findError.message)
  }

  if (existing) {
    return mapRoom(existing)
  }

  const { data, error } = await supabase
    .from('rooms')
    .insert({
      user_a_id: first,
      user_b_id: second,
    })
    .select('*')
    .single()

  if (error || !data) {
    throw new Error(error?.message ?? 'Unable to create room')
  }

  const room = mapRoom(data)

  eventBus.emit('room_created', {
    roomId: room.id,
    userAId: room.userAId,
    userBId: room.userBId,
  })

  return room
}

export const getRoomById = async (roomId: string, viewerId: string) => {
  const supabase = getSupabaseServiceClient()
  const { data: roomRow, error: roomError } = await supabase
    .from('rooms')
    .select('*')
    .eq('id', roomId)
    .single()

  if (roomError || !roomRow) {
    throw new Error(roomError?.message ?? 'Room not found')
  }

  const room = mapRoom(roomRow)

  if (room.userAId !== viewerId && room.userBId !== viewerId) {
    throw new Error('Access denied')
  }

  const [{ data: moments }, { data: messages }] = await Promise.all([
    supabase
      .from('moments')
      .select('id, prompt, created_at, user_a_response, user_b_response')
      .eq('room_id', roomId)
      .order('created_at', { ascending: true }),
    supabase
      .from('messages')
      .select('*')
      .eq('room_id', roomId)
      .order('created_at', { ascending: true }),
  ])

  if (!moments) {
    throw new Error('Unable to load moments for room')
  }

  if (!messages) {
    throw new Error('Unable to load messages for room')
  }

  return {
    ...room,
    moments: moments.map(mapMomentSummary),
    messages: messages.map(mapMessage),
  }
}


