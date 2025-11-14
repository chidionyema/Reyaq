'use client'

import { useEffect } from 'react'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

type Handler<TPayload> = (payload: TPayload) => void

export const useRealtimeChannel = <TPayload = unknown>(
  channelName?: string | null,
  eventName?: string,
  handler?: Handler<TPayload>
) => {
  useEffect(() => {
    if (!channelName || !eventName || !handler) {
      return
    }

    const supabase = getSupabaseBrowserClient()
    const channel = supabase.channel(channelName)

    channel.on('broadcast', { event: eventName }, ({ payload }) => {
      handler(payload as TPayload)
    })

    channel.subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [channelName, eventName, handler])
}


