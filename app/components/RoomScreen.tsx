'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { Message, Moment, Room } from '@prisma/client'
import { useApi } from '@/app/hooks/useApi'
import { useRealtimeChannel } from '@/app/hooks/useRealtimeChannel'
import { useAuthSession } from '@/app/hooks/useAuthSession'

type RoomPayload = Room & {
  moments: Moment[]
  messages: Message[]
}

type RoomResponse = {
  room: RoomPayload
}

type MessageEvent = {
  message: Message
}

type Props = {
  roomId: string
}

export default function RoomScreen({ roomId }: Props) {
  const api = useApi()
  const session = useAuthSession()
  const [room, setRoom] = useState<RoomPayload | null>(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const ready = Boolean(session?.access_token)

  const loadRoom = useCallback(async () => {
    if (!ready) return
    try {
      setLoading(true)
      const data = await api<RoomResponse>(`/api/room/${roomId}`, {
        cache: 'no-store',
      })
      setRoom(data.room)
      setError(null)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }, [api, roomId, ready])

  useEffect(() => {
    loadRoom()
  }, [loadRoom])

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [room?.messages.length])

  const handleSend = async () => {
    if (!message.trim()) return
    if (!ready) {
      setError('Sign in to send messages.')
      return
    }
    try {
      await api(`/api/room/${roomId}/message`, {
        method: 'POST',
        body: { content: message.trim() },
      })
      setMessage('')
    } catch (err) {
      setError((err as Error).message)
    }
  }

  useRealtimeChannel<MessageEvent>(
    `room:${roomId}`,
    'message_sent',
    (payload) => {
      setRoom((prev) =>
        prev
          ? {
              ...prev,
              messages: [...prev.messages, payload.message],
            }
          : prev
      )
    }
  )

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-mist-white text-ink-shadow">
        Connecting to your session…
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-mist-white text-ink-shadow">
        Loading room...
      </div>
    )
  }

  if (!room) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-mist-white text-ink-shadow">
        {error ?? 'Room unavailable'}
      </div>
    )
  }

  const isOwnMessage = (message: Message) =>
    message.senderId === session?.user?.id

  return (
    <div className="min-h-screen bg-mist-white px-4 py-6">
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[2fr,1fr]">
        <section className="flex flex-col rounded-3xl bg-white p-6 shadow-lg">
          <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-ink-shadow/60">
            Shared Moments
          </h2>
          <div className="mt-4 space-y-4 overflow-y-auto">
            {room.moments.map((moment) => (
              <article
                key={moment.id}
                className="rounded-2xl border border-ink-shadow/5 bg-mist-white/70 p-4 text-ink-shadow"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-ink-shadow/40">
                  {new Date(moment.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
                <p className="mt-2 text-sm font-semibold text-ink-shadow/70">
                  {moment.prompt}
                </p>
                <div className="mt-3 space-y-2 text-base">
                  {moment.userAResponse && (
                    <p className="rounded-2xl bg-white/80 px-3 py-2">
                      {moment.userAResponse}
                    </p>
                  )}
                  {moment.userBResponse && (
                    <p className="rounded-2xl bg-white/80 px-3 py-2">
                      {moment.userBResponse}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="flex flex-col rounded-3xl bg-white p-6 shadow-lg">
          <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-ink-shadow/60">
            Chat
          </h2>
          <div className="mt-4 flex-1 space-y-3 overflow-y-auto">
            {room.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${isOwnMessage(msg) ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                    isOwnMessage(msg)
                      ? 'bg-gradient-violet-pink text-white'
                      : 'bg-mist-white text-ink-shadow'
                  }`}
                >
                  <p>{msg.content}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.2em] opacity-60">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="mt-4 flex flex-col gap-3">
            <textarea
              className="min-h-[80px] w-full rounded-2xl border border-ink-shadow/10 bg-mist-white p-3 text-sm"
              placeholder="Say something to keep the moment going…"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />
            <button
              onClick={handleSend}
              disabled={!message.trim()}
              className="rounded-2xl bg-ink-shadow px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Send
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}


