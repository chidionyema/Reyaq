'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useApi } from '@/app/hooks/useApi'
import { useAuthSession } from '@/app/hooks/useAuthSession'
import GlobalHeader from '@/app/components/GlobalHeader'
import type { Mood } from '@/core/moods/moods.types'
import type { Fragment } from '@/core/fragments/fragments.service'

type Props = {
  mood: Mood
  initialFragments: Fragment[]
}

type FragmentsResponse = {
  mood: Mood
  fragments: Fragment[]
}

export default function SharedSpace({ mood, initialFragments }: Props) {
  const api = useApi()
  const session = useAuthSession()
  const [fragments, setFragments] = useState(initialFragments)
  const [newFragment, setNewFragment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [userPseudonym, setUserPseudonym] = useState<string | null>(null)
  const fragmentsEndRef = useRef<HTMLDivElement>(null)

  const isAuthenticated = Boolean(session?.access_token)

  useEffect(() => {
    if (isAuthenticated) {
      const loadPseudonym = async () => {
        try {
          const data = await api<{ pseudonym: string | null }>('/api/user/pseudonym')
          setUserPseudonym(data.pseudonym)
        } catch (error) {
          console.error('Failed to load pseudonym', error)
        }
      }
      loadPseudonym()
    }
  }, [isAuthenticated, api])

  useEffect(() => {
    if (fragmentsEndRef.current) {
      fragmentsEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [fragments.length])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFragment.trim() || !isAuthenticated) return

    setSubmitting(true)
    try {
      const data = await api<{ fragment: Fragment }>(
        `/api/mood/${mood.slug}/fragments/create`,
        {
          method: 'POST',
          body: { content: newFragment.trim(), type: 'text' },
        }
      )
      setFragments((prev) => [data.fragment, ...prev])
      setNewFragment('')
      setShowForm(false)
    } catch (error) {
      console.error('Failed to submit fragment', error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-mist-white">
      <GlobalHeader />

      <main className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-semibold mb-3 text-ink-shadow">
            {mood.name}
          </h1>
          <p className="text-sm text-ink-shadow/60 mb-2">
            {mood.description ?? 'the soft, vulnerable layer'}
          </p>
          {isAuthenticated && userPseudonym && (
            <p className="text-xs text-ink-shadow/50">
              You are: {userPseudonym}
            </p>
          )}
        </div>

        {/* Fragment Wall */}
        <div className="mb-8">
          <p className="text-xs text-ink-shadow/50 mb-4 text-center">
            Every fragment here was written by someone who was feeling this mood. Add yours when you&apos;re ready.
          </p>
        </div>

        <div className="space-y-4">
          {fragments.map((fragment) => (
            <article
              key={fragment.id}
              className="rounded-2xl border border-ink-shadow/5 bg-white/80 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-shadow/50">
                    {fragment.pseudonym ?? 'Anonymous'}
                  </span>
                </div>
                <time className="text-xs text-ink-shadow/40">
                  {new Date(fragment.createdAt).toLocaleString([], {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </time>
              </div>
              <p className="text-ink-shadow leading-relaxed whitespace-pre-wrap">
                {fragment.content}
              </p>
            </article>
          ))}
          <div ref={fragmentsEndRef} />
        </div>

        {fragments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-ink-shadow/60">
              No fragments yet. Be the first to share.
            </p>
          </div>
        )}

        {/* Composer Area - Sticky at bottom */}
        <div className="sticky bottom-0 bg-mist-white/95 backdrop-blur border-t border-ink-shadow/5 pt-6 mt-8">
          {!isAuthenticated ? (
            <div className="rounded-2xl border border-ink-shadow/10 bg-white/80 p-6 text-center">
              <p className="text-sm text-ink-shadow/70 mb-4">
                Want to add something to this space?
              </p>
              <Link
                href={`/login?redirectTo=/mood/${mood.slug}`}
                className="inline-block rounded-xl bg-ink-shadow px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
              >
                Log in to contribute
              </Link>
              <p className="text-xs text-ink-shadow/50 mt-3">
                Adding emotion requires logging in — no profile, no followers. Just presence.
              </p>
            </div>
          ) : (
            <div>
              {!showForm ? (
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full rounded-2xl border-2 border-dashed border-ink-shadow/20 bg-white/80 px-6 py-4 text-ink-shadow/60 hover:border-ink-shadow/40 hover:text-ink-shadow transition-all"
                >
                  + Add your line
                </button>
              ) : (
                <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-6 shadow-lg border border-ink-shadow/5">
                  {userPseudonym && (
                    <p className="text-xs text-ink-shadow/50 mb-2">
                      Posting as {userPseudonym}
                    </p>
                  )}
                  <textarea
                    value={newFragment}
                    onChange={(e) => setNewFragment(e.target.value)}
                    placeholder="Share your emotional fragment..."
                    className="w-full min-h-[120px] rounded-xl border border-ink-shadow/10 bg-mist-white/70 p-4 text-ink-shadow placeholder:text-ink-shadow/40 focus:outline-none focus:border-reyaq-violet resize-none"
                    maxLength={2000}
                  />
                  <div className="mt-4 flex gap-3">
                    <button
                      type="submit"
                      disabled={!newFragment.trim() || submitting}
                      className="flex-1 rounded-xl bg-gradient-violet-ember px-6 py-3 text-white font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'Sharing...' : 'Send'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false)
                        setNewFragment('')
                      }}
                      className="rounded-xl border border-ink-shadow/10 bg-white px-6 py-3 text-ink-shadow hover:border-ink-shadow/20"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Connect live CTA (only for logged-in users) */}
          {isAuthenticated && (
            <div className="mt-6 text-center">
              <p className="text-xs text-ink-shadow/50 mb-3">Want to go deeper?</p>
              <Link
                href="/mood-select"
                className="inline-block rounded-xl border border-ink-shadow/20 bg-white/50 px-6 py-2 text-sm text-ink-shadow/70 hover:border-ink-shadow/40 hover:text-ink-shadow transition-all"
              >
                Connect live with someone
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

