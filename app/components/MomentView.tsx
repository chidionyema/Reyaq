'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useApi } from '@/app/hooks/useApi'
import { useAuthSession } from '@/app/hooks/useAuthSession'
import SynclightPulse from './SynclightPulse'

type MomentViewModel = {
  id: string
  prompt: string
  userAId: string
  userBId: string
  userAResponse: string | null
  userBResponse: string | null
}

type Props = {
  moment: MomentViewModel
  roomId?: string
  isSynclight?: boolean
}

export default function MomentView({ moment, roomId, isSynclight }: Props) {
  const router = useRouter()
  const api = useApi()
  const session = useAuthSession()
  const [response, setResponse] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [latestMoment, setLatestMoment] = useState(moment)
  const [error, setError] = useState<string | null>(null)

  const currentUserId = session?.user?.id

  // Subscribe to real-time moment updates
  useRealtimeChannel<{ moment: MomentViewModel }>(
    currentUserId ? `user:${currentUserId}` : null,
    'moment_updated',
    (payload) => {
      // Only update if this is the same moment
      if (payload.moment.id === latestMoment.id) {
        setLatestMoment(payload.moment)
      }
    }
  )
  const isUserA = currentUserId === latestMoment.userAId
  const isUserB = currentUserId === latestMoment.userBId
  const myResponse = isUserA
    ? latestMoment.userAResponse
    : isUserB
      ? latestMoment.userBResponse
      : null

  const partnerResponse = isUserA
    ? latestMoment.userBResponse
    : isUserB
      ? latestMoment.userAResponse
      : null

  const bothResponded = Boolean(
    latestMoment.userAResponse && latestMoment.userBResponse
  )

  const canSubmit = !myResponse && response.trim().length > 0 && !submitting

  const waitingCopy = useMemo(() => {
    if (myResponse && !partnerResponse) {
      return 'You answered. Waiting for your partner to finish their thought.'
    }
    if (!myResponse) {
      return 'Share your line to unlock theirs.'
    }
    return ''
  }, [myResponse, partnerResponse])

  const handleSubmit = async () => {
    if (!response.trim()) return
    if (!session?.access_token) {
      setError('Sign in again to continue.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const data = await api<{ moment: MomentViewModel }>('/api/moment/respond', {
        method: 'POST',
        body: { momentId: moment.id, response: response.trim() },
      })
      setLatestMoment(data.moment)
      setResponse('')
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-mist-white px-6 py-10">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 rounded-3xl bg-white p-6 shadow-xl">
        <div className="space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-ink-shadow/60">
            Finish My Thought
          </p>
          <h1 className="text-3xl font-semibold text-ink-shadow">
            {latestMoment.prompt}
          </h1>
          {isSynclight && <SynclightPulse />}
        </div>
        <div className="space-y-4">
          {!myResponse && (
            <>
              <textarea
                className="min-h-[140px] w-full rounded-2xl border border-ink-shadow/10 bg-mist-white/70 p-4 text-base text-ink-shadow outline-none focus:border-reyaq-violet"
                placeholder="Let your mind finish the sentence…"
                value={response}
                onChange={(event) => setResponse(event.target.value)}
              />
              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="w-full rounded-2xl bg-gradient-violet-ember px-6 py-4 text-base font-semibold text-white shadow-lg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? 'Sending...' : 'Send my line'}
              </button>
            </>
          )}
          {myResponse && (
            <div className="rounded-2xl border border-ink-shadow/10 bg-mist-white/80 p-4 text-left text-lg text-ink-shadow">
              <p className="text-sm uppercase tracking-[0.3em] text-ink-shadow/50">
                You shared
              </p>
              <p className="mt-2">{myResponse}</p>
            </div>
          )}
          {waitingCopy && (
            <p className="text-sm text-ink-shadow/60">{waitingCopy}</p>
          )}
        </div>
        {bothResponded && (
          <div className="space-y-4 rounded-3xl border border-ink-shadow/10 bg-gradient-to-br from-white to-mist-white/90 p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-ink-shadow/60">
              Shared Moment
            </p>
            <div className="space-y-4 text-left text-lg">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-ink-shadow/40">
                  You
                </p>
                <p>{myResponse}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-ink-shadow/40">
                  Them
                </p>
                <p>{partnerResponse}</p>
              </div>
            </div>
          </div>
        )}
        {error && (
          <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => router.push('/app')}
            className="flex-1 rounded-2xl border border-ink-shadow/10 bg-white px-6 py-3 text-base font-semibold text-ink-shadow hover:border-ink-shadow/20"
          >
            Do another moment
          </button>
          <button
            onClick={() => router.push('/')}
            className="flex-1 rounded-2xl border border-transparent bg-ink-shadow px-6 py-3 text-base font-semibold text-white hover:opacity-90"
          >
            Exit
          </button>
          {roomId && (
            <button
              onClick={() => router.push(`/app/room/${roomId}`)}
              className="flex-1 rounded-2xl border border-transparent bg-gradient-violet-pink px-6 py-3 text-base font-semibold text-white hover:opacity-90"
            >
              Go to room
            </button>
          )}
        </div>
      </div>
    </div>
  )
}


