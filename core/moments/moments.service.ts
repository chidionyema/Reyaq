import { prisma } from '@/lib/prisma'
import { eventBus } from '../events/event-bus'
import { createRitualContext, getRitual } from './rituals/ritual-engine'
import type { MomentResponseInput } from './moments.types'

type CreateMomentInput = {
  userAId: string
  userBId: string
  moodId: string
  synclight: boolean
  ritualId?: 'finishMyThought'
  roomId?: string
}

export const createMoment = async (input: CreateMomentInput) => {
  const ritual = getRitual(input.ritualId)

  const moment = await prisma.moment.create({
    data: {
      userAId: input.userAId,
      userBId: input.userBId,
      mood: input.moodId,
      prompt: ritual.prompt,
      synclight: input.synclight,
      roomId: input.roomId,
    },
  })

  createRitualContext({
    momentId: moment.id,
    userAId: moment.userAId,
    userBId: moment.userBId,
    ritualId: input.ritualId,
  })

  eventBus.emit('moment_started', {
    momentId: moment.id,
    userAId: moment.userAId,
    userBId: moment.userBId,
  })

  if (moment.synclight) {
    eventBus.emit('synclight_triggered', {
      momentId: moment.id,
      userAId: moment.userAId,
      userBId: moment.userBId,
      moodId: moment.mood,
    })
  }

  return moment
}

const ensureParticipant = (moment: { userAId: string; userBId: string }, userId: string) => {
  if (moment.userAId !== userId && moment.userBId !== userId) {
    throw new Error('User is not part of this moment')
  }
}

export const recordMomentResponse = async (input: MomentResponseInput) => {
  const moment = await prisma.moment.findUnique({
    where: { id: input.momentId },
  })
  if (!moment) throw new Error('Moment not found')

  ensureParticipant(moment, input.userId)

  const data =
    moment.userAId === input.userId
      ? { userAResponse: input.response }
      : { userBResponse: input.response }

  const updated = await prisma.moment.update({
    where: { id: moment.id },
    data,
  })

  if (updated.userAResponse && updated.userBResponse) {
    eventBus.emit('moment_completed', { momentId: updated.id })
  }

  return updated
}

export const getMomentById = async (momentId: string) => {
  return prisma.moment.findUnique({
    where: { id: momentId },
    include: { userA: true, userB: true },
  })
}

export const listMomentsForRoom = async (roomId: string) => {
  return prisma.moment.findMany({
    where: { roomId },
    orderBy: { createdAt: 'asc' },
  })
}



