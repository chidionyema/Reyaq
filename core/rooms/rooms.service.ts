import { randomUUID } from 'crypto'
import { getSupabaseServiceClient } from '@/lib/supabase/service'
import { eventBus } from '../events/event-bus'

const normalizePair = (userAId: string, userBId: string) =>
  [userAId, userBId].sort()

type RoomRow = {
  id: string
  createdAt: string
  userAId: string
  userBId: string
}

type MessageRow = {
  id: string
  roomId: string
  senderId: string
  content: string
  createdAt: string
}

type MomentRow = {
  id: string
  prompt: string
  createdAt: string
  userAResponse: string | null
  userBResponse: string | null
}

const mapRoom = (row: RoomRow) => ({
  id: row.id,
  userAId: row.userAId,
  userBId: row.userBId,
  createdAt: row.createdAt,
})

const mapMessage = (row: MessageRow) => ({
  id: row.id,
  roomId: row.roomId,
  senderId: row.senderId,
  content: row.content,
  createdAt: row.createdAt,
})

const mapMomentSummary = (row: MomentRow) => ({
  id: row.id,
  prompt: row.prompt,
  createdAt: row.createdAt,
  userAResponse: row.userAResponse,
  userBResponse: row.userBResponse,
})

export const getOrCreateRoom = async (userAId: string, userBId: string) => {
  const supabase = getSupabaseServiceClient()
  const [first, second] = normalizePair(userAId, userBId)

  const { data: existing, error: findError } = await supabase
    .from('rooms')
    .select('*')
    .or(
      `and(userAId.eq.${first},userBId.eq.${second}),and(userAId.eq.${second},userBId.eq.${first})`
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
      id: randomUUID(),
      userAId: first,
      userBId: second,
      // created_at has DEFAULT NOW() so let DB handle it
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
      .select('id, prompt, createdAt, userAResponse, userBResponse')
      .eq('roomId', roomId)
      .order('createdAt', { ascending: true }),
    supabase
      .from('messages')
      .select('*')
      .eq('roomId', roomId)
      .order('createdAt', { ascending: true }),
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


