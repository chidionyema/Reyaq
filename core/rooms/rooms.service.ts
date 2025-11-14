import { prisma } from '@/lib/prisma'
import { eventBus } from '../events/event-bus'

const normalizePair = (userAId: string, userBId: string) =>
  [userAId, userBId].sort()

export const getOrCreateRoom = async (userAId: string, userBId: string) => {
  const [first, second] = normalizePair(userAId, userBId)

  const existing = await prisma.room.findFirst({
    where: {
      OR: [
        { userAId: first, userBId: second },
        { userAId: second, userBId: first },
      ],
    },
  })

  if (existing) {
    return existing
  }

  const room = await prisma.room.create({
    data: {
      userAId: first,
      userBId: second,
    },
  })

  eventBus.emit('room_created', {
    roomId: room.id,
    userAId: room.userAId,
    userBId: room.userBId,
  })

  return room
}

export const getRoomById = async (roomId: string, viewerId: string) => {
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: {
      moments: { orderBy: { createdAt: 'asc' } },
      messages: { orderBy: { createdAt: 'asc' } },
    },
  })

  if (!room) {
    throw new Error('Room not found')
  }

  if (room.userAId !== viewerId && room.userBId !== viewerId) {
    throw new Error('Access denied')
  }

  return room
}


