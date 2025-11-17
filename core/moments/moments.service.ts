import { randomUUID } from 'crypto'
import { getSupabaseServiceClient } from '@/lib/supabase/service'
import { eventBus } from '../events/event-bus'
import { createRitualContext, getRitual } from './rituals/ritual-engine'
import type { MomentResponseInput } from './moments.types'

type MomentRow = {
  id: string
  created_at: string
  user_a_id: string
  user_b_id: string
  mood: string
  prompt: string
  user_a_response: string | null
  user_b_response: string | null
  synclight: boolean
  room_id: string | null
}

const mapMoment = (row: MomentRow) => ({
  id: row.id,
  createdAt: row.created_at,
  userAId: row.user_a_id,
  userBId: row.user_b_id,
  mood: row.mood,
  prompt: row.prompt,
  userAResponse: row.user_a_response,
  userBResponse: row.user_b_response,
  synclight: row.synclight,
  roomId: row.room_id ?? undefined,
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

  const { data, error } = await supabase
    .from('moments')
    .insert({
      id: randomUUID(),
      user_a_id: input.userAId,
      user_b_id: input.userBId,
      mood: input.moodId,
      prompt: ritual.prompt,
      synclight: input.synclight,
      room_id: input.roomId ?? null,
      // created_at has DEFAULT NOW() so let DB handle it
    })
    .select('id, user_a_id, user_b_id, mood, prompt, user_a_response, user_b_response, synclight, room_id, created_at')
    .single()

  if (error || !data) {
    throw new Error(error?.message ?? 'Unable to create moment')
  }

  const moment = mapMoment(data)

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
    .select('id, user_a_id, user_b_id, user_a_response, user_b_response, mood, prompt, synclight, room_id, created_at')
    .eq('id', input.momentId)
    .single()

  if (fetchError || !existing) {
    throw new Error(fetchError?.message ?? 'Moment not found')
  }

  const moment = mapMoment(existing)

  ensureParticipant(moment, input.userId)

  const data =
    moment.userAId === input.userId
      ? { user_a_response: input.response }
      : { user_b_response: input.response }

  const { data: updatedRow, error: updateError } = await supabase
    .from('moments')
    .update(data)
    .eq('id', moment.id)
    .select('id, user_a_id, user_b_id, user_a_response, user_b_response, mood, prompt, synclight, room_id, created_at')
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
    .select('id, user_a_id, user_b_id, mood, prompt, user_a_response, user_b_response, synclight, room_id, created_at')
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
    .select('id, user_a_id, user_b_id, mood, prompt, user_a_response, user_b_response, synclight, room_id, created_at')
    .eq('room_id', roomId)
    .order('created_at', { ascending: true })

  if (error || !data) {
    throw new Error(error?.message ?? 'Unable to load moments')
  }

  return data.map(mapMoment)
}



