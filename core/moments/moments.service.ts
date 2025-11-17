import { randomUUID } from 'crypto'
import { getSupabaseServiceClient } from '@/lib/supabase/service'
import { eventBus } from '../events/event-bus'
import { createRitualContext, getRitual } from './rituals/ritual-engine'
import type { MomentResponseInput } from './moments.types'

type MomentRow = {
  id: string
  createdAt: string
  userAId: string
  userBId: string
  mood: string
  prompt: string
  userAResponse: string | null
  userBResponse: string | null
  synclight: boolean
  roomId: string | null
}

const mapMoment = (row: MomentRow) => ({
  id: row.id,
  createdAt: row.createdAt,
  userAId: row.userAId,
  userBId: row.userBId,
  mood: row.mood,
  prompt: row.prompt,
  userAResponse: row.userAResponse,
  userBResponse: row.userBResponse,
  synclight: row.synclight,
  roomId: row.roomId ?? undefined,
})

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
  const supabase = getSupabaseServiceClient()

  const momentId = randomUUID()
  const now = new Date().toISOString()
  
  const { data, error } = await supabase
    .from('moments')
    .insert({
      id: momentId,
      userAId: input.userAId,
      userBId: input.userBId,
      mood: input.moodId,
      prompt: ritual.prompt,
      synclight: input.synclight,
      roomId: input.roomId ?? null,
      // created_at has DEFAULT NOW() so let DB handle it
    })
    .select('id, userAId, userBId, mood, prompt, userAResponse, userBResponse, synclight, roomId')
    .single()

  if (error || !data) {
    throw new Error(error?.message ?? 'Unable to create moment')
  }

  // Map with fallback createdAt since PostgREST might not expose it in insert response
  const moment = mapMoment({
    ...data,
    createdAt: now, // Use current time as fallback
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
  const supabase = getSupabaseServiceClient()
  const { data: existing, error: fetchError } = await supabase
    .from('moments')
    .select('id, createdAt, userAId, userBId, userAResponse, userBResponse, mood, prompt, synclight, roomId')
    .eq('id', input.momentId)
    .single()

  if (fetchError || !existing) {
    throw new Error(fetchError?.message ?? 'Moment not found')
  }

  const moment = mapMoment(existing)

  ensureParticipant(moment, input.userId)

  const data =
    moment.userAId === input.userId
      ? { userAResponse: input.response }
      : { userBResponse: input.response }

  const { data: updatedRow, error: updateError } = await supabase
    .from('moments')
    .update(data)
    .eq('id', moment.id)
    .select('id, createdAt, userAId, userBId, userAResponse, userBResponse, mood, prompt, synclight, roomId')
    .single()

  if (updateError || !updatedRow) {
    throw new Error(updateError?.message ?? 'Unable to record response')
  }

  const updated = mapMoment(updatedRow)

  if (updated.userAResponse && updated.userBResponse) {
    eventBus.emit('moment_completed', { momentId: updated.id })
  }

  return updated
}

export const getMomentById = async (momentId: string) => {
  const supabase = getSupabaseServiceClient()
  const { data, error } = await supabase
    .from('moments')
    .select('id, createdAt, userAId, userBId, mood, prompt, userAResponse, userBResponse, synclight, roomId')
    .eq('id', momentId)
    .single()

  if (error || !data) {
    return null
  }

  return mapMoment(data)
}

export const listMomentsForRoom = async (roomId: string) => {
  const supabase = getSupabaseServiceClient()
  const { data, error } = await supabase
    .from('moments')
    .select('id, createdAt, userAId, userBId, mood, prompt, userAResponse, userBResponse, synclight, roomId')
    .eq('roomId', roomId)
      .order('createdAt', { ascending: true })

  if (error || !data) {
    throw new Error(error?.message ?? 'Unable to load moments')
  }

  return data.map(mapMoment)
}



