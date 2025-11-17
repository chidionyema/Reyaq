'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { MoodOption, MatchResult } from '@/utils/types'
import { useApi } from '@/app/hooks/useApi'
import { useAuthSession } from '@/app/hooks/useAuthSession'

type Props = {
  moods: MoodOption[]
}

export default function MoodSelector({ moods }: Props) {
  const router = useRouter()
  const api = useApi()
  const session = useAuthSession()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const ready = Boolean(session?.access_token)

  const handleSelect = async (moodId: string) => {
    if (loading || !ready) {
      setError('Please sign in to start.')
      return
    }
    setSelectedId(moodId)
    setError(null)
    setLoading(true)

    try {
      await api('/api/mood/select', { method: 'POST', body: { moodId } })
      const match = await api<MatchResult>('/api/match/request', {
        method: 'POST',
        body: { moodId },
      })

      if (match.status === 'matched') {
        const params = new URLSearchParams({
          roomId: match.roomId,
          synclight: match.synclight ? '1' : '0',
          mood: match.moodId,
        })
        router.push(`/app/moment/${match.momentId}?${params.toString()}`)
      } else {
        // Find the mood slug from the selected mood
        const selectedMood = moods.find((m) => m.id === moodId)
        if (selectedMood) {
          router.push(`/match/${selectedMood.slug}`)
        } else {
          setError('Mood not found')
          setSelectedId(null)
        }
      }
    } catch (err) {
      setError((err as Error).message)
      setSelectedId(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {moods.map((mood) => (
          <button
            key={mood.id}
            className={`rounded-3xl border border-white/20 bg-gradient-to-tr px-6 py-6 text-left text-white shadow-lg transition hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
              selectedId === mood.id
                ? 'ring-2 ring-white'
                : 'opacity-90 hover:opacity-100'
            } ${mood.color}`}
            disabled={loading || !ready}
            onClick={() => handleSelect(mood.id)}
          >
            <div className="flex items-center gap-3 text-2xl font-semibold">
              <span>{mood.emoji}</span>
              <span>{mood.label}</span>
            </div>
            {selectedId === mood.id && (
              <p className="mt-3 text-sm uppercase tracking-[0.3em] text-white/80">
                {loading ? 'Finding your person...' : 'Hold tight'}
              </p>
            )}
          </button>
        ))}
      </div>
      {!ready && (
        <p className="rounded-2xl border border-amber-200 bg-white/80 px-4 py-3 text-sm text-amber-700">
          Sign in with Supabase auth to unlock Shared Moments.
        </p>
      )}
      {error && (
        <p className="rounded-2xl border border-red-200 bg-white/80 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}
      <p className="text-sm text-ink-shadow/60">
        We pair you with one other person feeling this exact mood right now.
      </p>
    </div>
  )
}


