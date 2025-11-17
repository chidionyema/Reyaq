import { randomUUID } from 'crypto'
import { getSupabaseServiceClient } from '@/lib/supabase/service'
import { eventBus } from '../events/event-bus'
import { getRoomById } from '../rooms/rooms.service'
import { broadcastToRoom } from '../events/realtime.publisher'

type MessageRow = {
  id: string
  roomId: string
  senderId: string
  content: string
  createdAt: string
}

const mapMessage = (row: MessageRow) => ({
  id: row.id,
  roomId: row.roomId,
  senderId: row.senderId,
  content: row.content,
  createdAt: row.createdAt,
})

export const sendMessage = async (
  roomId: string,
  senderId: string,
  content: string
) => {
  await getRoomById(roomId, senderId)

  const supabase = getSupabaseServiceClient()
  const { data, error } = await supabase
    .from('messages')
    .insert({
      id: randomUUID(),
      roomId,
      senderId,
      content,
      // created_at has DEFAULT NOW() so let DB handle it
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
    .eq('roomId', roomId)
    .order('createdAt', { ascending: true })

  if (error || !data) {
    throw new Error(error?.message ?? 'Unable to list messages')
  }

  return data.map(mapMessage)
}


