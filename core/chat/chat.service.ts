import { prisma } from '@/lib/prisma'
import { eventBus } from '../events/event-bus'
import { getRoomById } from '../rooms/rooms.service'
import { broadcastToRoom } from '../events/realtime.publisher'

export const sendMessage = async (
  roomId: string,
  senderId: string,
  content: string
) => {
  await getRoomById(roomId, senderId)

  const message = await prisma.message.create({
    data: {
      roomId,
      senderId,
      content,
    },
  })

  eventBus.emit('message_sent', {
    roomId,
    messageId: message.id,
  })

  await broadcastToRoom(roomId, 'message_sent', { message })

  return message
}

export const listMessages = async (roomId: string, viewerId: string) => {
  await getRoomById(roomId, viewerId)
  return prisma.message.findMany({
    where: { roomId },
    orderBy: { createdAt: 'asc' },
  })
}


