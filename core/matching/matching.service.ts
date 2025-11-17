import { eventBus } from '../events/event-bus'
import { enqueueUser, popPartner, removeUserFromQueue } from './matching.logic'
import { evaluateSynclight } from '../synclight/synclight.service'
import { createMoment } from '../moments/moments.service'
import { getOrCreateRoom } from '../rooms/rooms.service'
import { broadcastToUser } from '../events/realtime.publisher'

type MatchResponse =
  | {
      status: 'queued'
      moodId: string
    }
  | {
      status: 'matched'
      momentId: string
      roomId: string
      partnerId: string
      synclight: boolean
      moodId: string
    }

export const requestMatch = async (
  userId: string,
  moodId: string
): Promise<MatchResponse> => {
  eventBus.emit('match_attempt', { userId, moodId })
  
  // First check if there's already a partner waiting
  const partner = await popPartner(moodId, userId)
  if (partner) {
    // Found a partner! Remove current user from queue and create match
    await removeUserFromQueue(userId)
    
    const currentEntry = {
      userId,
      moodId,
      joinedAt: new Date(),
    }
    
    const synclight = evaluateSynclight(currentEntry.joinedAt, partner.joinedAt)

    const room = await getOrCreateRoom(userId, partner.userId)
    const moment = await createMoment({
      userAId: partner.userId,
      userBId: userId,
      moodId,
      synclight,
      roomId: room.id,
    })

    eventBus.emit('match_made', {
      userAId: partner.userId,
      userBId: userId,
      momentId: moment.id,
      moodId,
      synclight,
    })

    const payload = {
      momentId: moment.id,
      roomId: room.id,
      moodId,
      synclight,
    }

    await Promise.all([
      broadcastToUser(userId, 'match_made', {
        ...payload,
        partnerId: partner.userId,
      }),
      broadcastToUser(partner.userId, 'match_made', {
        ...payload,
        partnerId: userId,
      }),
    ])

    return {
      status: 'matched',
      momentId: moment.id,
      roomId: room.id,
      partnerId: partner.userId,
      synclight,
      moodId,
    }
  }

  // No partner found, enqueue current user
  await enqueueUser(moodId, userId)
  eventBus.emit('user_queued', { userId, moodId })
  
  return { status: 'queued', moodId }
}


