import { randomUUID } from 'crypto'
import { getSupabaseServiceClient } from '@/lib/supabase/service'
import { eventBus } from '../events/event-bus'
import { getRoomById } from '../rooms/rooms.service'
import { broadcastToRoom } from '../events/realtime.publisher'

type MessageRow = {
  id: string
  room_id: string
  sender_id: string
  content: string
  created_at: string
}

const mapMessage = (row: MessageRow) => ({
  id: row.id,
  roomId: row.room_id,
  senderId: row.sender_id,
  content: row.content,
  createdAt: row.created_at,
})

export const sendMessage = async (
  roomId: string,
  senderId: string,
  content: string
) => {
  await getRoomById(roomId, senderId)

  const supabase = getSupabaseServiceClient()
  const now = new Date().toISOString()
  const { data, error } = await supabase
    .from('messages')
    .insert({
      id: randomUUID(),
      room_id: roomId,
      sender_id: senderId,
      content,
      created_at: now,
    })
    .select('*')
    .single()

  if (error || !data) {
    throw new Error(error?.message ?? 'Unable to send message')
  }

  const message = mapMessage(data)

  eventBus.emit('message_sent', {
    roomId,
    messageId: message.id,
  })

  await broadcastToRoom(roomId, 'message_sent', { message })

  return message
}

export const listMessages = async (roomId: string, viewerId: string) => {
  await getRoomById(roomId, viewerId)
  const supabase = getSupabaseServiceClient()
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('room_id', roomId)
    .order('created_at', { ascending: true })

  if (error || !data) {
    throw new Error(error?.message ?? 'Unable to list messages')
  }

  return data.map(mapMessage)
}


