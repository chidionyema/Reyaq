'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useApi } from '@/app/hooks/useApi'
import { useAuthSession } from '@/app/hooks/useAuthSession'
import { useRealtimeChannel } from '@/app/hooks/useRealtimeChannel'
import type { MatchResult, MatchMade } from '@/utils/types'
import SynclightPulse from './SynclightPulse'
import { MOOD_OPTIONS } from '@/core/moods/moods.constants'

type Props = {
  moodId?: string
}

export default function MatchingScreen({ moodId }: Props) {
  const router = useRouter()
  const api = useApi()
  const session = useAuthSession()
  const [synclight, setSynclight] = useState(false)
  const [status, setStatus] = useState<'queueing' | 'waiting'>('queueing')
  const [error, setError] = useState<string | null>(null)
  const ready = Boolean(session?.access_token)

  const handleMatch = useCallback(
    (payload: MatchMade) => {
      setSynclight(payload.synclight)
      setStatus('waiting')
      const params = new URLSearchParams({
        roomId: payload.roomId,
        synclight: payload.synclight ? '1' : '0',
        mood: payload.moodId,
      })
      router.push(`/app/moment/${payload.momentId}?${params.toString()}`)
    },
    [router]
  )

  useEffect(() => {
    if (!moodId || !ready) return
    let cancelled = false

    const enqueue = async () => {
      try {
        setStatus('queueing')
        const result = await api<MatchResult>('/api/match/request', {
          method: 'POST',
          body: { moodId },
        })
        if (cancelled) return
        if (result.status === 'matched') {
          handleMatch(result)
        } else {
          setStatus('waiting')
        }
      } catch (err) {
        if (!cancelled) {
          setError((err as Error).message)
        }
      }
    }

    enqueue()
    return () => {
      cancelled = true
    }
  }, [api, moodId, handleMatch, ready])

  useRealtimeChannel<MatchMade>(
    session?.user ? `user:${session.user.id}` : null,
    'match_made',
    (payload) => {
      handleMatch(payload)
    }
  )

  if (!moodId) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-ink-shadow text-white">
        <p className="text-lg">Pick a mood to start matching.</p>
        <button
          className="mt-4 rounded-full bg-white/10 px-6 py-3 text-sm uppercase tracking-[0.3em]"
          onClick={() => router.push('/app')}
        >
          Go to moods
        </button>
      </div>
    )
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-ink-shadow text-white">
        <p>Connecting you securely to Reyaq…</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink-shadow text-white">
      <div className="mx-auto flex max-w-lg flex-col items-center gap-6 px-6 text-center">
        <p className="text-sm uppercase tracking-[0.4em] text-white/50">
          {status === 'queueing' ? 'Syncing you up' : 'Listening for resonance'}
        </p>
        <h1 className="text-4xl font-semibold">
          Finding someone on your wavelength…
        </h1>
        <p className="text-base text-white/70">
          Stay with us. When someone else picks this mood, we’ll pull you both
          into a shared moment instantly.
        </p>
        <div className="relative mt-4 flex h-40 w-40 items-center justify-center rounded-full bg-gradient-violet-pink text-xl font-semibold shadow-2xl">
          <span>
            {MOOD_OPTIONS.find((mood) => mood.id === moodId)?.label ?? moodId}
          </span>
          <div className="absolute inset-0 rounded-full border border-white/30 animate-ping" />
        </div>
        {synclight && <SynclightPulse />}
        {error && (
          <p className="rounded-2xl border border-white/30 bg-white/10 px-4 py-3 text-sm text-red-200">
            {error}
          </p>
        )}
        <button
          className="mt-6 text-sm text-white/60 underline"
          onClick={() => router.push('/app')}
        >
          Change mood
        </button>
      </div>
    </div>
  )
}


