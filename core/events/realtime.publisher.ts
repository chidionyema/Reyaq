import type { RealtimeChannel } from '@supabase/supabase-js'
import { getSupabaseServiceClient } from '@/lib/supabase/service'
import { createLogger } from '@/utils/helpers'

const logger = createLogger('realtime-publisher')
const channels = new Map<string, RealtimeChannel>()

const getChannel = (name: string) => {
  const supabase = getSupabaseServiceClient()
  let channel = channels.get(name)
  if (!channel) {
    channel = supabase.channel(name, { config: { broadcast: { ack: true } } })
    channel.subscribe((status) => {
      logger.info(`Channel ${name} status ${status}`)
    })
    channels.set(name, channel)
  }
  return channel
}

const send = async (channelName: string, event: string, payload: unknown) => {
  const channel = getChannel(channelName)
  const response = await channel.send({
    type: 'broadcast',
    event,
    payload,
  })
  if (response !== 'ok') {
    logger.error('Realtime send failed', { response, channelName, event })
  }
}

export const broadcastToUser = async (
  userId: string,
  event: string,
  payload: unknown
) => send(`user:${userId}`, event, payload)

export const broadcastToRoom = async (
  roomId: string,
  event: string,
  payload: unknown
) => send(`room:${roomId}`, event, payload)


